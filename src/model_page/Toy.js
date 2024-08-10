import React, {Suspense, useEffect, useRef} from "react";
import {Debug, useBox, useCompoundBody, useCylinder, useSphere} from "@react-three/cannon";
import {Loader, useFBX, useGLTF} from "@react-three/drei";
import {useLoader} from "@react-three/fiber";
import {FBXLoader} from "three/examples/jsm/loaders/FBXLoader";
import * as THREE from "three";

const Duck = (props) => {
    let fbx = useFBX("./models/duck.fbx");
    let fbxClone = fbx.clone();

    fbxClone.traverse((child) => {
        if (child.isMesh) {
            child.castShadow = true;    // 메쉬가 그림자를 드리우도록 설정
            child.receiveShadow = true; // 메쉬가 그림자를 받도록 설정
        }
    });

    const [bodyRef] = useCompoundBody(() => ({
        mass: 2,
        shapes: [
            {type: 'Box', args: [0.6, 0.5, 0.85], position: [0, 0, 0], mass: 2}, // lower cylinder
            {type: 'Box', args: [0.3, 0.2, 0.35], position: [0, 0.3, 0.15], mass: 2},  // upper sphere
        ],
        rotation: [0, -(Math.PI / 2), 0],
        position: [4, 2, 0],
        ...props,
    }));

    return (
        <mesh ref={bodyRef} scale={0.001} castShadow receiveShadow>
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
        args: [1.5, 1, 0.6],
        position: [-4, 2, -6],
        rotation: [0, -(Math.PI / 2) + 0.5, 0],
        ...props,
    }));

    return (
        <>
            <primitive object={model} ref={ref} scale={0.03} castShadow receiveShadow/>
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
        args: [0.8, 1, 0.8],
        position: [-3.7, 2, 4],
        ...props,
    }));

    return (
        <>
            <primitive object={model} ref={ref} scale={0.02} castShadow receiveShadow/>
        </>
    );
};

const Pin = (props) => {

    let fbx = useFBX(props.fbx);
    let fbxClone = fbx.clone();

    fbxClone.traverse((child) => {
        if (child.isMesh) {
            child.castShadow = true;    // 메쉬가 그림자를 드리우도록 설정
            child.receiveShadow = true; // 메쉬가 그림자를 받도록 설정
        }
    });

    const [bodyRef] = useCompoundBody(() => ({
        mass: 0.1,
        shapes: [
            {type: 'Sphere', args: [0.25], position: [0, -0.15, 0], mass: 0.5}, // lower cylinder
            {type: 'Sphere', args: [0.25], position: [0, 0.1, 0], mass: 0.5},  // upper sphere
        ],
        position: props.position,
        ...props,
    }));

    return (
        <Suspense fallback={<Loader/>}>
            <mesh ref={bodyRef} scale={props.scale} castShadow receiveShadow>
                <primitive object={fbxClone} dispose={null}/>
                <meshStandardMaterial reflectivity={1}/>
            </mesh>
        </Suspense>
    );
};

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
        args: [0.8, 0.8, 0.8],
        position: [3.5, 2, -5],
        ...props,
    }));

    return (
        <>
            <primitive object={model} ref={ref} scale={0.02} castShadow receiveShadow/>
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
        args: [0.4],
        position: [3.5, 2, 5],
        ...props,
    }));

    return (
        <>
            <primitive object={model} ref={ref} scale={0.1} castShadow receiveShadow/>
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
            <Pin fbx={'./models/bowling_pin.fbx'} scale={0.02} position={[3.75, 1, 7.5]}/>
            <Pin fbx={'./models/bowling_pin.fbx'} scale={0.02} position={[3.5, 1, 8]}/>
            <Pin fbx={'./models/bowling_pin.fbx'} scale={0.02} position={[4, 1, 8]}/>
            <Pin fbx={'./models/bowling_pin.fbx'} scale={0.02} position={[4.25, 1, 8.5]}/>
            <Pin fbx={'./models/bowling_pin.fbx'} scale={0.02} position={[3.75, 1, 8.5]}/>
            <Pin fbx={'./models/bowling_pin.fbx'} scale={0.02} position={[3.25, 1, 8.5]}/>
        </>
    );
}

export default Toy;