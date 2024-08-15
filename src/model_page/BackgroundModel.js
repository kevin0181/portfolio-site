import {useLoader} from "@react-three/fiber";
import {FBXLoader} from "three/examples/jsm/loaders/FBXLoader";
import React from "react";
import {useBox} from "@react-three/cannon";
import {useFBX} from "@react-three/drei";

const Cloud = (props) => {
    const model = useLoader(FBXLoader, './models/cloud.fbx');

    const [ref] = useBox(() => ({
        type: 'Kinematic',
        position: [150, 15, 20],
        ...props,
    }));

    return (
        <>
            <primitive object={model} ref={ref} scale={0.5}/>
        </>
    );
};

const Sun = (props) => {
    const model = useLoader(FBXLoader, './models/sun.fbx');

    const [ref] = useBox(() => ({
        type: 'Kinematic',
        position: [64, 35, 67],
        rotation: [0, -(Math.PI / 1.5), 0],
        ...props,
    }));

    return (
        <>
            <primitive object={model} ref={ref} scale={0.2}/>
        </>
    );
};

const Wind_Turbine = (props) => {
    const model = useLoader(FBXLoader, './models/WIND TURBINE.fbx');

    const [ref] = useBox(() => ({
        type: 'Kinematic',
        position: [0, -90, 90],
        rotation: [0, 0, 0],
        ...props,
    }));

    return (
        <>
            <primitive object={model} ref={ref} scale={1}/>
        </>
    );
};

const Stars = (props) => {
    const model = useLoader(FBXLoader, './models/star1.fbx');

    const [ref] = useBox(() => ({
        type: 'Kinematic',
        position: [60, 0, -25],
        rotation: [0, 0, 0],
        ...props,
    }));

    return (
        <>
            <primitive object={model} ref={ref} scale={1}/>
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
        args: [18, 5, 7],
        ...props,
    }));

    return (
        <>
            <group ref={ref}>
                <primitive object={fbxClone} scale={5.5}/>
            </group>
        </>
    );
};

let BackgroundModel = ({darkMode}) => {
    return (
        <>
            {darkMode ? (
                <>
                    <Stars/>
                </>) : (
                <>
                    <Cloud/>
                    <Sun/>
                </>)}
            <Wind_Turbine/>
            <Bench fbx={"./models/bench.fbx"} position={[16.2, 3, -54]} rotation={[0, 0, 0]}/>
            <Bench fbx={"./models/bench.fbx"} position={[-16.2, 3, -54]} rotation={[0, 0, 0]}/>
            <Bench fbx={"./models/bench.fbx"} position={[16.2, 3, 54]} rotation={[0, Math.PI, 0]}/>
            <Bench fbx={"./models/bench.fbx"} position={[-16.2, 3, 54]} rotation={[0, Math.PI, 0]}/>
        </>
    );
}

export default BackgroundModel;