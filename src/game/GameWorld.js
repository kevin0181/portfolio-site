import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

const LANDMARKS = [
    { id: "readapt", label: "Re:adapt", x: -4, z: -2, stopX: -3.8, stopZ: -.35, height: 3.05 },
    { id: "karkartrider", label: "KarKartRider", x: 3, z: -3, stopX: 2.4, stopZ: -1.15, height: 1.6 },
    { id: "inversus", label: "INVERSUS", x: 3, z: 3, stopX: 2.8, stopZ: 4.8, height: 1.65 },
    { id: "workshop", label: "Dev workshop", x: -4, z: 3, stopX: -3.7, stopZ: 4.5, height: 2.35 },
];
const ISLAND_OUTLINE = [[-6.8,-4.5],[-5.8,-6.1],[-2.8,-6.65],[1,-6.45],[4.8,-6.1],[6.4,-4.1],[6.65,-.7],[6.4,3.1],[5.2,5.8],[2,6.45],[-1.9,6.55],[-5.3,5.8],[-6.6,3.2],[-6.85,-.4]];
const WALKABLE_OUTLINE = ISLAND_OUTLINE.map(([x,z]) => [x*.91,z*.91]);
const CONTROL_CODES = { KeyW: "w", KeyA: "a", KeyS: "s", KeyD: "d", KeyE: "e", KeyR: "r", ShiftLeft: "shift", ShiftRight: "shift", ArrowUp: "arrowup", ArrowDown: "arrowdown", ArrowLeft: "arrowleft", ArrowRight: "arrowright" };
const controlKey = (event) => CONTROL_CODES[event.code] || event.key.toLowerCase();

const clamp = (number, min, max) => Math.max(min, Math.min(max, number));
const walkablePoint = (x, z) => {
    let inside = false;
    let nearest = null;
    let nearestDistance = Infinity;
    for (let index=0, previous=WALKABLE_OUTLINE.length-1; index<WALKABLE_OUTLINE.length; previous=index,index+=1) {
        const [ax,az] = WALKABLE_OUTLINE[previous];
        const [bx,bz] = WALKABLE_OUTLINE[index];
        if ((az>z)!==(bz>z) && x<(bx-ax)*(z-az)/(bz-az)+ax) inside = !inside;
        const dx = bx-ax;
        const dz = bz-az;
        const t = clamp(((x-ax)*dx+(z-az)*dz)/(dx*dx+dz*dz),0,1);
        const point = { x: ax+t*dx, z: az+t*dz };
        const distance = (point.x-x)**2+(point.z-z)**2;
        if (distance<nearestDistance) { nearestDistance = distance; nearest = point; }
    }
    // The inset outline leaves room for the explorer's boots at the cliff edge.
    return inside ? { x,z } : { x: nearest.x*.999, z: nearest.z*.999 };
};

function buildIsland(scene) {
    const palette = {};
    const material = (color, extra = {}) => {
        const key = `${color}${JSON.stringify(extra)}`;
        if (!palette[key]) palette[key] = new THREE.MeshStandardMaterial({ color, roughness: .86, flatShading: true, ...extra });
        return palette[key];
    };
    const mesh = (geometry, color, parent = scene, extra = {}) => {
        const item = new THREE.Mesh(geometry, typeof color === "string" ? material(color, extra) : color);
        item.castShadow = true;
        item.receiveShadow = true;
        parent.add(item);
        return item;
    };
    const box = (parent, x, y, z, width, height, depth, color) => {
        const item = mesh(new THREE.BoxGeometry(width, height, depth), color, parent);
        item.position.set(x, y, z);
        return item;
    };
    const sphere = (parent, x, y, z, radius, color, detail = 0) => {
        const item = mesh(new THREE.IcosahedronGeometry(radius, detail), color, parent);
        item.position.set(x, y, z);
        return item;
    };
    const cylinder = (parent, x, y, z, top, bottom, height, color, sides = 10) => {
        const item = mesh(new THREE.CylinderGeometry(top, bottom, height, sides), color, parent);
        item.position.set(x, y, z);
        return item;
    };
    const groupAt = (x, y, z) => {
        const group = new THREE.Group();
        group.position.set(x, y, z);
        scene.add(group);
        return group;
    };
    const islandShape = new THREE.Shape();
    ISLAND_OUTLINE.forEach(([x, z], index) => index ? islandShape.lineTo(x, -z) : islandShape.moveTo(x, -z));
    islandShape.closePath();
    const slab = (depth, y, color, bevel, scale = 1) => {
        const item = mesh(new THREE.ExtrudeGeometry(islandShape, { depth, bevelEnabled: true, bevelSize: bevel, bevelThickness: bevel, bevelSegments: 1, steps: 1 }), color);
        item.rotation.x = -Math.PI / 2;
        item.position.y = y;
        item.scale.set(scale, scale, 1);
        return item;
    };
    slab(1.3, -1.72, "#baa88b", .38);
    slab(.28, -.4, "#d6c4a3", .17, 1.015);
    const ground = slab(.12, -.14, "#aac5a3", .08);
    const lower = slab(.28, -1.98, "#998e7a", .25, .91);
    lower.castShadow = false;

    // A soft shadow below the suspended terrain keeps the island grounded in space.
    const shadow = new THREE.Mesh(new THREE.PlaneGeometry(60, 60), new THREE.ShadowMaterial({ color: "#827b69", opacity: .16 }));
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = -2.65;
    shadow.receiveShadow = true;
    scene.add(shadow);

    const path = (ax, az, bx, bz, width = .92) => {
        const length = Math.hypot(bx - ax, bz - az);
        const strip = box(scene, (ax + bx) / 2, .095, (az + bz) / 2, width, .055, length, "#e9d9b6");
        strip.rotation.y = Math.atan2(bx - ax, bz - az);
        cylinder(scene, bx, .097, bz, width / 2, width / 2, .055, "#e9d9b6", 14);
    };
    cylinder(scene, 0, .1, .5, 1.17, 1.17, .055, "#e9d9b6", 18);
    path(0, .5, -3.8, -.35);
    path(0, .5, 2.4, -1.15);
    path(0, .5, 2.8, 4.8);
    path(0, .5, -3.7, 4.5);
    path(0, .5, 0, 4.9, .8);
    // Pebbles and small grass clusters break up the clean paths.
    [[-.5,2.4],[.8,-.3],[-1.7,.6],[1.4,2.1],[-2.6,3.1]].forEach(([x,z], index) => {
        const pebble = cylinder(scene, x, .14, z, .15, .19, .035, index % 2 ? "#cfc3a8" : "#f2e5c8", 6);
        pebble.rotation.y = index * .9;
    });

    let seed = 7381;
    const random = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
    const tree = (x, z, size = 1) => {
        const group = groupAt(x, .08, z);
        group.scale.setScalar(size);
        cylinder(group, 0, .68, 0, .105, .16, 1.35, "#9b8064", 7);
        const canopy = sphere(group, 0, 1.64, 0, .79, "#5f9274", 1);
        canopy.scale.set(.9, 1.22, .9);
        sphere(group, -.33, 1.33, .15, .5, "#81aa82");
        sphere(group, .28, 1.83, -.06, .47, "#8bb28a");
        cylinder(group, 0, .02, 0, .62, .68, .05, "#98b995", 10);
    };
    [[-5.7,-4.7,1.06],[-6,-.2,.86],[-5.9,1.5,.68],[-1.3,-5.5,1.08],[5.7,-4.9,.9],[5.9,-.1,1.1],[5.8,5,.86],[-4.8,5.8,.76],[-.7,5.8,.74]].forEach(([x,z,size]) => tree(x,z,size));
    const shrubSpots = [[-6,-3],[-2.8,-5.3],[.1,-5.7],[5.7,-2],[5.7,1.6],[4.7,5.5],[.6,5.8],[-5.7,4.6],[-2.1,4.8],[-1.9,-2.6],[.5,-2.5]];
    shrubSpots.forEach(([x,z], index) => {
        sphere(scene, x, .32, z, .4, index % 2 ? "#83a67c" : "#6d9a78");
        sphere(scene, x + .29, .24, z + .13, .29, "#91b38a");
    });
    [[-6,3.2],[5.9,3.8],[-2.3,-5.9],[5,-5.5],[-5.5,-5.6],[-1.4,5.8]].forEach(([x,z], index) => {
        const rock = sphere(scene, x, .22, z, .45, index % 2 ? "#c0c1ae" : "#e0d5bd");
        rock.scale.set(1.2,.7,.8);
        sphere(scene,x+.35,.14,z+.15,.23,"#c6c7b4");
    });
    for (let i = 0; i < 50; i += 1) {
        const angle = random() * Math.PI * 2;
        const distance = 4.8 + random() * 1.25;
        const x = Math.cos(angle) * distance;
        const z = Math.sin(angle) * distance;
        if (Math.abs(x) > 5.9 || Math.abs(z) > 5.9) continue;
        const flower = groupAt(x, .12, z);
        cylinder(flower, 0, .1, 0, .018, .018, .2, "#69986d", 4);
        const bloom = sphere(flower, 0, .22, 0, .075, i % 3 === 0 ? "#f0b75d" : "#f7f1d6");
        bloom.scale.y = .65;
    }
    // Visible faceted stones underneath the plateau emphasize its floating silhouette.
    [[-5.7,4.5],[-2.9,6.1],[1,6.1],[4.7,5],[-6.1,1],[6.1,1]].forEach(([x,z], index) => {
        const rock = sphere(scene, x, -1.28, z, .65, index % 2 ? "#a9977e" : "#c2ad8f");
        rock.scale.set(.9,1.4,.8);
    });

    const interactables = [];
    const stationGroup = (id) => {
        const station = LANDMARKS.find((item) => item.id === id);
        const group = groupAt(station.x, .12, station.z);
        group.userData.landmark = id;
        interactables.push(group);
        return group;
    };
    const portal = stationGroup("readapt");
    portal.rotation.y = Math.PI / 9;
    cylinder(portal,0,.12,0,1.48,1.65,.24,"#dad4c4",10);
    cylinder(portal,0,.27,0,1.2,1.33,.16,"#ece5cf",10);
    const ring = mesh(new THREE.TorusGeometry(.97,.145,6,32), "#e47c43", portal, { emissive: "#ed752f", emissiveIntensity: .25 });
    ring.position.set(0,1.42,0);
    const innerRing = mesh(new THREE.TorusGeometry(.76,.032,4,32), "#ffd387", portal, { emissive: "#ffb64e", emissiveIntensity: .7 });
    innerRing.position.set(0,1.42,.015);
    const portalCore = mesh(new THREE.CircleGeometry(.8,32), new THREE.MeshBasicMaterial({ color: "#f3ac6e", transparent: true, opacity: .32, side: THREE.DoubleSide }), portal);
    portalCore.position.set(0,1.42,0);
    [-1,1].forEach((side) => {
        box(portal,side * 1.15,.65,0,.25,1.2,.42,"#f0e4cb");
        box(portal,side * 1.15,1.25,0,.34,.16,.49,"#d77b4c");
        box(portal,side * 1.15,.35,.18,.08,.12,.05,"#e58a4a");
    });
    box(portal,1.25,.58,.9,.6,.82,.5,"#c3c0ae");
    const consoleScreen = box(portal,1.25,1.01,.92,.48,.07,.36,"#254c52");
    consoleScreen.rotation.x = .3;
    box(portal,1.25,1.06,.99,.22,.025,.07,"#f1b769");
    const sparks = [];
    for (let i = 0; i < 10; i += 1) {
        const spark = sphere(portal, 0, 0, 0, .035 + (i % 3) * .01, "#ffbe6d");
        sparks.push(spark);
    }
    const puffs = [sphere(portal,-.65,.43,.45,.13,"#f4d9b5"),sphere(portal,.5,.55,.32,.1,"#f6e7cc"),sphere(portal,.15,.27,.7,.09,"#f4d9b5")];

    const race = stationGroup("karkartrider");
    const trackShape = new THREE.Shape();
    trackShape.absellipse(0,0,2.18,1.26,0,Math.PI * 2,false);
    const trackHole = new THREE.Path();
    trackHole.absellipse(0,0,1.35,.53,0,Math.PI * 2,true);
    trackShape.holes.push(trackHole);
    const track = mesh(new THREE.ShapeGeometry(trackShape,64), "#576f88", race);
    track.rotation.x = -Math.PI / 2;
    track.position.y = .07;
    const infield = cylinder(race,0,.055,0,1,1,.035,"#91b59c",24);
    infield.scale.set(1.35,1,.54);
    for (let i = 0; i < 36; i += 1) {
        const angle = i / 36 * Math.PI * 2;
        const curb = box(race,Math.cos(angle)*2.12,.1,Math.sin(angle)*1.23,.24,.055,.12,i % 2 ? "#f3ede0" : "#da977a");
        curb.rotation.y = -Math.atan2(1.23 * Math.cos(angle), -2.12 * Math.sin(angle));
        if (i % 2 === 0) {
            const line = box(race,Math.cos(angle)*1.77,.091,Math.sin(angle)*.88,.17,.014,.04,"#e7e4d5");
            line.rotation.y = -Math.atan2(.88 * Math.cos(angle), -1.77 * Math.sin(angle));
        }
    }
    box(race,0,.3,-1.53,1.75,.24,.35,"#7195ae");
    box(race,0,.53,-1.71,1.75,.24,.35,"#96b5c4");
    for(let i = 0; i < 5; i += 1) box(race,-.7+i*.35,.68,-1.72,.19,.08,.22,"#e5e7d5");
    cylinder(race,-2.35,.72,.1,.035,.035,1.3,"#898d7c",6);
    for(let row = 0; row < 2; row += 1) for(let col = 0; col < 3; col += 1) box(race,-2.33+col*.14,1.21-row*.14,.1,.14,.14,.035,(row+col)%2 ? "#344857" : "#f4efdf");
    const car = new THREE.Group();
    race.add(car);
    box(car,0,.16,0,.34,.17,.54,"#477ed0");
    box(car,0,.28,-.04,.27,.16,.25,"#253f59");
    box(car,0,.27,.14,.31,.035,.14,"#9dc5e6");
    box(car,0,.16,.28,.16,.07,.08,"#f0c46d");
    [-1,1].forEach((side) => [-1,1].forEach((end) => {
        const wheel = cylinder(car,side*.19,.12,end*.17,.075,.075,.06,"#263544",8);
        wheel.rotation.z = Math.PI/2;
    }));

    const arena = stationGroup("inversus");
    box(arena,0,.12,0,3.2,.24,3.2,"#53616a");
    box(arena,0,.25,0,3.05,.06,3.05,"#e4dfcd");
    for (let row=0; row<6; row+=1) for(let col=0; col<6; col+=1) box(arena,(col-2.5)*.48,.3,(row-2.5)*.48,.468,.06,.468,(row+col)%2 ? "#f1ecda" : "#354557");
    const pawn = box(arena,-.52,.56,.4,.37,.42,.37,"#eef2e3");
    box(arena,-.52,.59,.6,.17,.13,.025,"#f0a15d");
    box(arena,.9,.47,-.78,.31,.25,.31,"#e09260");
    box(arena,-.9,.43,-.9,.28,.18,.28,"#2e4053");
    [[-1.5,-1.5],[1.5,1.5],[-1.5,1.5],[1.5,-1.5]].forEach(([x,z]) => {
        cylinder(arena,x,.48,z,.055,.07,.75,"#a8b2aa",6);
        sphere(arena,x,.89,z,.09,"#eeb47c");
    });
    const projectile = sphere(arena,.1,.5,.4,.07,"#ebaa65");

    const workshop = stationGroup("workshop");
    box(workshop,0,.07,0,3.15,.14,2.4,"#c4b99e");
    for(let i=0;i<7;i+=1) box(workshop,-1.35+i*.45,.15,0,.42,.025,2.3,"#dfcfad");
    box(workshop,0,.9,-.15,1.95,.16,.8,"#9b8c70");
    [[-.79,-.43],[.79,-.43],[-.79,.12],[.79,.12]].forEach(([x,z]) => box(workshop,x,.5,z,.095,.77,.095,"#718178"));
    box(workshop,0,1.26,-.31,.06,.6,.06,"#586865");
    box(workshop,0,1.48,-.32,1,.66,.1,"#34474c");
    box(workshop,0,1.48,-.255,.88,.53,.025,"#93c2b5");
    [-.13,0,.13].forEach((y,index) => box(workshop,-.18+index*.04,1.48+y,-.23,.4-index*.07,.035,.015,index===1 ? "#e7d89e" : "#477b71"));
    box(workshop,0,1.005,.13,.65,.025,.21,"#e7e4cd");
    cylinder(workshop,.68,1.1,.04,.09,.08,.21,"#cf8557",10);
    cylinder(workshop,.68,1.21,.04,.069,.069,.015,"#5b5a45",10);
    box(workshop,1.2,.6,-.25,.42,.91,.69,"#729d90");
    for(let i=0;i<3;i+=1) box(workshop,1.2,.38+i*.21,.105,.29,.04,.02,"#d0d9bb");
    box(workshop,-1.2,.9,-.45,.35,1.45,.42,"#a8987b");
    [0,1,2].forEach((i) => { box(workshop,-1.2,.42+i*.42,-.2,.39,.055,.48,"#b8a581"); box(workshop,-1.2,.59+i*.42,-.35,.13,.24,.22,["#e2b077","#94b2a2","#e2d4b0"][i]); });
    cylinder(workshop,.12,.48,.86,.34,.3,.13,"#779f93",12);
    cylinder(workshop,.12,.31,.86,.07,.12,.35,"#8c967e",8);
    box(workshop,.68,.98,-.48,.035,.6,.035,"#747f6f");
    const lamp = mesh(new THREE.ConeGeometry(.2,.18,10),"#e5bc6d",workshop);
    lamp.position.set(.68,1.32,-.38);
    box(workshop,-.56,1.02,.06,.29,.07,.2,"#df9a6c");

    // The explorer has a clear orange backpack and small articulated boots.
    const player = groupAt(0,.16,3);
    const avatar = new THREE.Group();
    player.add(avatar);
    const leftLeg = box(avatar,-.13,.15,0,.16,.27,.2,"#33465a");
    const rightLeg = box(avatar,.13,.15,0,.16,.27,.2,"#33465a");
    box(avatar,-.13,.055,.055,.18,.11,.3,"#273745");
    box(avatar,.13,.055,.055,.18,.11,.3,"#273745");
    box(avatar,0,.45,0,.43,.42,.28,"#48627a");
    const leftArm = box(avatar,-.28,.44,0,.13,.33,.16,"#51768c");
    const rightArm = box(avatar,.28,.44,0,.13,.33,.16,"#51768c");
    box(avatar,-.28,.27,.015,.12,.1,.14,"#edc3a4");
    box(avatar,.28,.27,.015,.12,.1,.14,"#edc3a4");
    const head = box(avatar,0,.85,.01,.39,.4,.36,"#edc3a4");
    head.rotation.z = -.03;
    box(avatar,0,1.04,-.02,.42,.16,.39,"#393f46");
    box(avatar,-.175,.93,-.025,.08,.21,.33,"#393f46");
    [-1,1].forEach((side) => box(avatar,side*.09,.86,.198,.035,.045,.018,"#3b4550"));
    box(avatar,0,.48,-.235,.34,.39,.21,"#df8b52");
    box(avatar,0,.41,-.35,.27,.18,.05,"#c97a45");
    box(avatar,-.2,.49,.04,.035,.38,.04,"#e5b078");
    box(avatar,.2,.49,.04,.035,.38,.04,"#e5b078");
    const playerHalo = new THREE.Mesh(new THREE.RingGeometry(.35,.42,32),new THREE.MeshBasicMaterial({ color: "#fbf1d9", side: THREE.DoubleSide, transparent: true, opacity: .85 }));
    playerHalo.rotation.x = -Math.PI/2;
    playerHalo.position.y = -.015;
    player.add(playerHalo);

    const targetMarker = new THREE.Group();
    targetMarker.visible = false;
    scene.add(targetMarker);
    const targetRing = new THREE.Mesh(new THREE.RingGeometry(.18,.23,24),new THREE.MeshBasicMaterial({ color: "#d77d43", side: THREE.DoubleSide, transparent: true, opacity: .8 }));
    targetRing.rotation.x = -Math.PI/2;
    targetRing.position.y = .16;
    targetMarker.add(targetRing);

    return {
        ground, interactables, player, targetMarker,
        animate(time, walking, reducedMotion) {
            const step = walking ? Math.sin(time * 13) : 0;
            avatar.position.y = walking ? Math.abs(step) * .035 : 0;
            leftLeg.rotation.x = step*.35;
            rightLeg.rotation.x = -step*.35;
            leftArm.rotation.x = -step*.28;
            rightArm.rotation.x = step*.28;
            if (reducedMotion) return;
            innerRing.rotation.z = time*.3;
            ring.rotation.z = Math.sin(time*.5)*.05;
            sparks.forEach((spark,index) => {
                const angle = index / sparks.length * Math.PI*2 + time*.24;
                spark.position.set(Math.cos(angle)*1.03,1.42+Math.sin(angle)*1.03,.13+Math.sin(time+index)*.1);
                spark.scale.setScalar(.6+.4*Math.sin(time*1.8+index));
            });
            puffs.forEach((puff,index) => { puff.position.y = .45+Math.sin(time*.9+index*2)*.17; puff.scale.setScalar(.75+Math.sin(time+index)*.15); });
            const angle = time*.7;
            car.position.set(Math.cos(angle)*1.78,.08,Math.sin(angle)*.88);
            car.rotation.y = Math.atan2(-1.78*Math.sin(angle),.88*Math.cos(angle));
            pawn.position.y = .56+Math.sin(time*1.6)*.025;
            projectile.position.x = -.12+(time*.8%1)*1.2;
        },
    };
}

export default function GameWorld({ isPlaying, onStart, onSelect, onStatus, reducedMotion = false, travelTarget, moveInput = { x: 0, y: 0 }, interactSignal = 0 }) {
    const canvasRef = useRef(null);
    const markersRef = useRef({});
    const runtimeRef = useRef(null);
    const latestRef = useRef({ isPlaying, onStart, onSelect, onStatus, reducedMotion, moveInput });
    const lastTravelRef = useRef(null);
    const lastInteractRef = useRef(interactSignal);
    const [failed, setFailed] = useState(false);
    latestRef.current = { isPlaying, onStart, onSelect, onStatus, reducedMotion, moveInput };

    useEffect(() => {
        const host = canvasRef.current;
        if (!host) return undefined;
        let renderer;
        try {
            renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
        } catch (error) {
            setFailed(true);
            latestRef.current.onStatus?.({ x: 0, z: 3, nearby: null, moving: false, ready: false });
            return undefined;
        }
        const scene = new THREE.Scene();
        const camera = new THREE.OrthographicCamera(-11,11,8,-8,.1,100);
        const cameraFocus = new THREE.Vector3(0,.1,0);
        const cameraOffset = new THREE.Vector3(18,21,23);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1,2));
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFShadowMap;
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = .96;
        renderer.setClearColor(0x000000,0);
        renderer.domElement.setAttribute("aria-label","키보드와 마우스로 탐험하는 게임 포트폴리오");
        renderer.domElement.setAttribute("role","img");
        host.appendChild(renderer.domElement);
        scene.add(new THREE.AmbientLight("#f6edda",.55));
        scene.add(new THREE.HemisphereLight("#eaf5f7","#aaa487",1.25));
        const sun = new THREE.DirectionalLight("#fff0d5",2.9);
        sun.position.set(-7,17,10);
        sun.castShadow = true;
        sun.shadow.mapSize.set(2048,2048);
        sun.shadow.camera.left = -12;
        sun.shadow.camera.right = 12;
        sun.shadow.camera.top = 12;
        sun.shadow.camera.bottom = -12;
        sun.shadow.camera.far = 45;
        sun.shadow.normalBias = .035;
        sun.shadow.bias = -.00015;
        sun.shadow.radius = 4;
        scene.add(sun);
        const world = buildIsland(scene);
        world.animate(0,false,false);
        const raycaster = new THREE.Raycaster();
        const pointer = new THREE.Vector2();
        const markerPosition = new THREE.Vector3();
        const movement = new THREE.Vector3();
        const keys = new Set();
        let target = null;
        let destinationId = null;
        let nearby = null;
        let moving = false;
        let frame = 0;
        let previousTime = 0;
        let elapsed = 0;
        let lastStatus = -Infinity;
        let width = 1;
        let height = 1;
        let disposed = false;
        let contextLost = false;
        let ready = false;
        const emitStatus = () => latestRef.current.onStatus?.({ x: Number(world.player.position.x.toFixed(1)), z: Number(world.player.position.z.toFixed(1)), nearby, moving, ready });
        const start = () => {
            latestRef.current.onStart?.();
            host.focus({ preventScroll: true });
        };
        const reset = () => {
            keys.clear();
            target = null;
            destinationId = null;
            world.targetMarker.visible = false;
            world.player.position.set(0,.16,3);
            world.player.rotation.y = 0;
        };
        const interact = () => {
            if (!latestRef.current.isPlaying || !nearby) return;
            keys.clear();
            target = null;
            destinationId = null;
            world.targetMarker.visible = false;
            latestRef.current.onSelect?.(nearby);
        };
        const travelTo = (id) => {
            if (id === "spawn") { start(); reset(); return; }
            const station = LANDMARKS.find((item) => item.id === id);
            if (!station) return;
            start();
            keys.clear();
            target = new THREE.Vector3(station.stopX,.16,station.stopZ);
            destinationId = id;
            world.targetMarker.position.set(station.stopX,0,station.stopZ);
            world.targetMarker.visible = true;
        };
        runtimeRef.current = { travelTo, interact, clearKeys: () => keys.clear() };
        const resize = () => {
            width = Math.max(host.clientWidth,1);
            height = Math.max(host.clientHeight,1);
            const aspect = width / height;
            // Keep the full island in frame on both wide desktop and narrow touch screens.
            const vertical = aspect < 1 ? 19 / aspect : 16.5;
            camera.left = -vertical*aspect/2;
            camera.right = vertical*aspect/2;
            camera.top = vertical/2;
            camera.bottom = -vertical/2;
            camera.updateProjectionMatrix();
            renderer.setSize(width,height);
        };
        const observer = new ResizeObserver(resize);
        observer.observe(host);
        resize();
        const onPointerDown = (event) => {
            if (event.button !== 0 || contextLost) return;
            const rect = renderer.domElement.getBoundingClientRect();
            pointer.set(((event.clientX-rect.left)/rect.width)*2-1,-((event.clientY-rect.top)/rect.height)*2+1);
            raycaster.setFromCamera(pointer,camera);
            const landmarkHit = raycaster.intersectObjects(world.interactables,true)[0];
            if (landmarkHit) {
                let object = landmarkHit.object;
                while (object && !object.userData.landmark) object = object.parent;
                if (object) travelTo(object.userData.landmark);
                return;
            }
            const hit = raycaster.intersectObject(world.ground)[0];
            if (!hit) return;
            start();
            const point = walkablePoint(hit.point.x,hit.point.z);
            target = new THREE.Vector3(point.x,.16,point.z);
            destinationId = null;
            world.targetMarker.position.set(target.x,0,target.z);
            world.targetMarker.visible = true;
        };
        const onKeyDown = (event) => {
            if (contextLost || !latestRef.current.isPlaying || event.altKey || event.ctrlKey || event.metaKey) return;
            if (event.target instanceof HTMLElement && (event.target.matches("input,textarea,select,button,a") || event.target.isContentEditable)) return;
            const key = controlKey(event);
            if (["w","a","s","d","arrowup","arrowdown","arrowleft","arrowright","shift"].includes(key)) {
                event.preventDefault();
                keys.add(key);
                target = null;
                destinationId = null;
                world.targetMarker.visible = false;
            } else if (key === "e" && nearby && !event.repeat) {
                event.preventDefault();
                interact();
            } else if (key === "r" && !event.repeat) {
                event.preventDefault();
                reset();
            }
        };
        const onKeyUp = (event) => keys.delete(controlKey(event));
        const onBlur = () => keys.clear();
        const onContextLost = (event) => {
            event.preventDefault();
            contextLost = true;
            cancelAnimationFrame(frame);
            keys.clear();
            target = null;
            destinationId = null;
            nearby = null;
            moving = false;
            ready = false;
            renderer.domElement.dataset.ready = "false";
            renderer.domElement.hidden = true;
            runtimeRef.current = null;
            emitStatus();
            setFailed(true);
        };
        renderer.domElement.addEventListener("pointerdown",onPointerDown);
        renderer.domElement.addEventListener("webglcontextlost",onContextLost);
        window.addEventListener("keydown",onKeyDown);
        window.addEventListener("keyup",onKeyUp);
        window.addEventListener("blur",onBlur);

        const render = (time) => {
            if (disposed || contextLost || document.hidden) return;
            frame = requestAnimationFrame(render);
            const delta = previousTime ? Math.min((time-previousTime)/1000,.045) : 0;
            previousTime = time;
            elapsed += delta;
            const playing = latestRef.current.isPlaying;
            const speed = keys.has("shift") ? 4.7 : 2.8;
            movement.set(0,0,0);
            if (playing) {
                const up = keys.has("w") || keys.has("arrowup");
                const down = keys.has("s") || keys.has("arrowdown");
                const left = keys.has("a") || keys.has("arrowleft");
                const right = keys.has("d") || keys.has("arrowright");
                const pad = latestRef.current.moveInput || { x: 0, y: 0 };
                const horizontal = (right ? 1 : 0)-(left ? 1 : 0)+clamp(pad.x || 0,-1,1);
                const vertical = (up ? 1 : 0)-(down ? 1 : 0)+clamp(pad.y || 0,-1,1);
                movement.x = horizontal*.78-vertical*.63;
                movement.z = -horizontal*.63-vertical*.78;
                if (horizontal || vertical) {
                    target = null;
                    destinationId = null;
                    world.targetMarker.visible = false;
                }
                if (movement.lengthSq() === 0 && target) {
                    movement.subVectors(target,world.player.position);
                    movement.y = 0;
                    if (movement.length() < .11) {
                        const arrivedId = destinationId;
                        target = null;
                        destinationId = null;
                        movement.set(0,0,0);
                        world.targetMarker.visible = false;
                        if (arrivedId) latestRef.current.onSelect?.(arrivedId);
                    }
                }
            } else {
                keys.clear();
            }
            moving = playing && movement.lengthSq() > .0001;
            if (moving) {
                const step = target ? Math.min(speed*delta,movement.length()) : speed*delta;
                movement.normalize();
                const point = walkablePoint(world.player.position.x+movement.x*step,world.player.position.z+movement.z*step);
                world.player.position.x = point.x;
                world.player.position.z = point.z;
                const angle = Math.atan2(movement.x,movement.z);
                const difference = Math.atan2(Math.sin(angle-world.player.rotation.y),Math.cos(angle-world.player.rotation.y));
                world.player.rotation.y += difference*Math.min(1,delta*13);
            }
            let closestDistance = Infinity;
            nearby = null;
            LANDMARKS.forEach((station) => {
                const distance = Math.hypot(world.player.position.x-station.stopX,world.player.position.z-station.stopZ);
                if (distance < 1.5 && distance < closestDistance) { nearby = station.id; closestDistance = distance; }
            });
            world.animate(elapsed,moving,latestRef.current.reducedMotion);
            const desiredX = world.player.position.x*.045;
            const desiredZ = world.player.position.z*.035;
            cameraFocus.x += (desiredX-cameraFocus.x)*Math.min(1,delta*2);
            cameraFocus.z += (desiredZ-cameraFocus.z)*Math.min(1,delta*2);
            camera.position.copy(cameraFocus).add(cameraOffset);
            camera.lookAt(cameraFocus);
            camera.updateMatrixWorld();
            renderer.render(scene,camera);
            if (!ready) {
                ready = true;
                renderer.domElement.dataset.ready = "true";
                emitStatus();
            }
            LANDMARKS.forEach((station) => {
                const element = markersRef.current[station.id];
                if (!element) return;
                markerPosition.set(station.x,station.height,station.z).project(camera);
                element.style.left = `${(markerPosition.x*.5+.5)*width}px`;
                element.style.top = `${(-markerPosition.y*.5+.5)*height}px`;
                element.classList.toggle("is-nearby",nearby === station.id);
            });
            if (time-lastStatus > 150) { emitStatus(); lastStatus = time; }
        };
        const onVisibilityChange = () => {
            keys.clear();
            if (contextLost) return;
            if (document.hidden) cancelAnimationFrame(frame);
            else { previousTime = 0; frame = requestAnimationFrame(render); }
        };
        document.addEventListener("visibilitychange",onVisibilityChange);
        frame = requestAnimationFrame(render);
        return () => {
            disposed = true;
            cancelAnimationFrame(frame);
            observer.disconnect();
            renderer.domElement.removeEventListener("pointerdown",onPointerDown);
            renderer.domElement.removeEventListener("webglcontextlost",onContextLost);
            window.removeEventListener("keydown",onKeyDown);
            window.removeEventListener("keyup",onKeyUp);
            window.removeEventListener("blur",onBlur);
            document.removeEventListener("visibilitychange",onVisibilityChange);
            const geometries = new Set();
            const materials = new Set();
            scene.traverse((object) => {
                if (object.geometry) geometries.add(object.geometry);
                if (object.material) (Array.isArray(object.material) ? object.material : [object.material]).forEach((entry) => materials.add(entry));
            });
            geometries.forEach((geometry) => geometry.dispose());
            materials.forEach((entry) => entry.dispose());
            sun.shadow.dispose();
            renderer.dispose();
            renderer.domElement.remove();
            runtimeRef.current = null;
        };
    }, []);

    useEffect(() => {
        if (isPlaying && !failed) canvasRef.current?.focus({ preventScroll: true });
        if (!isPlaying) runtimeRef.current?.clearKeys();
    }, [isPlaying,failed]);

    useEffect(() => {
        if (!travelTarget) return;
        const key = `${travelTarget.id}:${travelTarget.serial}`;
        if (lastTravelRef.current === key) return;
        if (failed) {
            if (travelTarget.id !== "spawn") onSelect?.(travelTarget.id);
        } else if (runtimeRef.current) runtimeRef.current.travelTo(travelTarget.id);
        else return;
        lastTravelRef.current = key;
    }, [travelTarget,failed,onSelect]);

    useEffect(() => {
        if (lastInteractRef.current === interactSignal) return;
        lastInteractRef.current = interactSignal;
        runtimeRef.current?.interact();
    }, [interactSignal]);

    return <div className="game-world">
        <div ref={canvasRef} className="world-canvas" tabIndex={0} aria-label="게임 세계 탐험. WASD 또는 방향키로 이동, Shift로 달리기, E로 가까운 프로젝트 열기." />
        {!failed && <div className="world-markers" aria-label="게임 세계의 프로젝트">
            {LANDMARKS.map((station,index) => <button key={station.id} type="button" className="world-marker" data-landmark={station.id} ref={(element) => { markersRef.current[station.id] = element; }} onClick={() => runtimeRef.current?.travelTo(station.id)} aria-label={`${station.label}로 이동해 프로젝트 보기`}><span>{String(index+1).padStart(2,"0")}</span><span>{station.label}</span></button>)}
        </div>}
        {failed && <div className="world-fallback"><p>이 브라우저에서는 3D 세계를 불러올 수 없어요.</p><p>아래에서 프로젝트를 바로 열어볼 수 있습니다.</p><div>{LANDMARKS.map((station) => <button key={station.id} type="button" onClick={() => { onStart?.(); onSelect?.(station.id); }}>{station.label}</button>)}</div></div>}
    </div>;
}
