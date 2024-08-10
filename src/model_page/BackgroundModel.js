import {useLoader} from "@react-three/fiber";
import {FBXLoader} from "three/examples/jsm/loaders/FBXLoader";
import React from "react";
import {useBox} from "@react-three/cannon";

const Cloud = (props) => {
    const model = useLoader(FBXLoader, './models/cloud.fbx');

    const [ref] = useBox(() => ({
        type: 'Kinematic',
        position: [16, 0, 7],
        ...props,
    }));

    return (
        <>
            <primitive object={model} ref={ref} scale={0.05}/>
        </>
    );
};

const Sun = (props) => {
    const model = useLoader(FBXLoader, './models/sun.fbx');

    const [ref] = useBox(() => ({
        type: 'Kinematic',
        position: [14, 0, 17],
        rotation: [0, -(Math.PI / 1.5), 0],
        ...props,
    }));

    return (
        <>
            <primitive object={model} ref={ref} scale={0.05}/>
        </>
    );
};


let BackgroundModel = () => {
    return (
        <>
            <Cloud/>
            <Sun/>
        </>
    );
}

export default BackgroundModel;