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
            { type: 'Sphere', args: [0.5], position: [0, -0.1, 0], mass: 0.5 }, // lower cylinder
            { type: 'Sphere', args: [0.45], position: [0, 0.1, 0], mass: 0.5 },  // upper sphere
        ],
        position: [-2, 0.5, -3],
        ...props,
    }));

    const helperRef = useRef();
    useEffect(() => {
        if (ref.current) {
            const helper = new THREE.BoxHelper(ref.current);
            helperRef.current.add(helper);
        }
    }, [ref]);

    return (
        <>
            <primitive object={model} ref={ref} scale={0.03} receiveShadow/>
            <group ref={helperRef}/>
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