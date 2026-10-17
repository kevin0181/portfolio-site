import * as THREE from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import { ROAD_WIDTH, TRACK_POINTS, PIT_POINTS, ZONES, sampleTrack, TRACK_LENGTH } from "./Circuit";
import { createAssetCar } from "./RacingAssets";

const PROJECTS = {
    readapt: { name: "RE:ADAPT", subtitle: "UNREAL ENGINE 5 / TPS", color: "#d16f4d", image: "readapt-project.png" },
    karkartrider: { name: "KARKARTRIDER", subtitle: "C++ / OPENGL / RACING", color: "#5d8fb5", image: "kartrider.png" },
    inversus: { name: "INVERSUS", subtitle: "C++ / WIN32 / ACTION", color: "#a48eb7", image: "인버서스.png" },
    workshop: { name: "DEV WORKSHOP", subtitle: "AI AGENTS / DEVELOPER TOOLS", color: "#7d9c83", image: "devil-codex-main.png" },
};

function primitives(scene) {
    const materials = new Map();
    const material = (color, options = {}) => {
        const key = `${color}:${JSON.stringify(options)}`;
        if (!materials.has(key)) materials.set(key,new THREE.MeshStandardMaterial({ color,roughness: .82,flatShading: true,...options }));
        return materials.get(key);
    };
    const mesh = (geometry,color,parent = scene) => {
        const object = new THREE.Mesh(geometry,typeof color === "string" ? material(color) : color);
        object.castShadow = true;
        object.receiveShadow = true;
        parent.add(object);
        return object;
    };
    const box = (parent,position,size,color) => {
        const object=mesh(new THREE.BoxGeometry(...size),color,parent);
        object.position.set(...position);
        return object;
    };
    const cylinder = (parent,position,radius,height,color,sides = 12) => {
        const object=mesh(new THREE.CylinderGeometry(radius,radius,height,sides),color,parent);
        object.position.set(...position);
        return object;
    };
    const group = (position,parent = scene) => {
        const object=new THREE.Group();
        object.position.set(...position);
        parent.add(object);
        return object;
    };
    const polygon = (parent,position,radius,color,detail=0) => {
        const object=mesh(new THREE.IcosahedronGeometry(radius,detail),color,parent);
        object.position.set(...position);
        return object;
    };
    return { material,mesh,box,cylinder,group,polygon };
}

function canvasTexture(width,height,paint) {
    const canvas=document.createElement("canvas");
    canvas.width=width;
    canvas.height=height;
    paint(canvas.getContext("2d"),width,height);
    const texture=new THREE.CanvasTexture(canvas);
    texture.colorSpace=THREE.SRGBColorSpace;
    texture.anisotropy=4;
    return texture;
}

function stripGeometry(points,leftOffset,rightOffset,height,closed=true) {
    const positions=[];
    const indices=[];
    const length=points.length;
    const count=closed ? length+1 : length;
    for(let index=0;index<count;index+=1) {
        const point=points[index%length];
        const next=points[(index+1)%length];
        const previous=points[(index+length-1)%length];
        const tangent=point.tangent || { x: next.x-previous.x,z: next.z-previous.z };
        const magnitude=Math.hypot(tangent.x,tangent.z) || 1;
        const normal=point.normal || { x: -tangent.z/magnitude,z: tangent.x/magnitude };
        positions.push(point.x+normal.x*leftOffset,height,point.z+normal.z*leftOffset,point.x+normal.x*rightOffset,height,point.z+normal.z*rightOffset);
        if(index<count-1) {
            const current=index*2;
            indices.push(current,current+2,current+1,current+1,current+2,current+3);
        }
    }
    const geometry=new THREE.BufferGeometry();
    geometry.setAttribute("position",new THREE.Float32BufferAttribute(positions,3));
    geometry.setIndex(indices);
    geometry.computeVertexNormals();
    return geometry;
}

function numberTexture(number) {
    return canvasTexture(256,256,(context,width,height)=> {
        context.clearRect(0,0,width,height);
        context.fillStyle="#f4ead0";
        context.beginPath();context.arc(width/2,height/2,110,0,Math.PI*2);context.fill();
        context.fillStyle="#32473e";
        context.font="900 142px Arial, sans-serif";
        context.textAlign="center";context.textBaseline="middle";
        context.fillText(String(number),width/2,height/2+8);
    });
}

function batchStaticCircuit(scene,animatedObjects) {
    const excluded=new Set();
    animatedObjects.forEach((object)=>object.traverse((child)=>excluded.add(child)));
    const batches=new Map();
    scene.updateMatrixWorld(true);
    scene.traverse((object)=> {
        if(!object.isMesh || !object.visible || excluded.has(object) || !object.geometry || Array.isArray(object.material)) return;
        const sourceMaterial=object.material;
        if(!sourceMaterial || Object.values(sourceMaterial).some((value)=>value?.isTexture)) return;
        let parent=object.parent;
        while(parent) {
            if(!parent.visible || excluded.has(parent)) return;
            parent=parent.parent;
        }
        const key=`${sourceMaterial.uuid}:${object.castShadow}:${object.receiveShadow}:${object.renderOrder}`;
        if(!batches.has(key)) batches.set(key,{ material:sourceMaterial,castShadow:object.castShadow,receiveShadow:object.receiveShadow,renderOrder:object.renderOrder,objects:[] });
        batches.get(key).objects.push(object);
    });
    const replacedGeometries=new Set();
    const replacedObjects=new Set();
    const inverseScene=new THREE.Matrix4().copy(scene.matrixWorld).invert();
    batches.forEach((batch)=> {
        if(batch.objects.length<2) return;
        const transformed=batch.objects.map((object)=> {
            const geometry=object.geometry.index ? object.geometry.toNonIndexed() : object.geometry.clone();
            Object.keys(geometry.attributes).forEach((name)=> { if(name!=="position" && name!=="normal") geometry.deleteAttribute(name); });
            if(!geometry.getAttribute("normal")) geometry.computeVertexNormals();
            geometry.clearGroups();
            geometry.applyMatrix4(new THREE.Matrix4().multiplyMatrices(inverseScene,object.matrixWorld));
            return geometry;
        });
        const geometry=mergeGeometries(transformed,false);
        transformed.forEach((entry)=>entry.dispose());
        if(!geometry) return;
        geometry.computeBoundingBox();
        geometry.computeBoundingSphere();
        const merged=new THREE.Mesh(geometry,batch.material);
        merged.name="static-circuit-batch";
        merged.castShadow=batch.castShadow;
        merged.receiveShadow=batch.receiveShadow;
        merged.renderOrder=batch.renderOrder;
        scene.add(merged);
        batch.objects.forEach((object)=> { replacedGeometries.add(object.geometry);replacedObjects.add(object); });
    });
    // Preserve unbatched children, including textured or animated objects, in world space.
    replacedObjects.forEach((object)=> {
        [...object.children].forEach((child)=> { if(!replacedObjects.has(child)) scene.attach(child); });
    });
    replacedObjects.forEach((object)=>object.removeFromParent());
    const retainedGeometries=new Set();
    scene.traverse((object)=> { if(object.geometry) retainedGeometries.add(object.geometry); });
    replacedGeometries.forEach((geometry)=> { if(!retainedGeometries.has(geometry)) geometry.dispose(); });
}

export function createFormulaCar(scene,color="#d66f4e",number=1,assets=null) {
    if(assets) return createAssetCar(scene,assets,color,number);
    const { material,mesh,box,cylinder,group,polygon }=primitives(scene);
    const body=group([0,0,0]);
    const paint=material(color,{ roughness: .55 });
    const dark=material("#2f3e3b",{ roughness: .65 });
    const cream=material("#efe5c7",{ roughness: .65 });
    // All bodywork is local to the actual low centre-of-mass rigid chassis.
    box(body,[0,.08,.15],[1.04,.32,2.62],paint);
    box(body,[0,-.12,.1],[1.26,.09,3.05],dark);
    [-1,1].forEach((side)=> {
        const pod=box(body,[side*.57,.16,.25],[.39,.35,1.33],paint);
        pod.rotation.y=side*-.06;
        box(body,[side*.59,.36,.31],[.26,.05,.88],cream);
        box(body,[side*.57,.14,-.46],[.31,.18,.045],dark);
    });
    const nose=mesh(new THREE.CylinderGeometry(.13,.34,1.6,4),paint,body);
    nose.rotation.x=-Math.PI/2;
    nose.rotation.z=Math.PI/4;
    nose.position.set(0,.11,-1.1);
    const noseStripe=box(body,[0,.3,-1.03],[.14,.025,1.13],cream);
    noseStripe.rotation.x=.05;
    box(body,[0,-.015,-1.83],[2.02,.1,.32],dark);
    box(body,[0,.04,-1.89],[1.79,.05,.12],cream);
    [-1,1].forEach((side)=> {
        box(body,[side*.99,.1,-1.79],[.065,.34,.48],paint);
        box(body,[side*.49,.42,.97],[.075,.58,.1],dark);
    });
    box(body,[0,.74,1.06],[1.67,.12,.43],paint);
    box(body,[0,.81,1.1],[1.46,.025,.2],cream);
    [-1,1].forEach((side)=>box(body,[side*.82,.73,1.06],[.06,.35,.53],paint));
    box(body,[0,.36,.63],[.56,.45,.65],paint);
    box(body,[0,.42,-.02],[.6,.15,.72],dark);
    const cockpit=mesh(new THREE.SphereGeometry(.32,12,8),dark,body);
    cockpit.scale.set(1,.35,1.25);
    cockpit.position.set(0,.45,-.02);
    const helmet=polygon(body,[0,.58,-.03],.21,"#efd3a0",1);
    helmet.scale.set(1,.95,1);
    const visor=box(body,[0,.6,-.211],[.29,.09,.04],"#3d686d");
    visor.rotation.x=-.1;
    // Halo arch and central support make the open cockpit unmistakably Formula style.
    const halo=mesh(new THREE.TorusGeometry(.34,.035,5,18,Math.PI*1.62),cream,body);
    halo.rotation.x=Math.PI/2;
    halo.rotation.z=Math.PI*.69;
    halo.scale.set(1,1.35,1);
    halo.position.set(0,.75,-.02);
    const haloStem=box(body,[0,.55,-.41],[.055,.42,.055],cream);
    haloStem.rotation.x=-.2;
    const airbox=box(body,[0,.64,.52],[.28,.29,.27],paint);
    box(airbox,[0,.05,-.146],[.17,.12,.018],dark);
    const decalMaterial=new THREE.MeshStandardMaterial({ map: numberTexture(number),transparent: true,roughness: .65,polygonOffset: true,polygonOffsetFactor: -1 });
    const noseNumber=mesh(new THREE.PlaneGeometry(.46,.46),decalMaterial,body);
    noseNumber.rotation.x=-Math.PI/2;
    noseNumber.position.set(0,.315,-1.22);
    [-1,1].forEach((side)=> {
        const sideNumber=mesh(new THREE.PlaneGeometry(.41,.41),decalMaterial,body);
        sideNumber.rotation.y=side*Math.PI/2;
        sideNumber.position.set(side*.785,.19,.31);
    });
    const brakeMaterial=new THREE.MeshStandardMaterial({ color: "#d06c43",emissive: "#ee6840",emissiveIntensity: .04 });
    box(body,[0,.22,1.49],[.16,.1,.025],brakeMaterial);
    const wheels=Array.from({ length: 4 },(_,index)=> {
        const wheel=group([index%2===0 ? -.9 : .9,0,index<2 ? -1.12 : 1.12]);
        const tire=cylinder(wheel,[0,0,0],.36,index<2 ? .3 : .35,"#293633",24);
        tire.rotation.z=Math.PI/2;
        [-1,1].forEach((side)=> {
            const rim=cylinder(wheel,[side*(index<2 ? .155 : .18),0,0],.23,.018,"#4b5750",16);
            rim.rotation.z=Math.PI/2;
            const accent=mesh(new THREE.TorusGeometry(.255,.018,4,24),"#dfbf69",wheel);
            accent.rotation.y=Math.PI/2;
            accent.position.x=side*(index<2 ? .168 : .193);
            const hub=cylinder(wheel,[side*.19,0,0],.09,.025,"#a8ad98",8);
            hub.rotation.z=Math.PI/2;
        });
        return wheel;
    });
    return { body,wheels,brakeMaterial };
}

export function buildCircuit(scene,physics={},assets=null) {
    if(assets) return buildImportedCircuit(scene,physics,assets);
    const { material,mesh,box,cylinder,group,polygon }=primitives(scene);
    const roadMaterial=material("#606b68",{ side: THREE.DoubleSide });
    const paintMaterial=material("#eee9d5",{ side: THREE.DoubleSide });
    const ground=mesh(new THREE.PlaneGeometry(220,220),"#b8c4a5");
    ground.rotation.x=-Math.PI/2;
    ground.position.y=-.08;
    ground.castShadow=false;
    const road=mesh(stripGeometry(TRACK_POINTS,-ROAD_WIDTH/2,ROAD_WIDTH/2,.015),roadMaterial);
    road.castShadow=false;
    [-1,1].forEach((side)=> {
        const shoulder=mesh(stripGeometry(TRACK_POINTS,side*(ROAD_WIDTH/2+.04),side*(ROAD_WIDTH/2+1.05),.018),material("#d2c9ac",{ side: THREE.DoubleSide }));
        shoulder.castShadow=false;
        const edge=mesh(stripGeometry(TRACK_POINTS,side*(ROAD_WIDTH/2-.14),side*(ROAD_WIDTH/2-.04),.03),paintMaterial);
        edge.castShadow=false;
    });
    for(let index=0;index<TRACK_POINTS.length;index+=3) {
        const point=TRACK_POINTS[index];
        const next=TRACK_POINTS[(index+3)%TRACK_POINTS.length];
        const middle={ x:(point.x+next.x)/2,z:(point.z+next.z)/2 };
        const normal=point.normal;
        const length=Math.hypot(next.x-point.x,next.z-point.z)+.04;
        [-1,1].forEach((side)=> {
            const kerb=box(scene,[middle.x+normal.x*side*(ROAD_WIDTH/2+.33),.055,middle.z+normal.z*side*(ROAD_WIDTH/2+.33)],[.63,.11,length],index%6===0 ? "#d77a65" : "#eee7d3");
            kerb.rotation.y=Math.atan2(next.x-point.x,next.z-point.z);
        });
    }
    if(PIT_POINTS?.length>1) {
        const pit=mesh(stripGeometry(PIT_POINTS,-3.15,3.15,.024,false),material("#7d9597",{ side: THREE.DoubleSide }));
        pit.castShadow=false;
        [-1,1].forEach((side)=> {
            const line=mesh(stripGeometry(PIT_POINTS,side*3,side*3.08,.038,false),paintMaterial);
            line.castShadow=false;
        });
    }
    // The solid tire/foam barriers come from the exact collision descriptors.
    (physics.staticObjects || []).forEach((item)=> {
        if(/floor|ground|sign/.test(item.id || "")) return;
        if(!item.position || !item.size) return;
        const geometry=item.shape==="cylinder" ? new THREE.CylinderGeometry(item.size[0],item.size[0],item.size[1],12) : new THREE.BoxGeometry(...item.size);
        const barrier=mesh(geometry,item.color || "#d7cbb2");
        barrier.position.set(...item.position);
        if(item.rotation) barrier.rotation.set(...item.rotation);
        if(/barrier|rail/.test(item.id || "")) {
            box(barrier,[0,item.size[1]/2+.012,0],[item.size[0]*.95,.025,item.size[2]*.92],"#efead9");
        }
    });

    // A start line and five-light gantry sit directly on the opening northbound straight.
    const lineZ=24;
    for(let row=0;row<2;row+=1) for(let col=0;col<12;col+=1) {
        const tile=box(scene,[18-ROAD_WIDTH/2+(col+.5)*ROAD_WIDTH/12,.043,lineZ+(row-.5)*.48],[ROAD_WIDTH/12,.025,.48],(row+col)%2 ? "#f0ead8" : "#384844");
        tile.castShadow=false;
    }
    for(let row=0;row<5;row+=1) [-1,1].forEach((side)=> {
        const point=sampleTrack(TRACK_LENGTH-3-row*3.3-(side===1 ? 1.3 : 0),side*1.9);
        const grid=group([point.x,0,point.z]);
        grid.rotation.y=Math.atan2(-point.tangent.x,-point.tangent.z);
        box(grid,[0,.035,0],[1.5,.02,.055],"#f1ead8").castShadow=false;
        [-.73,.73].forEach((offset)=>box(grid,[offset,.035,.52],[.055,.02,1.1],"#f1ead8").castShadow=false);
    });
    const gantry=group([18,0,lineZ]);
    [-1,1].forEach((side)=> {
        cylinder(gantry,[side*(ROAD_WIDTH/2+1),2.8,0],.13,5.6,"#8c9788",8);
        box(gantry,[side*(ROAD_WIDTH/2+1),.25,0],[.85,.5,.85],"#d7cfb6");
    });
    box(gantry,[0,5.35,0],[ROAD_WIDTH+2.5,.46,.34],"#829080");
    const gantryLogo=canvasTexture(1024,128,(context,width,height)=> {
        context.fillStyle="#f0e8d3";context.fillRect(0,0,width,height);
        context.fillStyle="#435448";context.font="700 58px Arial";context.textAlign="center";context.fillText("YB  /  FORMULA PORTFOLIO",width/2,86);
    });
    const banner=mesh(new THREE.PlaneGeometry(6.4,.8),new THREE.MeshStandardMaterial({ map:gantryLogo,roughness:.9 }),gantry);
    banner.position.set(0,5.39,.19);
    box(gantry,[0,4.65,.1],[3.9,.68,.25],"#354640");
    const startLights=Array.from({ length:5 },(_,index)=> {
        const lightMaterial=new THREE.MeshStandardMaterial({ color:"#623d32",emissive:"#e75e3e",emissiveIntensity:0,roughness:.4 });
        const light=mesh(new THREE.SphereGeometry(.2,12,8),lightMaterial,gantry);
        light.scale.z=.35;
        light.position.set((index-2)*.67,4.65,.29);
        return light;
    });

    const textureLoader=new THREE.TextureLoader();
    ZONES.forEach((zone,index)=> {
        const project=PROJECTS[zone.id];
        const [x,,z]=zone.position;
        const garage=group([39,0,z]);
        box(garage,[0,.014,0],[7,.028,8.1],"#d8d0b8");
        box(garage,[0,2.93,0],[6.2,.23,8.2],project.color);
        box(garage,[-2.8,2.55,0],[.17,.65,7.9],"#ebe4cf");
        box(garage,[0,2.73,0],[5.2,.04,6.7],"#f0e6c8");
        const signMap=canvasTexture(1024,256,(context,width,height)=> {
            context.fillStyle="#f1ead7";context.fillRect(0,0,width,height);
            context.fillStyle=project.color;context.fillRect(0,0,142,height);
            context.fillStyle="#fff8e7";context.font="700 92px Arial";context.fillText(String(index+1).padStart(2,"0"),22,157);
            context.fillStyle="#394c43";context.font="700 70px Arial";context.fillText(project.name,179,123,798);
            context.fillStyle="#818a77";context.font="29px Arial";context.fillText(project.subtitle,182,185,790);
        });
        const sign=mesh(new THREE.PlaneGeometry(7.35,.9),new THREE.MeshStandardMaterial({ map:signMap,roughness:.9 }),garage);
        sign.rotation.y=-Math.PI/2;
        sign.position.set(-2.91,2.56,0);
        const posterMap=textureLoader.load(`${process.env.PUBLIC_URL}/img/project/${project.image}`);
        posterMap.colorSpace=THREE.SRGBColorSpace;
        const poster=mesh(new THREE.PlaneGeometry(3.1,1.7),new THREE.MeshStandardMaterial({ map:posterMap,roughness:.9 }),garage);
        poster.rotation.y=-Math.PI/2;
        poster.position.set(3.105,1.5,0);
        box(garage,[1.4,.55,-2.45],[1.1,1.1,.7],"#7f9182");
        [0,1,2].forEach((row)=>box(garage,[.83,.29+row*.29,-2.45],[.025,.045,.48],"#c4ceb1"));
        for(let tire=0;tire<3;tire+=1) cylinder(garage,[1.5,.19+tire*.29,2.35],.48,.27,"#405047",16);
        box(scene,[x,.045,z],[4.9,.035,7.8],"#e3ddc8").castShadow=false;
        [-1,1].forEach((side)=>box(scene,[x+side*2.45,.064,z],[.08,.02,7.8],project.color).castShadow=false);
        box(scene,[x,.065,z-3.85],[4.9,.025,.08],project.color).castShadow=false;
        const bayNumber=mesh(new THREE.PlaneGeometry(1.35,1.35),new THREE.MeshStandardMaterial({ map:numberTexture(index+1),transparent:true,roughness:.9 }));
        bayNumber.rotation.x=-Math.PI/2;
        bayNumber.position.set(x,.085,z);
        // Tiny helmeted pit crew add scale while leaving the driving lane clear.
        [-1,1].forEach((side)=> {
            const crew=group([37.3,0,z+side*2.9]);
            box(crew,[0,.51,0],[.33,.45,.25],project.color);
            [-1,1].forEach((leg)=>box(crew,[leg*.1,.17,0],[.12,.33,.16],"#4c6053"));
            polygon(crew,[0,.94,0],.23,"#eee1be",1);
            box(crew,[-.2,.56,0],[.1,.35,.13],project.color);
            box(crew,[.2,.56,0],[.1,.35,.13],project.color);
            box(crew,[-.205,.93,0],[.02,.08,.25],"#546c68");
        });
    });

    const grandstand=(x,z,rotation,width=17)=> {
        const stand=group([x,0,z]);
        stand.rotation.y=rotation;
        for(let row=0;row<4;row+=1) {
            box(stand,[0,.35+row*.6,row*.92],[width,.65,.87],"#b5bca9");
            box(stand,[0,.73+row*.6,row*.92],[width,.1,.66],row%2 ? "#93a99a" : "#e1cda7");
            for(let seat=0;seat<Math.floor(width/.9);seat+=1) {
                if((seat+row)%5===0) continue;
                const px=-width/2+.5+seat*.9;
                const color=["#d08e6c","#789fa8","#c5b47e","#7d9a7e","#b5a0ba"][(seat+row*2)%5];
                box(stand,[px,1.02+row*.6,row*.92],[.28,.45,.25],color);
                polygon(stand,[px,1.33+row*.6,row*.92],.16,"#ddc3a1");
            }
        }
        [-width/2,width/2].forEach((side)=>cylinder(stand,[side,2.7,1.2],.07,5.4,"#8f9e88",6));
        box(stand,[0,5.32,1.2],[width+.8,.18,5.5],"#d4c7a8");
    };
    grandstand(-11,44,0,16);
    grandstand(-43,-16,Math.PI/2,16);
    grandstand(44,-29,0,12);

    let seed=4293;
    const random=()=> { seed=(seed*1664525+1013904223)>>>0;return seed/4294967296; };
    const tree=(x,z,size)=> {
        const plant=group([x,-.04,z]);
        plant.scale.setScalar(size);
        cylinder(plant,[0,.92,0],.16,1.85,"#a18e70",7);
        const crown=polygon(plant,[0,2.2,0],1.1,"#7f9c78",1);
        crown.scale.set(.87,1.25,.87);
        polygon(plant,[-.36,1.83,.14],.67,"#8eaa82");
        polygon(plant,[.27,2.67,-.1],.61,"#9cb68c");
    };
    // Trees stay well beyond both road and pit lane, keeping all corners legible.
    for(let index=0;index<15;index+=1) {
        const x=-48+index*6.9;
        tree(x,-45-random()*3,.95+random()*.6);
        if(index%2===0) tree(x,47+random()*3,1+random()*.55);
    }
    for(let index=0;index<11;index+=1) {
        tree(-48-random()*3,-35+index*7.1,.9+random()*.5);
        if(index%2===0) tree(53+random()*3,-36+index*7.2,1+random()*.5);
    }
    [[-11,6],[-8,-4],[-4,6],[3,9],[-18,-8],[-3,-19],[4,-24]].forEach(([x,z],index)=>tree(x,z,.7+(index%3)*.15));
    const flags=[];
    [[27,25],[27,-36],[-27,38],[-32,-31]].forEach(([x,z],index)=> {
        cylinder(scene,[x,2.75,z],.045,5.5,"#9ba590",8);
        const flag=box(scene,[x+.6,4.95,z],[1.25,.73,.035],["#d28b67","#8ca9b1","#baa2b9","#9aad88"][index]);
        flags.push(flag);
    });
    // A restrained hospitality canopy beyond the paddock completes the circuit scenery.
    const tent=group([48,0,10]);
    box(tent,[0,2.4,0],[5,.14,6],"#e9dfc4");
    const tentRoof=mesh(new THREE.ConeGeometry(4.1,1.4,4),"#d3b580",tent);
    tentRoof.rotation.y=Math.PI/4;
    tentRoof.position.y=3.15;
    [-1,1].forEach((x)=>[-1,1].forEach((z)=>cylinder(tent,[x*2.3,1.2,z*2.8],.06,2.4,"#9f9e85",6)));
    cylinder(tent,[0,.72,0],.82,.1,"#9d9e85",16);
    cylinder(tent,[0,.36,0],.07,.72,"#8a9c86",8);

    // Cars are added by the runtime after this call; only static circuit scenery is batched.
    batchStaticCircuit(scene,[...flags,...startLights]);

    let elapsed=0;
    return {
        startLights,
        setStartLights(phase) {
            const count=typeof phase==="number" ? phase : phase==="red" ? 5 : 0;
            startLights.forEach((light,index)=> {
                const lit=phase==="go" || index<count;
                const green=phase==="go";
                light.material.color.set(lit ? green ? "#88be75" : "#d94f35" : "#61473b");
                light.material.emissive.set(green ? "#8cce68" : "#ef6240");
                light.material.emissiveIntensity=lit ? 1.35 : 0;
            });
        },
        update(delta,status,reducedMotion=false) {
            if(reducedMotion || status?.reducedMotion) return;
            elapsed+=delta;
            flags.forEach((flag,index)=> { flag.rotation.y=Math.sin(elapsed*1.4+index)*.1; });
        },
    };
}

// Actual Kenney GLB models form this circuit; the road panels are bent to the
// same centreline that drives tire grip, AI, recovery, collision and lap timing.
function buildImportedCircuit(scene,physics,assets) {
    const { mesh,box,group,polygon }=primitives(scene);
    const palette={ grass:"#b8c4a5",road:"#586460",grey:"#e8e2d1",red:"#cb7458",glass:"#5c7778",_defaultMat:"#c7c4b5",carTire:"#35433c",pylon:"#e6c47f" };
    const materialCache=new Map();
    const recolor=(source,color)=> {
        const key=`${source.uuid}:${color || ""}`;
        if(!materialCache.has(key)) {
            const result=source.clone();
            if(color) result.color.set(color);
            result.roughness=.84; result.flatShading=true;
            materialCache.set(key,result);
        }
        return materialCache.get(key);
    };
    const prepare=(object,accent)=> {
        object.traverse((part)=> {
            if(!part.isMesh) return;
            const apply=(material)=>recolor(material,material.name==="red" && accent ? accent : palette[material.name]);
            part.material=Array.isArray(part.material) ? part.material.map(apply) : apply(part.material);
            part.castShadow=true; part.receiveShadow=true;
        });
        return object;
    };
    const model=(name,position,size,rotation=0,accent)=> {
        const object=prepare(assets.clone(name),accent);
        const bounds=new THREE.Box3().setFromObject(object);
        const dimensions=bounds.getSize(new THREE.Vector3());
        const center=bounds.getCenter(new THREE.Vector3());
        object.position.sub(new THREE.Vector3(center.x,bounds.min.y,center.z));
        const wrapper=group(position);
        wrapper.add(object);
        wrapper.scale.set(size[0]/dimensions.x,size[1]/dimensions.y,size[2]/dimensions.z);
        wrapper.rotation.y=rotation;
        return wrapper;
    };
    const ground=mesh(new THREE.PlaneGeometry(220,220),"#b8c4a5");
    ground.rotation.x=-Math.PI/2; ground.position.y=-.08; ground.castShadow=false;

    const roadPanels=(name,length,width,sample,curbs=true)=> {
        const template=assets.clone(name);
        template.updateMatrixWorld(true);
        const bounds=new THREE.Box3().setFromObject(template);
        const dimensions=bounds.getSize(new THREE.Vector3());
        const center=bounds.getCenter(new THREE.Vector3());
        const parts=[];
        template.traverse((part)=> { if(part.isMesh && part.material.name!=="grass") parts.push(part); });
        const count=Math.ceil(length/1.65);
        for(let index=0;index<count;index+=1) {
            const from=index*length/count;
            const span=length/count;
            parts.forEach((part)=> {
                if(!curbs && part.material.name==="grey") return;
                const geometry=part.geometry.clone().applyMatrix4(part.matrixWorld);
                const positions=geometry.getAttribute("position");
                for(let vertex=0;vertex<positions.count;vertex+=1) {
                    const amount=(bounds.max.z-positions.getZ(vertex))/dimensions.z;
                    const point=sample(Math.min(length,from+amount*span));
                    // Kenney's drivable asphalt occupies 0.6902 of the panel width.
                    const lateral=-(positions.getX(vertex)-center.x)*width/.6902;
                    const height=(positions.getY(vertex)-bounds.min.y)*.9+.012;
                    positions.setXYZ(vertex,point.x+point.normal.x*lateral,height,point.z+point.normal.z*lateral);
                }
                geometry.computeVertexNormals();
                const tint=part.material.name==="grey" ? curbs && index%2===0 ? "#cb7458" : "#eee5d0" : "#586460";
                const panel=mesh(geometry,recolor(part.material,tint));
                panel.castShadow=false;
            });
        }
    };
    roadPanels("roadStraightLong",TRACK_LENGTH,ROAD_WIDTH,(distance)=>sampleTrack(distance));
    const pitLength=PIT_POINTS[PIT_POINTS.length-1].distance;
    const pitSample=(distance)=> {
        const nextIndex=PIT_POINTS.findIndex((point)=>point.distance>=distance);
        const index=nextIndex<1 ? nextIndex<0 ? PIT_POINTS.length-1 : 1 : nextIndex;
        const before=PIT_POINTS[index-1],after=PIT_POINTS[index];
        const amount=Math.min(1,Math.max(0,(distance-before.distance)/(after.distance-before.distance)));
        const tangent=new THREE.Vector2().lerpVectors(new THREE.Vector2(before.tangent.x,before.tangent.z),new THREE.Vector2(after.tangent.x,after.tangent.z),amount).normalize();
        return { x:THREE.MathUtils.lerp(before.x,after.x,amount),z:THREE.MathUtils.lerp(before.z,after.z,amount),normal:{x:tangent.y,z:-tangent.x} };
    };
    roadPanels("roadPitStraightLong",pitLength,6.3,pitSample,false);

    // Each model follows the dimensions of its existing simplified collision body.
    physics.staticObjects.forEach((item,index)=> {
        if(!/guardrail/.test(item.id)) return;
        const length=item.size[2],segments=Math.ceil(length/1.1);
        for(let segment=0;segment<segments;segment+=1) {
            const offset=(segment+.5)*length/segments-length/2;
            model(index%3===0 ? "barrierRed" : "barrierWhite",[item.position[0]+Math.sin(item.rotation[1])*offset,0,item.position[2]+Math.cos(item.rotation[1])*offset],[length/segments,item.size[1],item.size[0]],item.rotation[1]+Math.PI/2);
        }
    });
    ZONES.forEach((zone,index)=> {
        const {name,subtitle,color,image}=PROJECTS[zone.id];
        const z=zone.position[2];
        const garage=model("pitsGarage",[39.2,0,z],[7.8,2.8,6.3],-Math.PI/2,color);
        model("pitsOffice",[39.2,2.8,z],[7.8,1.7,6.3],-Math.PI/2);
        const signMap=canvasTexture(1024,160,(context,width,height)=> {
            context.fillStyle="#f1ead7";context.fillRect(0,0,width,height);
            context.fillStyle=color;context.fillRect(0,0,135,height);
            context.fillStyle="#fff8e7";context.font="700 73px Arial";context.fillText(String(index+1).padStart(2,"0"),20,106);
            context.fillStyle="#394c43";context.font="700 61px Arial";context.fillText(name,173,85,817);
            context.fillStyle="#818a77";context.font="23px Arial";context.fillText(subtitle,176,129,810);
        });
        garage.traverse((part)=> {
            if(!part.isMesh || part.material.name!=="tankco") return;
            // The original sponsor UVs repeat outside 0..1. Give each project
            // a single legible sign instead of clamping it to the texture edge.
            const geometry=part.geometry.clone();
            const positions=geometry.getAttribute("position");
            const bounds=new THREE.Box3();
            const indices=geometry.index?.array || Array.from({length:positions.count},(_,vertex)=>vertex);
            for(const vertex of indices)bounds.expandByPoint(new THREE.Vector3().fromBufferAttribute(positions,vertex));
            const uv=geometry.getAttribute("uv").clone();
            for(let vertex=0;vertex<positions.count;vertex+=1)uv.setXY(vertex,(positions.getX(vertex)-bounds.min.x)/(bounds.max.x-bounds.min.x),(positions.getY(vertex)-bounds.min.y)/(bounds.max.y-bounds.min.y));
            geometry.setAttribute("uv",uv);part.geometry=geometry;
            part.material=part.material.clone();part.material.map=signMap;part.material.color.set("#ffffff");
        });
        box(scene,[35,.022,z],[4.9,.035,7.8],"#dfd6bd").castShadow=false;
        [-1,1].forEach((side)=>box(scene,[35+side*2.45,.048,z],[.08,.02,7.8],color).castShadow=false);
        box(scene,[35,.049,z-3.85],[4.9,.02,.08],color).castShadow=false;
        const bay=mesh(new THREE.PlaneGeometry(1.35,1.35),new THREE.MeshStandardMaterial({map:numberTexture(index+1),transparent:true,roughness:.9}));
        bay.rotation.x=-Math.PI/2;bay.position.set(35,.067,z);
        const posterMap=new THREE.TextureLoader().load(`${process.env.PUBLIC_URL}/img/project/${image}`);
        posterMap.colorSpace=THREE.SRGBColorSpace;
        const poster=mesh(new THREE.PlaneGeometry(3.1,1.7),new THREE.MeshStandardMaterial({map:posterMap,roughness:.9}));
        poster.rotation.y=-Math.PI/2;poster.position.set(42.1,1.45,z);
        [-1,1].forEach((side)=> {
            const crew=group([37.4,0,z+side*3]);
            box(crew,[0,.51,0],[.33,.45,.25],color);
            [-1,1].forEach((leg)=>box(crew,[leg*.1,.17,0],[.12,.33,.16],"#4c6053"));
            polygon(crew,[0,.94,0],.23,"#eee1be",1);
        });
    });

    [[-43,-16,Math.PI/2],[-11,45,Math.PI],[47,-28,-Math.PI/2]].forEach(([x,z,rotation])=> {
        for(let stand=0;stand<3;stand+=1) {
            const offset=(stand-1)*5.4;
            model("grandStandCovered",[x+Math.cos(rotation)*offset,0,z-Math.sin(rotation)*offset],[5.4,5.4,4.7],rotation);
        }
    });
    model("grandStandRound",[-40,0,13],[10,4.5,10],Math.PI/2);
    const lights=[];
    [[25,28],[25,-35],[-36,-27],[-36,17],[-8,43],[42,-33]].forEach(([x,z])=>model("lightPostLarge",[x,0,z],[3,7.2,.8],Math.atan2(-x,-z)));
    [[46,9],[46,-1],[46,-11]].forEach(([x,z],index)=>model("tent",[x,0,z],[5,3.8,6],Math.PI/2,index%2 ? "#91a89a" : "#cfb47e"));
    const tree=(x,z,size)=>model(size>1.1 ? "treeLarge" : "treeSmall",[x,0,z],[1.9*size,4.5*size,1.9*size]);
    for(let index=0;index<15;index+=1) { tree(-48+index*7,-47,1+(index%3)*.16);if(index%2===0)tree(-48+index*7,49,.9+(index%4)*.1); }
    for(let index=0;index<10;index+=1) { tree(-49,-35+index*7.5,.9+(index%3)*.1);if(index%2===0)tree(55,-36+index*8,1.1); }
    [[-11,6],[-8,-4],[-4,6],[3,9],[-18,-8],[-3,-19],[4,-24]].forEach(([x,z],index)=>tree(x,z,.68+(index%3)*.12));
    // Fence models sit beyond rigid barriers; their bottom rails remain outside the racing line.
    for(let index=0;index<10;index+=1)model("fenceStraight",[-42,0,-32+index*5.5],[5.5,2.8,.2],Math.PI/2);

    model("overhead",[18,0,24],[11.3,5.4,1.7]);
    const logo=canvasTexture(1024,128,(context,width,height)=> {
        context.fillStyle="#eee7d2";context.fillRect(0,0,width,height);context.fillStyle="#435448";context.font="700 59px Arial";context.textAlign="center";context.fillText("YB  /  FORMULA PORTFOLIO",width/2,86);
    });
    const banner=mesh(new THREE.PlaneGeometry(6.4,.8),new THREE.MeshStandardMaterial({map:logo,roughness:.9}));
    banner.position.set(18,5.15,24.87);
    box(scene,[18,4.45,24.7],[3.9,.65,.25],"#354640");
    for(let index=0;index<5;index+=1) {
        const light=mesh(new THREE.SphereGeometry(.2,12,8),new THREE.MeshStandardMaterial({color:"#623d32",emissive:"#e75e3e",emissiveIntensity:0,roughness:.4}));
        light.scale.z=.35;light.position.set(18+(index-2)*.67,4.45,24.87);lights.push(light);
    }
    for(let row=0;row<2;row+=1)for(let col=0;col<12;col+=1)box(scene,[18-ROAD_WIDTH/2+(col+.5)*ROAD_WIDTH/12,.052,24+(row-.5)*.48],[ROAD_WIDTH/12,.025,.48],(row+col)%2 ? "#f0ead8" : "#384844").castShadow=false;
    for(let row=0;row<5;row+=1)[-1,1].forEach((side)=> {
        const point=sampleTrack(TRACK_LENGTH-3-row*3.3-(side===1 ? 1.3 : 0),side*1.9);
        const grid=group([point.x,0,point.z]);grid.rotation.y=Math.atan2(-point.tangent.x,-point.tangent.z);
        box(grid,[0,.045,0],[1.5,.025,.055],"#eee5d0").castShadow=false;
        [-.73,.73].forEach((offset)=>box(grid,[offset,.045,.52],[.055,.025,1.1],"#eee5d0").castShadow=false);
    });
    batchStaticCircuit(scene,lights);
    return { startLights:lights,update() {},setStartLights(phase) {
        lights.forEach((light,index)=> {
            const lit=phase==="go" || (typeof phase==="number" && index<phase);
            light.material.color.set(lit ? phase==="go" ? "#88be75" : "#d94f35" : "#61473b");
            light.material.emissive.set(phase==="go" ? "#8cce68" : "#ef6240");light.material.emissiveIntensity=lit ? 1.35 : 0;
        });
    } };
}
