import {useBox} from "@react-three/cannon";
import React from "react";
import {Html} from "@react-three/drei";
import "./../css/model/model.css";

let DefaultInfoModal = () => {

    const boxSize = [0.1, 5, 6];

    const [ref] = useBox(() => ({
        args: boxSize,
        position: [6, 2, -8],
    }));

    return (
        <mesh ref={ref} visible={true}>
            <boxGeometry args={boxSize}/>
            <meshStandardMaterial color="lightblue"/>

            <Html position={[0, 0, 0]} rotation={[0, -(Math.PI / 2), 0]} center transform={true}>
                <div
                    style={{
                        width: `${boxSize[1] * 48.1}px`,
                        height: `${boxSize[2] * 33.6}px`,
                        boxSizing: 'border-box',
                    }}
                    className={"model_modal_container"}
                >
                    <div>
                        
                    </div>
                </div>
            </Html>

        </mesh>
    );
}

export default DefaultInfoModal;
