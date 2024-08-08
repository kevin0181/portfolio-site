import React, {useEffect, useRef} from "react";
import {useBox} from "@react-three/cannon";
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

let Toy = () => {
    return (
        <>
            <Duck/>
            <Truck/>
        </>
    );
}

export default Toy;