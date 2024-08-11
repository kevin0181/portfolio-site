import {Canvas, useLoader, useFrame} from "@react-three/fiber";
import {FBXLoader} from "three/examples/jsm/loaders/FBXLoader";
import React, {useRef} from "react";
import {Html, OrbitControls} from "@react-three/drei";
import * as THREE from "three";

import "../css/model/razer.css";

let Razer = (props) => {
    const model = useLoader(FBXLoader, './models/razer.fbx');
    const texture = useLoader(THREE.TextureLoader, './textures/razer/Material.003_baseColor.jpeg');

    model.traverse((child) => {
        if (child.isMesh) {
            //child.material = new THREE.MeshStandardMaterial({map: texture});
            child.castShadow = true;
            child.receiveShadow = true;
        }
    });

    return (
        <div className={"container"} style={{
            backgroundColor: "black"
        }}>
            <Canvas camera={{position: [-300, 100, 300], fov: 75}}>
                <ambientLight intensity={0.5}/>
                <directionalLight position={[5, 10, 5]} intensity={30}/>
                <primitive object={model} scale={0.1}/>
                <Window_/>
                <CameraMovement/>
                <OrbitControls/>
            </Canvas>
        </div>
    );
}

let Window_ = () => {
    const rotation = new THREE.Euler(-(Math.PI / 15), -(Math.PI / 2), 0, 'YXZ');

    return (
        <>
            <Html
                transform={true}
                position={[0, 0, 0]}
                rotation={rotation.toArray()} // rotation 속성에 Euler 객체 적용
            >
                <div className={"razer_container"}>

                    <div className={"mac_dock"}>
                        <div>

                        </div>
                    </div>
                </div>
            </Html>
        </>
    );
}

// Camera movement component
const CameraMovement = () => {
    const cameraRef = useRef();

    // Target position for the camera
    const targetPosition = new THREE.Vector3(-110, 15, 0);

    // Smooth camera movement using useFrame
    useFrame(({camera}) => {
        camera.position.lerp(targetPosition, 0.009); // Adjust the 0.02 value to control the speed of the transition
        camera.lookAt(0, 0, 0); // Ensure the camera always looks at the origin
    });

    return null;
}

export default Razer;
