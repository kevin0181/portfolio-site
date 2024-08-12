import React, {useEffect, useState} from "react";
import {Canvas} from "@react-three/fiber";
import "./css/main.css";
import Model from "./model_page/Model";
import {Leva, useControls} from "leva";
import {Debug, Physics} from "@react-three/cannon";
import ShowPage from "./model_page/ShowPage";

const Main = () => {

    const options = useControls('설정', {
        wireframe: {
            value: false,
            options: [true, false]
        }
    });

    let [showHtml, setShowHtml] = useState("");

    return (
        <div className={"container_m"}>
            {showHtml !== "" ? (<ShowPage/>) : (<></>)}
            <Leva
                titleBar={{
                    filter: true,
                    drag: true,
                    position: {x: 0, y: 0}
                }}
            />
            <Canvas shadows camera={{fov: 70}} style={{background: "skyblue"}}>
                {options.wireframe ? (
                    <Physics gravity={[0, -100, 0]}>
                        <Debug color="hotpink" scale={1.0}>
                            <Model setShowHtml={setShowHtml}/>
                        </Debug>
                    </Physics>
                ) : (
                    <Physics gravity={[0, -100, 0]}>
                        <Model setShowHtml={setShowHtml}/>
                    </Physics>
                )}
            </Canvas>
        </div>
    );
};

export default Main;
