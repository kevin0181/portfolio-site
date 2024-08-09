import React, {Suspense, useEffect, useRef} from "react";
import {useBox, useCompoundBody, useCylinder} from "@react-three/cannon";
import {Loader, useFBX, useGLTF} from "@react-three/drei";
import * as THREE from "three";
import {useLoader} from "@react-three/fiber";
import {FBXLoader} from "three/examples/jsm/loaders/FBXLoader";
import {clone} from "three/examples/jsm/utils/SkeletonUtils";

const Duck = (props) => {
    const model = useLoader(FBXLoader, './models/duck.fbx');
    const [ref] = useBox(() => ({
        mass: 2,
        args: [0.5, 0.3, 0.8],
        position: [2, 3, 0],
        ...props,
    }));

    return (
        <>
            <primitive object={model} ref={ref} scale={0.001} castShadow receiveShadow/>
        </>
    );
};

const Truck = (props) => {
    const model = useLoader(FBXLoader, './models/truck.fbx');

    const [ref] = useBox(() => ({
        mass: 2,
        args: [1.5, 1, 0.6],
        position: [-2, 3, 0],
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

    const [ref] = useBox(() => ({
        mass: 2,
        args: [0.8, 1, 0.8],
        position: [-2, 5, 3],
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

    const [bodyRef] = useCompoundBody(() => ({
        mass: 0.1,
        shapes: [
            {type: 'Sphere', args: [0.25], position: [0, -0.1, 0], mass: 0.5}, // lower cylinder
            {type: 'Sphere', args: [0.25], position: [0, 0.1, 0], mass: 0.5},  // upper sphere
        ],
        position: props.position,
        ...props,
    }));

    return (
        <Suspense fallback={<Loader />}>
            <mesh ref={bodyRef} scale={props.scale} castShadow receiveShadow >
                <primitive object={fbxClone} dispose={null} />
                <meshStandardMaterial reflectivity={1} />
            </mesh>
        </Suspense>
    );
};

let Toy = () => {

    return (
        <>
            <Duck/>
            <Truck/>
            <Rocket/>
            <Pin fbx={'./models/bowling_pin.fbx'} scale={0.02} position={[3.75, 0.5, 7.5]}/>
            <Pin fbx={'./models/bowling_pin.fbx'} scale={0.02} position={[3.5, 0.5, 8]}/>
            <Pin fbx={'./models/bowling_pin.fbx'} scale={0.02} position={[4, 0.5, 8]}/>
            <Pin fbx={'./models/bowling_pin.fbx'} scale={0.02} position={[4.25, 0.5, 8.5]}/>
            <Pin fbx={'./models/bowling_pin.fbx'} scale={0.02} position={[3.75, 0.5, 8.5]}/>
            <Pin fbx={'./models/bowling_pin.fbx'} scale={0.02} position={[3.25, 0.5, 8.5]}/>
        </>
    );
}

export default Toy;