import {Canvas, useLoader, useFrame} from "@react-three/fiber";
import {FBXLoader} from "three/examples/jsm/loaders/FBXLoader";
import React, {useRef} from "react";
import {Html, OrbitControls} from "@react-three/drei";
import * as THREE from "three";

import "../css/model/razer.css";
import macBackground from "../img/mac/mac_background.jpg";
import macTerminal from "../img/mac/mac_terminal.png";
import macPS from "../img/mac/ps.png";
import macYoutube from "../img/mac/mac_youtube.png";
import macSetting from "../img/mac/mac_stting.png";
import macFinder from "../img/mac/mac_finder.png";
import macPhoto from "../img/mac/mac_photo.png";

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
        <div className={"container_m"} style={{
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
                <div className={"razer_container"} style={{backgroundImage: `url(${macBackground})`}}>

                    <div className={"mac_view"}>
                        <div className="mx-auto" style={{
                            height: "100%"
                        }}>
                            <div style={{
                                height: "4%",
                                borderRadius: "70px 70px 0px 0px"
                            }}
                                 className="bg-gray-200 flex items-center space-x-6 px-4">
                                <span className="w-24 h-24 rounded-full bg-red-400"></span>
                                <span className="w-24 h-24 rounded-full bg-yellow-400"></span>
                                <span className="w-24 h-24 rounded-full bg-green-400"></span>
                            </div>
                            <div className="bg-gray-100 border-t-0 w-full h-96" style={{
                                height: "80%",
                                borderRadius: "0px 0px 70px 70px"
                            }}></div>
                        </div>
                    </div>

                    <div className={"mac_dock"}>
                        <div>
                            <div className={"mac_icons"}>
                                <div className={"mac_icon"}>
                                    <img src={macTerminal} alt={"icon"}/>
                                </div>
                                <div className={"mac_icon"}>
                                    <img src={macFinder} alt={"icon"}/>
                                </div>
                                <div className={"mac_icon"}>
                                    <img src={macPhoto} alt={"icon"}/>
                                </div>
                                <div className={"mac_icon"}>
                                    <img src={macPS} alt={"icon"}/>
                                </div>
                                <div className={"mac_icon"}>
                                    <img src={macYoutube} alt={"icon"}/>
                                </div>
                                <div className={"mac_icon"}>
                                    <img src={macSetting} alt={"icon"}/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Html>
        </>
    );
}


const CameraMovement = () => {
    const cameraRef = useRef();

    // Target position for the camera
    const targetPosition = new THREE.Vector3(-85, 20, 0);

    // Smooth camera movement using useFrame
    useFrame(({camera}) => {
        camera.position.lerp(targetPosition, 0.009); // Adjust the 0.02 value to control the speed of the transition
        camera.lookAt(0, 0, 0); // Ensure the camera always looks at the origin
    });

    return null;
}

export default Razer;
