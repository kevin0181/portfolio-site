import React, {useEffect} from "react";
import {Canvas} from "@react-three/fiber";
import "./css/main.css";
import Model from "./model_page/Model";
import {Leva, useControls} from "leva";
import {Debug, Physics} from "@react-three/cannon";

const Main = () => {

    const options = useControls('설정', {
        wireframe: {
            value: false,
            options: [true, false]
        }
    });

    return (
        <div className={"container"}>
            <Leva
                titleBar={{
                    filter: true,
                    drag: true,
                    position: {x: 0, y: 0}
                }}
            />
            <Canvas shadows camera={{fov: 40}} style={{background: "skyblue"}} className={"canvas-container"}>
                {options.wireframe ? (
                    <Physics gravity={[0, -100, 0]}>
                        <Debug color="hotpink" scale={1.0}>
                            <Model/>
                        </Debug>
                    </Physics>
                ) : (
                    <Physics gravity={[0, -100, 0]}>
                        <Model/>
                    </Physics>
                )}
            </Canvas>
        </div>
    );
};

export default Main;
