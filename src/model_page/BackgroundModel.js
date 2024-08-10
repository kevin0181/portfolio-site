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


let BackgroundModel = () => {
    return (
        <>
            <Cloud/>
        </>
    );
}

export default BackgroundModel;