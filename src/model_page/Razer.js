import {Canvas, useLoader, useFrame} from "@react-three/fiber";
import {FBXLoader} from "three/examples/jsm/loaders/FBXLoader";
import React, {Suspense, useEffect, useRef, useState} from "react";
import {Html, OrbitControls} from "@react-three/drei";
import * as THREE from "three";

import "../css/model/razer.css";
import macBackground from "../img/mac/mac_background.jpg";
import macTerminal from "../img/mac/mac_terminal.png";
import macMap from "../img/mac/mac_map.png";
import macYoutube from "../img/mac/mac_youtube.png";
import macSetting from "../img/mac/mac_stting.png";
import macFinder from "../img/mac/mac_finder.png";
import macPhoto from "../img/mac/mac_photo.png";
import macSpotify from "../img/mac/mac_spotify.png";
import macDeepSeek from "../img/mac/mac_deepseek.png";
import macDoom from "../img/mac/mac_doom.png";

import Browser from "./Browser";
import Terminal from "./Terminal";
import {useNavigate} from "react-router-dom";
import Loading from "../load/Loading";

let Razer = (props) => {

    const navigate = useNavigate(); // 페이지 이동을 위한 useNavigate hook

    useEffect(() => {
        // Check if the screen width is less than or equal to 768px (common mobile screen width)
        const isMobile = window.matchMedia("(max-width: 768px)").matches;

        if (isMobile) {
            navigate("/portfolio");
        }
    }, [navigate]);

    const model = useLoader(FBXLoader, './models/razer.fbx');

    model.traverse((child) => {
        if (child.isMesh) {
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
                <Suspense fallback={<Loading/>}>
                    <Window_ navigate={navigate}/>
                    <CameraMovement/>
                    {/*<OrbitControls/>*/}
                </Suspense>
            </Canvas>
        </div>
    );
}

let Window_ = ({navigate}) => {
    const rotation = new THREE.Euler(-(Math.PI / 15), -(Math.PI / 2), 0, 'YXZ');

    let [program, setProgram] = useState("");

    let [terminalStatus, setTerminalStatus] = useState(true);

    let iconOnClick = (e) => {
        setProgram(e.target.name);
        setTerminalStatus(false);
    }

    return (
        <>
            <Html
                transform={true}
                position={[0, 0, 0]}
                rotation={rotation.toArray()} // rotation 속성에 Euler 객체 적용
            >
                <div className={"razer_container"} style={{backgroundImage: `url(${macBackground})`}}>

                    <div className={"mac_view"}>
                        {
                            program !== "" ? (<Browser program={program} setProgram={setProgram}/>) : (<></>)
                        }
                        {
                            terminalStatus ? (
                                <Terminal navigate={navigate} setTerminalStatus={setTerminalStatus}/>) : (<></>)
                        }
                    </div>

                    <div className={"mac_dock"}>
                        <div>
                            <div className={"mac_icons"}>
                                <div className={"mac_icon"}>
                                    <img src={macTerminal} alt={"icon"} name={"terminal"} onClick={() => {
                                        setTerminalStatus(!terminalStatus);
                                        setProgram("");
                                    }}/>
                                </div>
                                <div className={"mac_icon"}>
                                    <img src={macFinder} alt={"icon"}/>
                                </div>
                                <div className={"mac_icon"}>
                                    <img src={macPhoto} alt={"icon"}/>
                                </div>
                                <div className={"mac_icon"}>
                                    <img src={macMap} alt={"icon"} name={"map"} onClick={iconOnClick}/>
                                </div>
                                <div className={"mac_icon"}>
                                    <img src={macYoutube} alt={"icon"} name={"youtube"} onClick={iconOnClick}/>
                                </div>
                                <div className={"mac_icon"}>
                                    <img src={macSpotify} alt={"icon"} name={"spotify"} onClick={iconOnClick}/>
                                </div>
                                <div className={"mac_icon"}>
                                    <img src={macSetting} alt={"icon"} name={"setting"} onClick={iconOnClick}/>
                                </div>
                                <div className={"mac_icon"}>
                                    <div style={{
                                        backgroundColor: "white",
                                        padding: "7%",
                                        borderRadius: "20%"
                                    }}>
                                        <img src={macDeepSeek} alt={"icon"} name={"deepseek"} onClick={iconOnClick}/>
                                    </div>
                                </div>
                                <div className={"mac_icon"}>
                                    <img src={macDoom} alt={"icon"} name={"doom"} onClick={iconOnClick} style={{
                                        width: "80%"
                                    }}/>
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
