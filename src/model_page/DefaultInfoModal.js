import {useBox} from "@react-three/cannon";
import React from "react";
import {Html} from "@react-three/drei";
import "./../css/model/model.css";

let DefaultInfoModal = () => {

    const boxSize = [0.1, 25, 20];

    const [ref] = useBox(() => ({
        args: boxSize,
        position: [30, 13, -30],
    }));

    return (
        <mesh ref={ref} visible={false}>
            <boxGeometry args={boxSize}/>
            <meshStandardMaterial color="lightblue"/>

            <Html position={[0, 0, 0]} rotation={[0, -(Math.PI / 2), 0]} center transform={true}>
                <div
                    style={{
                        width: `${boxSize[1] * 32}px`,
                        height: `${boxSize[2] * 50}px`,
                        boxSizing: 'border-box',
                        background: 'rgb(0, 0, 0, 0.5)',
                    }}
                    className={"model_modal_container"}
                >
                    <div>
                        <img src={`${process.env.PUBLIC_URL}/img/intagram_profile_white.png`} loading="lazy"
                             className={"instagram_profile_img"} alt={"인스타 프로필 이미지"}/>
                    </div>
                </div>
            </Html>

        </mesh>
    );
}

export default DefaultInfoModal;
