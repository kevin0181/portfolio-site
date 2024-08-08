import React, {useEffect, useRef} from "react";
import {useBox} from "@react-three/cannon";
import {useGLTF} from "@react-three/drei";
import * as THREE from "three";

const Locket = (props) => {
    const model = useGLTF("./models/Duck.glb");

    const [ref] = useBox(() => ({
        args: [1, 1, 1],
        position: [0, 1, 0],
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
            <primitive object={model.scene} ref={ref} scale={0.02} receiveShadow/>
            <group ref={helperRef}/>
        </>
    );
};

let Toy = () => {
    return (
        <>
            <Locket/>
        </>
    );
}

export default Toy;