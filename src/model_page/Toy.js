import React, {useEffect, useRef} from "react";
import {useBox, useCompoundBody, useCylinder} from "@react-three/cannon";
import {useGLTF} from "@react-three/drei";
import * as THREE from "three";
import {useLoader} from "@react-three/fiber";
import {FBXLoader} from "three/examples/jsm/loaders/FBXLoader";

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
            <primitive object={model} ref={ref} scale={0.001} receiveShadow/>
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
            <primitive object={model} ref={ref} scale={0.03} receiveShadow/>
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
            <primitive object={model} ref={ref} scale={0.02} receiveShadow/>
        </>
    );
};

const Pin = (props) => {
    const model = useLoader(FBXLoader, './models/bowling_pin.fbx');

    const [ref] = useCompoundBody(() => ({
        mass: 0.1,
        shapes: [
            { type: 'Cylinder', args: [0.35, 0.35, 0.5, 18], position: [0, -0.3, 0] }, // 하단
            { type: 'Cylinder', args: [0.05, 0.05, 0.6, 18], position: [0, 0.3, 0] }  // 상단
        ],
        position: [-2, 0.5, -3],
        ...props,
    }));

    return (
        <>
            <primitive object={model} ref={ref} scale={0.03} receiveShadow />
        </>
    );
};

let Toy = () => {
    return (
        <>
            <Duck/>
            <Truck/>
            <Rocket/>
            <Pin/>
        </>
    );
}

export default Toy;