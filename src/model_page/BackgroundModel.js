import {useLoader} from "@react-three/fiber";
import {FBXLoader} from "three/examples/jsm/loaders/FBXLoader";
import React from "react";
import {Debug, useBox} from "@react-three/cannon";
import {useFBX} from "@react-three/drei";

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

const Wind_Turbine = (props) => {
    const model = useLoader(FBXLoader, './models/WIND TURBINE.fbx');

    const [ref] = useBox(() => ({
        type: 'Kinematic',
        position: [0, -6, 20],
        rotation: [0, 0, 0],
        ...props,
    }));

    return (
        <>
            <primitive object={model} ref={ref} scale={0.1}/>
        </>
    );
};

const Bench = (props) => {
    let fbx = useFBX(props.fbx);
    let fbxClone = fbx.clone();

    fbxClone.traverse((child) => {
        if (child.isMesh) {
            child.castShadow = true;    // 메쉬가 그림자를 드리우도록 설정
            child.receiveShadow = true; // 메쉬가 그림자를 받도록 설정
        }
    });

    const [ref] = useBox(() => ({
        type: 'Kinematic',
        position: props.position,
        rotation: props.rotation,
        args: [3.2, 1, 1.4],
        ...props,
    }));

    return (
        <>
            <group ref={ref}>
                <primitive object={fbxClone} scale={1}/>
            </group>
        </>
    );
};

let BackgroundModel = () => {
    return (
        <>
            <Cloud/>
            <Sun/>
            <Wind_Turbine/>
            <Bench fbx={"./models/bench.fbx"} position={[3.5, 0.6, -10.68]} rotation={[0, 0, 0]}/>
            <Bench fbx={"./models/bench.fbx"} position={[-3.5, 0.6, -10.68]} rotation={[0, 0, 0]}/>
            <Bench fbx={"./models/bench.fbx"} position={[3.5, 0.6, 10.68]} rotation={[0, Math.PI, 0]}/>
            <Bench fbx={"./models/bench.fbx"} position={[-3.5, 0.6, 10.68]} rotation={[0, Math.PI, 0]}/>
        </>
    );
}

export default BackgroundModel;