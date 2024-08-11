import React, {Suspense, useEffect, useRef} from "react";
import {Debug, useBox, useCompoundBody, useCylinder, useSphere} from "@react-three/cannon";
import {Loader, useFBX, useGLTF} from "@react-three/drei";
import {useLoader} from "@react-three/fiber";
import {FBXLoader} from "three/examples/jsm/loaders/FBXLoader";
import * as THREE from "three";
import {MTLLoader} from "three/examples/jsm/loaders/MTLLoader";
import {OBJLoader} from "three/examples/jsm/loaders/OBJLoader";

const Duck = (props) => {
    let fbx = useFBX("./models/duck.fbx");
    let fbxClone = fbx.clone();

    fbxClone.traverse((child) => {
        if (child.isMesh) {
            child.castShadow = true;    // 메쉬가 그림자를 드리우도록 설정
            child.receiveShadow = true; // 메쉬가 그림자를 받도록 설정
        }
    });

    const [bodyRef] = useBox(() => ({
        mass: 2,
        args: [3.2, 3, 3.5],
        rotation: [0, -(Math.PI / 2), 0],
        position: [20, 3, 0],
        ...props,
    }));

    return (
        <mesh ref={bodyRef} scale={0.005} castShadow receiveShadow>
            <primitive object={fbxClone}/>
        </mesh>
    );
};

const Truck = (props) => {
    const model = useLoader(FBXLoader, './models/truck.fbx');

    model.traverse((child) => {
        if (child.isMesh) {
            child.castShadow = true;    // 메쉬가 그림자를 드리우도록 설정
            child.receiveShadow = true; // 메쉬가 그림자를 받도록 설정
        }
    });

    const [ref] = useBox(() => ({
        mass: 2,
        args: [4.9, 3, 1.8],
        position: [-15, 2, -25],
        rotation: [0, -(Math.PI / 2) + 0.5, 0],
        ...props,
    }));

    return (
        <>
            <primitive object={model} ref={ref} scale={0.1} castShadow receiveShadow/>
        </>
    );
};

const Rocket = (props) => {
    const model = useLoader(FBXLoader, './models/Rocket.fbx');

    // FBX 모델에 그림자 설정 적용
    model.traverse((child) => {
        if (child.isMesh) {
            child.castShadow = true;    // 메쉬가 그림자를 드리우도록 설정
            child.receiveShadow = true; // 메쉬가 그림자를 받도록 설정
        }
    });

    const [ref] = useBox(() => ({
        mass: 2,
        args: [3.8, 7, 3.8],
        position: [-17, 4, 28],
        ...props,
    }));

    return (
        <>
            <primitive object={model} ref={ref} scale={0.1} castShadow receiveShadow/>
        </>
    );
};

// const Pin = (props) => {
//
//     let fbx = useFBX(props.fbx);
//     let fbxClone = fbx.clone();
//
//     fbxClone.traverse((child) => {
//         if (child.isMesh) {
//             child.castShadow = true;    // 메쉬가 그림자를 드리우도록 설정
//             child.receiveShadow = true; // 메쉬가 그림자를 받도록 설정
//         }
//     });
//
//     const [bodyRef] = useCompoundBody(() => ({
//         mass: 0.1,
//         shapes: [
//             {type: 'Sphere', args: [1], position: [0, 0, 0], mass: 2}, // lower cylinder
//             {type: 'Sphere', args: [0.8], position: [0, 2, 0], mass: 2},  // upper sphere
//             /* {type: 'Box', args: [1, 1, 1], position: [0, -1.2, 0], mass: 4},  // upper sphere*/
//             {type: 'Sphere', args: [1], position: [0, -2, 0], mass: 2},  // upper sphere
//         ],
//         position: props.position,
//         ...props,
//     }));
//
//     return (
//         <Suspense fallback={<Loader/>}>
//             <mesh ref={bodyRef} scale={props.scale} castShadow receiveShadow>
//                 <primitive object={fbxClone} dispose={null}/>
//                 <meshStandardMaterial reflectivity={0}/>
//             </mesh>
//         </Suspense>
//     );
// };


let Quadrangle = (props) => {

    const model = useLoader(FBXLoader, './models/quadrangle.fbx');
    const texture = useLoader(THREE.TextureLoader, './models/quadrangle texture.jpg');

    model.traverse((child) => {
        if (child.isMesh) {
            child.material = new THREE.MeshStandardMaterial({map: texture});
            child.castShadow = true;
            child.receiveShadow = true;
        }
    });

    const [ref] = useBox(() => ({
        mass: 7,
        args: [4, 4, 4],
        position: [10, 4, -30],
        ...props,
    }));

    return (
        <>
            <primitive object={model} ref={ref} scale={0.1} castShadow receiveShadow/>
        </>
    );
}

let Sphere = (props) => {
    const model = useLoader(FBXLoader, './models/baseball_01_4k.fbx');
    const texture = useLoader(THREE.TextureLoader, './models/baseball_01_diff_4k.jpg');

    model.traverse((child) => {
        if (child.isMesh) {
            child.material = new THREE.MeshStandardMaterial({map: texture});
            child.castShadow = true;
            child.receiveShadow = true;
        }
    });

    const [ref] = useSphere(() => ({
        mass: 3,
        args: [2],
        position: [-5, 4, 18],
        ...props,
    }));

    return (
        <>
            <primitive object={model} ref={ref} scale={0.5} castShadow receiveShadow/>
        </>
    );
}


let Toy = () => {

    return (
        <>
            <Duck/>
            <Truck/>
            <Rocket/>
            <Quadrangle/>
            <Sphere/>
            {/*<Pin fbx={'./models/bowling_pin.fbx'} scale={0.15} position={[3.75, 4, 7.5]}/>*/}
        </>
    );
}

export default Toy;