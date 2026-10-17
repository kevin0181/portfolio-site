import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { CarPhysics, PARK, ZONES } from "./CarPhysics";

const STATIONS = {
    readapt: { index: "01", name: "RE:ADAPT", subtitle: "UNREAL ENGINE / TPS", color: "#d78655", pale: "#e4b997" },
    karkartrider: { index: "02", name: "KARKARTRIDER", subtitle: "C++ / OPENGL / RACING", color: "#6592b1", pale: "#b8ced5" },
    inversus: { index: "03", name: "INVERSUS", subtitle: "C++ / WIN32 / ACTION", color: "#9b8eae", pale: "#d0c6d9" },
    workshop: { index: "04", name: "DEV WORKSHOP", subtitle: "AI AGENTS / DEVELOPER TOOLS", color: "#7c9e81", pale: "#bfceb8" },
};
const KEY_CODES = { KeyW: "up", ArrowUp: "up", KeyS: "down", ArrowDown: "down", KeyA: "left", ArrowLeft: "left", KeyD: "right", ArrowRight: "right", KeyE: "interact", KeyR: "reset", Space: "brake", ShiftLeft: "boostLeft", ShiftRight: "boostRight" };
const FALLBACK_KEYS = { w: "up", arrowup: "up", s: "down", arrowdown: "down", a: "left", arrowleft: "left", d: "right", arrowright: "right", e: "interact", r: "reset", " ": "brake", shift: "boostLeft" };
const keyFor = (event) => KEY_CODES[event.code] || FALLBACK_KEYS[event.key.toLowerCase()];
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const NEUTRAL = { throttle: 0, steer: 0, brake: false, boost: false };

function createVisuals(scene) {
    const cache = new Map();
    const material = (color, options = {}) => {
        const key = `${color}:${JSON.stringify(options)}`;
        if (!cache.has(key)) cache.set(key, new THREE.MeshStandardMaterial({ color, roughness: .82, flatShading: true, ...options }));
        return cache.get(key);
    };
    const mesh = (geometry, color, parent = scene) => {
        const object = new THREE.Mesh(geometry, typeof color === "string" ? material(color) : color);
        object.castShadow = true;
        object.receiveShadow = true;
        parent.add(object);
        return object;
    };
    const box = (parent, position, size, color) => {
        const object = mesh(new THREE.BoxGeometry(...size),color,parent);
        object.position.set(...position);
        return object;
    };
    const cylinder = (parent, position, radius, height, color, sides = 12) => {
        const object = mesh(new THREE.CylinderGeometry(radius,radius,height,sides),color,parent);
        object.position.set(...position);
        return object;
    };
    const polygon = (parent, position, radius, color, detail = 0) => {
        const object = mesh(new THREE.IcosahedronGeometry(radius,detail),color,parent);
        object.position.set(...position);
        return object;
    };
    const group = (position, parent = scene) => {
        const object = new THREE.Group();
        object.position.set(...position);
        parent.add(object);
        return object;
    };
    return { material,mesh,box,cylinder,polygon,group };
}

function signTexture(station) {
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 320;
    const context = canvas.getContext("2d");
    context.fillStyle = "#f4f0e5";
    context.fillRect(0,0,1024,320);
    context.fillStyle = station.color;
    context.fillRect(0,0,16,320);
    context.fillStyle = station.color;
    context.font = "700 68px Arial, sans-serif";
    context.fillText(station.index,55,114);
    context.fillStyle = "#33453f";
    context.font = "700 75px Arial, sans-serif";
    context.fillText(station.name,175,118,805);
    context.fillStyle = "#7c8578";
    context.font = "26px Arial, sans-serif";
    context.fillText(station.subtitle,177,178,770);
    context.fillStyle = station.color;
    context.fillRect(177,226,168,4);
    context.fillStyle = "#747e70";
    context.font = "25px Arial, sans-serif";
    context.fillText("PARK HERE  /  PRESS E",383,238);
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 4;
    return texture;
}

function buildPark(scene, physics) {
    const tools = createVisuals(scene);
    const { material,mesh,box,cylinder,polygon,group } = tools;
    // Ground beyond the concrete keeps the horizon calm while the camera follows the car.
    const surroundings = mesh(new THREE.PlaneGeometry(500,500),"#c5cbb7");
    surroundings.rotation.x = -Math.PI/2;
    surroundings.position.y = -.55;
    surroundings.castShadow = false;

    PARK.forEach((item) => {
        if (item.id.includes("-sign")) return;
        const geometry = item.shape === "cylinder"
            ? new THREE.CylinderGeometry(item.size[0],item.size[0],item.size[1],24)
            : new THREE.BoxGeometry(...item.size);
        const object = mesh(geometry,item.color || "#dddace");
        object.position.set(...item.position);
        if (item.rotation) object.rotation.set(...item.rotation);
        if (item.id.includes("floor")) object.castShadow = false;
        if (/ramp|bank|wedge/.test(item.id) && item.shape === "box") {
            // These painted lips follow the actual rigid ramp transform exactly.
            box(object,[0,item.size[1]/2+.013,0],[item.size[0]*.92,.018,.11],"#e5b966");
            box(object,[0,item.size[1]/2+.014,-item.size[2]*.36],[item.size[0]*.92,.02,.055],"#eee6d1");
        }
    });

    // Restrained line work makes the open park feel designed without covering it in UI.
    [[0,0,46,.065],[0,-20.8,46,.08],[0,20.8,46,.08]].forEach(([x,z,width,depth],index) => {
        if (!index) return;
        box(scene,[x,.014,z],[width,.015,depth],"#f5f1e4").castShadow = false;
    });
    [-22.7,22.7].forEach((x) => { box(scene,[x,.014,0],[.07,.015,41.6],"#f5f1e4").castShadow = false; });
    for(let index=0;index<7;index+=1) {
        box(scene,[-2.15,.017,11.4+index*.52],[.07,.018,.23],"#e9e5d8").castShadow = false;
        box(scene,[2.15,.017,11.4+index*.52],[.07,.018,.23],"#e9e5d8").castShadow = false;
    }
    const spawnArrow = new THREE.Shape();
    spawnArrow.moveTo(-.13,.65); spawnArrow.lineTo(.13,.65); spawnArrow.lineTo(.13,-.08); spawnArrow.lineTo(.5,-.08); spawnArrow.lineTo(0,-.65); spawnArrow.lineTo(-.5,-.08); spawnArrow.lineTo(-.13,-.08); spawnArrow.closePath();
    const arrow = mesh(new THREE.ShapeGeometry(spawnArrow),"#eee8d8");
    arrow.rotation.x = -Math.PI/2;
    arrow.rotation.z = Math.PI;
    arrow.position.set(0,.02,10.2);
    arrow.castShadow = false;

    ZONES.forEach((zone) => {
        const station = STATIONS[zone.id];
        const center = zone.position;
        const pad = mesh(new THREE.CircleGeometry(zone.radius || 4,64),material(station.pale,{ transparent: true, opacity: .44, depthWrite: false }));
        pad.rotation.x = -Math.PI/2;
        pad.position.set(center[0],.022,center[2]);
        pad.castShadow = false;
        const ring = mesh(new THREE.RingGeometry((zone.radius || 4)-.035,(zone.radius || 4)+.035,72),station.color);
        ring.rotation.x = -Math.PI/2;
        ring.position.set(center[0],.028,center[2]);
        ring.castShadow = false;
        // The signboard position matches its shared physics collider descriptor.
        const sign = group([center[0],0,center[2]-4.1]);
        [-1.25,1.25].forEach((x) => cylinder(sign,[x,1.05,0],.055,2.1,"#7b887a",8));
        box(sign,[0,2.15,0],[3.4,1.14,.16],"#b2b8a5");
        const face = mesh(new THREE.PlaneGeometry(3.3,1.03),new THREE.MeshStandardMaterial({ map: signTexture(station), roughness: .9 } ),sign);
        face.position.set(0,2.15,.086);
        // A second face makes the labels readable after driving around the station.
        const back = face.clone();
        back.position.z = -.086;
        back.rotation.y = Math.PI;
        sign.add(back);
        // Color-matched parking bay corners are actual ground paint, not floating markers.
        [-1,1].forEach((side) => {
            box(scene,[center[0]+side*1.25,.035,center[2]+1.1],[.045,.018,1.9],station.color).castShadow = false;
            box(scene,[center[0]+side*.9,.036,center[2]+2.02],[.7,.018,.045],station.color).castShadow = false;
        });
    });

    let randomSeed = 941;
    const random = () => { randomSeed=(randomSeed*1664525+1013904223)>>>0; return randomSeed/4294967296; };
    const tree = (x,z,scale) => {
        const treeGroup = group([x,-.45,z]);
        treeGroup.scale.setScalar(scale);
        cylinder(treeGroup,[0,1.05,0],.16,2.1,"#a48e70",7);
        const crown = polygon(treeGroup,[0,2.55,0],1.05,"#849d7f",1);
        crown.scale.set(.9,1.25,.9);
        polygon(treeGroup,[-.35,2,.2],.68,"#91ab86");
        polygon(treeGroup,[.3,2.8,-.15],.63,"#a2b593");
        cylinder(treeGroup,[0,.04,0],.82,.08,"#b3bda0",12);
    };
    for(let index=0;index<13;index+=1) {
        const x=-28+index*4.6;
        tree(x,-25.3-random()*2,.85+random()*.38);
        if(index%2===0) tree(x,25.5+random()*2,.8+random()*.35);
    }
    for(let index=0;index<8;index+=1) {
        tree(-27-random()*2,-20+index*5.4,.9+random()*.38);
        tree(27+random()*2,-20+index*5.4,.85+random()*.38);
    }
    // Decorative perimeter furniture stays outside the physically bounded driving surface.
    [-1,1].forEach((side) => {
        const bench=group([side*26,-.4,6]);
        for(let row=0;row<3;row+=1) box(bench,[0,.6,-.3+row*.28],[2.4,.13,.21],"#b49c78");
        [-.9,.9].forEach((x)=>box(bench,[x,.28,0],[.11,.56,.65],"#7d8a79"));
        cylinder(scene,[side*25.5,.05,-7],.5,1.1,"#92a18a",12);
    });

    const dynamicMeshes = physics.dynamicObjects.map((item) => {
        let geometry;
        if(item.shape === "ball") geometry = new THREE.IcosahedronGeometry(item.size[0],2);
        else if(item.shape === "barrel") geometry = new THREE.CylinderGeometry(item.size[0],item.size[0],item.size[1],16);
        else geometry = new THREE.BoxGeometry(...item.size);
        const object = mesh(geometry,item.color || "#ce925f");
        if(item.shape === "barrel") {
            [-.28,.28].forEach((y)=> {
                const band=mesh(new THREE.TorusGeometry(item.size[0]+.012,.035,4,16),"#7e8378",object);
                band.rotation.x=Math.PI/2;
                band.position.y=y;
            });
        }
        if(item.shape === "ball") {
            const stripe=mesh(new THREE.TorusGeometry(item.size[0]*1.005,.025,4,24),"#f4e4c5",object);
            stripe.rotation.x=.5;
        }
        return { object,body: item.body };
    });

    const car = group([0,0,0]);
    box(car,[0,.12,0],[1.6,.56,2.8],"#d87952");
    box(car,[0,-.13,0],[1.47,.17,2.62],"#705f52");
    box(car,[0,.48,.18],[1.38,.43,1.52],"#f1dfbc");
    box(car,[0,.74,.22],[1.43,.12,1.48],"#f1e6ce");
    const windshield=box(car,[0,.5,-.58],[1.24,.34,.055],"#3e5b61");
    windshield.rotation.x=-.22;
    const rearWindow=box(car,[0,.5,.96],[1.2,.3,.055],"#4b6666");
    rearWindow.rotation.x=.2;
    [-1,1].forEach((side)=> {
        box(car,[side*.704,.5,.16],[.045,.3,1.18],"#426167");
        box(car,[side*.732,.51,.1],[.05,.32,.055],"#efe2c5");
        box(car,[side*.81,.15,-.19],[.025,.055,.28],"#ecd5b5");
        box(car,[side*.87,.4,-.42],[.19,.12,.22],"#c57350");
        box(car,[side*.5,.19,-1.421],[.37,.16,.035],"#f9e6b6");
    });
    box(car,[0,-.01,-1.44],[1.49,.14,.11],"#5a625b");
    box(car,[0,-.01,1.44],[1.49,.14,.11],"#5a625b");
    box(car,[0,.13,-1.437],[.41,.12,.025],"#62685c");
    box(car,[0,.414,-.99],[.22,.025,.66],"#efdcbb");
    const brakeMaterial=new THREE.MeshStandardMaterial({ color: "#b94f38",emissive: "#e86035",emissiveIntensity: .05,roughness: .5 });
    [-1,1].forEach((side)=>box(car,[side*.53,.18,1.421],[.28,.14,.035],brakeMaterial));
    const wheels = Array.from({ length: 4 },()=> {
        const wheel=group([0,0,0]);
        const tire=cylinder(wheel,[0,0,0],.36,.24,"#35413b",20);
        tire.rotation.z=Math.PI/2;
        [-1,1].forEach((side)=> {
            const hub=cylinder(wheel,[side*.126,0,0],.21,.025,"#c8c7ae",12);
            hub.rotation.z=Math.PI/2;
            const cap=cylinder(wheel,[side*.144,0,0],.075,.025,"#8e9484",8);
            cap.rotation.z=Math.PI/2;
        });
        return wheel;
    });

    // Recycled tire decals and dust keep drifting expressive with a fixed resource budget.
    const skidPool=Array.from({ length: 72 },()=> {
        const mark=new THREE.Mesh(new THREE.PlaneGeometry(.14,.5),new THREE.MeshBasicMaterial({ color: "#756b58",transparent: true,opacity: .23,depthWrite: false }));
        mark.rotation.x=-Math.PI/2;
        mark.visible=false;
        scene.add(mark);
        return mark;
    });
    const dustPool=Array.from({ length: 16 },()=> {
        const puff=new THREE.Mesh(new THREE.IcosahedronGeometry(.18,0),new THREE.MeshBasicMaterial({ color: "#e7ddc6",transparent: true,opacity: 0,depthWrite: false }));
        puff.visible=false;
        scene.add(puff);
        return { mesh: puff,life: 0,vx: 0,vz: 0 };
    });
    let skidIndex=0;
    let dustIndex=0;
    let effectTime=0;
    const euler=new THREE.Euler(0,0,0,"YXZ");
    return {
        car,wheels,dynamicMeshes,
        sync(delta,input,status,reducedMotion) {
            car.position.copy(physics.chassis.position);
            car.quaternion.copy(physics.chassis.quaternion);
            wheels.forEach((wheel,index)=> {
                const transform=physics.vehicle.wheelInfos[index].worldTransform;
                wheel.position.copy(transform.position);
                wheel.quaternion.copy(transform.quaternion);
            });
            dynamicMeshes.forEach(({ object,body })=> { object.position.copy(body.position); object.quaternion.copy(body.quaternion); });
            brakeMaterial.emissiveIntensity=input.brake || input.throttle<0 ? .8 : .05;
            effectTime+=delta;
            if(status.grounded && status.speed>8 && (input.brake || (Math.abs(input.steer)>.45 && status.speed>18)) && effectTime>.065) {
                effectTime=0;
                euler.setFromQuaternion(car.quaternion,"YXZ");
                [2,3].forEach((index)=> {
                    if(!physics.vehicle.wheelInfos[index].raycastResult.hasHit) return;
                    const position=wheels[index].position;
                    const mark=skidPool[skidIndex++%skidPool.length];
                    mark.position.set(position.x,Math.max(.018,position.y-.35),position.z);
                    mark.rotation.set(-Math.PI/2,0,-euler.y);
                    mark.visible=true;
                    if(!reducedMotion) {
                        const puff=dustPool[dustIndex++%dustPool.length];
                        puff.mesh.position.set(position.x,position.y-.12,position.z);
                        puff.life=.7;
                        puff.vx=(random()-.5)*.8;
                        puff.vz=(random()-.5)*.8;
                        puff.mesh.visible=true;
                    }
                });
            }
            dustPool.forEach((puff)=> {
                if(puff.life<=0 || reducedMotion) { puff.mesh.visible=false; return; }
                puff.life-=delta;
                puff.mesh.position.x+=puff.vx*delta;
                puff.mesh.position.y+=delta*.55;
                puff.mesh.position.z+=puff.vz*delta;
                puff.mesh.scale.setScalar(1+(1-puff.life/.7)*1.5);
                puff.mesh.material.opacity=Math.max(0,puff.life/.7)*.25;
            });
        },
    };
}

export default function GameWorld({ paused = false,onStatus,onSelect,moveInput = NEUTRAL,reducedMotion = false,resetSignal = 0 }) {
    const hostRef=useRef(null);
    const runtimeRef=useRef(null);
    const latestRef=useRef({ paused,onStatus,onSelect,moveInput,reducedMotion });
    const resetRef=useRef(resetSignal);
    const [failed,setFailed]=useState(false);
    latestRef.current={ paused,onStatus,onSelect,moveInput,reducedMotion };

    useEffect(()=> {
        const host=hostRef.current;
        let renderer;
        let physics;
        try {
            renderer=new THREE.WebGLRenderer({ alpha: false,antialias: true,powerPreference: "high-performance" });
            physics=new CarPhysics();
        } catch(error) {
            renderer?.dispose();
            setFailed(true);
            latestRef.current.onStatus?.({ x: 0,z: 14,speed: 0,nearby: null,grounded: false,flipped: false,collisions: 0,ready: false });
            return undefined;
        }
        const scene=new THREE.Scene();
        scene.background=new THREE.Color("#d7dbc9");
        scene.fog=new THREE.Fog("#d7dbc9",65,125);
        const camera=new THREE.PerspectiveCamera(43,1,.1,180);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1,1.8));
        renderer.outputColorSpace=THREE.SRGBColorSpace;
        renderer.toneMapping=THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure=.98;
        renderer.shadowMap.enabled=true;
        renderer.shadowMap.type=THREE.PCFShadowMap;
        renderer.domElement.setAttribute("aria-label","실제 물리와 충돌을 사용하는 자동차 포트폴리오 맵");
        renderer.domElement.setAttribute("role","img");
        host.appendChild(renderer.domElement);
        scene.add(new THREE.AmbientLight("#faf1dc",.55));
        scene.add(new THREE.HemisphereLight("#e4edf1","#a2ab8b",1.25));
        const sun=new THREE.DirectionalLight("#fff0d4",2.9);
        sun.castShadow=true;
        sun.shadow.mapSize.set(2048,2048);
        sun.shadow.camera.left=-28;
        sun.shadow.camera.right=28;
        sun.shadow.camera.top=28;
        sun.shadow.camera.bottom=-28;
        sun.shadow.camera.far=90;
        sun.shadow.normalBias=.035;
        sun.shadow.bias=-.00012;
        sun.shadow.radius=3;
        scene.add(sun,sun.target);
        const visuals=buildPark(scene,physics);
        const keys=new Set();
        const cameraTarget=new THREE.Vector3(0,.6,10.8);
        const desiredTarget=new THREE.Vector3();
        const forward=new THREE.Vector3();
        const cameraOffset=new THREE.Vector3(12.5,17,18);
        const cameraQuaternion=new THREE.Quaternion();
        let frame=0;
        let previousTime=0;
        let lastStatusTime=-Infinity;
        let lastStatus="";
        let disposed=false;
        let contextLost=false;
        let ready=false;
        let padBlocked=false;
        let wasPaused=latestRef.current.paused;
        const canvas=renderer.domElement;
        const statusWithReady=()=> ({ ...physics.status(),ready });
        const emitStatus=(force=false)=> {
            const raw=statusWithReady();
            const snapshot={ x: Number(raw.x.toFixed(1)),z: Number(raw.z.toFixed(1)),speed: Number(raw.speed.toFixed(1)),nearby: raw.nearby,grounded: raw.grounded,flipped: raw.flipped,collisions: raw.collisions,ready: raw.ready };
            const serialized=JSON.stringify(snapshot);
            if(force || serialized!==lastStatus) { latestRef.current.onStatus?.(snapshot); lastStatus=serialized; }
        };
        const reset=()=> { keys.clear();padBlocked=true;physics.reset(); };
        runtimeRef.current={ reset,clear: ()=> { keys.clear();padBlocked=true; } };
        const resize=()=> {
            const width=Math.max(host.clientWidth,1);
            const height=Math.max(host.clientHeight,1);
            camera.aspect=width/height;
            camera.updateProjectionMatrix();
            renderer.setSize(width,height);
        };
        const observer=new ResizeObserver(resize);
        observer.observe(host);
        resize();
        const focus=()=> { if(!latestRef.current.paused) host.focus({ preventScroll: true }); };
        const isEditable=(target)=> target instanceof HTMLElement && (target.matches("input,textarea,select,button,a") || target.isContentEditable);
        const onKeyDown=(event)=> {
            if(contextLost || latestRef.current.paused || event.altKey || event.ctrlKey || event.metaKey || isEditable(event.target)) return;
            const key=keyFor(event);
            if(!key) return;
            event.preventDefault();
            if(key==="reset") { if(!event.repeat) reset(); return; }
            if(key==="interact") {
                const status=physics.status();
                if(!event.repeat && status.nearby && status.speed<7) { keys.clear();padBlocked=true;latestRef.current.onSelect?.(status.nearby); }
                return;
            }
            keys.add(event.code || key);
        };
        const onKeyUp=(event)=> { keys.delete(event.code || keyFor(event)); };
        const held=(...codes)=> codes.some((code)=> keys.has(code));
        const release=()=> { keys.clear();padBlocked=true; };
        const onContextLost=(event)=> {
            event.preventDefault();
            contextLost=true;
            ready=false;
            cancelAnimationFrame(frame);
            release();
            canvas.dataset.ready="false";
            canvas.hidden=true;
            runtimeRef.current=null;
            emitStatus(true);
            setFailed(true);
        };
        canvas.addEventListener("pointerdown",focus);
        canvas.addEventListener("webglcontextlost",onContextLost);
        window.addEventListener("keydown",onKeyDown);
        window.addEventListener("keyup",onKeyUp);
        window.addEventListener("blur",release);

        const render=(time)=> {
            if(disposed || contextLost || document.hidden) return;
            frame=requestAnimationFrame(render);
            const delta=previousTime ? Math.min((time-previousTime)/1000,.05) : 1/60;
            previousTime=time;
            const options=latestRef.current;
            if(options.paused && !wasPaused) release();
            wasPaused=options.paused;
            const pad=options.moveInput || NEUTRAL;
            const padIsNeutral=!pad.throttle && !pad.steer && !pad.brake && !pad.boost;
            if(padBlocked && padIsNeutral) padBlocked=false;
            const currentPad=padBlocked ? NEUTRAL : pad;
            const input=options.paused ? NEUTRAL : {
                throttle: clamp((held("KeyW","ArrowUp","up") ? 1 : 0)-(held("KeyS","ArrowDown","down") ? 1 : 0)+(currentPad.throttle || 0),-1,1),
                steer: clamp((held("KeyA","ArrowLeft","left") ? 1 : 0)-(held("KeyD","ArrowRight","right") ? 1 : 0)+(currentPad.steer || 0),-1,1),
                brake: held("Space","brake") || Boolean(currentPad.brake),
                boost: held("ShiftLeft","ShiftRight","boostLeft","boostRight") || Boolean(currentPad.boost),
            };
            if(!options.paused) physics.step(delta,input);
            const status=physics.status();
            visuals.sync(options.paused ? 0 : delta,input,status,options.reducedMotion);
            cameraQuaternion.copy(physics.chassis.quaternion);
            forward.set(0,0,-1).applyQuaternion(cameraQuaternion);
            forward.y=0;
            if(forward.lengthSq()>.01) forward.normalize();
            desiredTarget.set(physics.chassis.position.x,.55,physics.chassis.position.z).addScaledVector(forward,3.2);
            cameraTarget.lerp(desiredTarget,1-Math.exp(-delta*3.8));
            camera.position.copy(cameraTarget).add(cameraOffset);
            camera.lookAt(cameraTarget);
            sun.position.set(cameraTarget.x-15,30,cameraTarget.z+18);
            sun.target.position.set(cameraTarget.x,0,cameraTarget.z);
            renderer.render(scene,camera);
            canvas.dataset.x=status.x.toFixed(2);
            canvas.dataset.z=status.z.toFixed(2);
            canvas.dataset.speed=status.speed.toFixed(2);
            canvas.dataset.height=physics.chassis.position.y.toFixed(3);
            canvas.dataset.grounded=String(status.grounded);
            canvas.dataset.flipped=String(status.flipped);
            canvas.dataset.collisions=String(status.collisions);
            canvas.dataset.nearby=status.nearby || "";
            if(!ready) { ready=true;canvas.dataset.ready="true";emitStatus(true); }
            if(time-lastStatusTime>=120) { emitStatus();lastStatusTime=time; }
        };
        const onVisibility=()=> {
            release();
            if(contextLost) return;
            if(document.hidden) cancelAnimationFrame(frame);
            else { previousTime=0;frame=requestAnimationFrame(render); }
        };
        document.addEventListener("visibilitychange",onVisibility);
        frame=requestAnimationFrame(render);
        host.focus({ preventScroll: true });
        return ()=> {
            disposed=true;
            cancelAnimationFrame(frame);
            observer.disconnect();
            canvas.removeEventListener("pointerdown",focus);
            canvas.removeEventListener("webglcontextlost",onContextLost);
            window.removeEventListener("keydown",onKeyDown);
            window.removeEventListener("keyup",onKeyUp);
            window.removeEventListener("blur",release);
            document.removeEventListener("visibilitychange",onVisibility);
            const geometries=new Set();
            const materials=new Set();
            const textures=new Set();
            scene.traverse((object)=> {
                if(object.geometry) geometries.add(object.geometry);
                if(object.material) (Array.isArray(object.material) ? object.material : [object.material]).forEach((entry)=> { materials.add(entry);if(entry.map) textures.add(entry.map); });
            });
            geometries.forEach((geometry)=>geometry.dispose());
            textures.forEach((texture)=>texture.dispose());
            materials.forEach((entry)=>entry.dispose());
            sun.shadow.dispose();
            physics.dispose();
            renderer.dispose();
            canvas.remove();
            runtimeRef.current=null;
        };
    },[]);

    useEffect(()=> { if(paused) runtimeRef.current?.clear(); },[paused]);
    useEffect(()=> {
        if(resetRef.current===resetSignal) return;
        resetRef.current=resetSignal;
        runtimeRef.current?.reset();
        if(!paused && !failed) hostRef.current?.focus({ preventScroll: true });
    },[resetSignal,paused,failed]);

    return <div className="driving-world">
        <div className="driving-canvas" ref={hostRef} tabIndex={0} aria-label="자동차 운전 맵. WASD 또는 방향키로 운전, Space로 핸드브레이크, Shift로 부스트, E로 가까운 프로젝트 열기, R로 자동차 복구." />
        {failed && <div className="drive-fallback"><p>3D 맵을 표시할 수 없어요. 프로젝트는 아래에서 열어볼 수 있습니다.</p><div>{Object.entries(STATIONS).map(([id,station])=><button key={id} type="button" onClick={()=>onSelect?.(id)}>{station.name}</button>)}</div></div>}
    </div>;
}
