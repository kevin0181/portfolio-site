import {useBox} from "@react-three/cannon";
import React from "react";
import {Html} from "@react-three/drei";
import "./../css/model/model.css";

let DefaultInfoModal = () => {

    const boxSize = [0.1, 6, 4];

    const [ref] = useBox(() => ({
        args: boxSize,
        position: [6, 3, -8],
    }));

    return (
        <mesh ref={ref} visible={true}>
            <boxGeometry args={boxSize}/>
            <meshStandardMaterial color="lightblue"/>

            <Html position={[0, 0, 0]} rotation={[0, -(Math.PI / 2), 0]} center transform={true}>
                <div
                    style={{
                        width: `${boxSize[1] * 27}px`,
                        height: `${boxSize[2] * 60.5}px`,
                        boxSizing: 'border-box',
                        background: 'rgb(0, 0, 0, 0.5)',
                    }}
                    className={"model_modal_container"}
                >
                    <div>
                        <img src={`${process.env.PUBLIC_URL}/img/intagram_profile_white1.png`} loading="lazy"
                             className={"instagram_profile_img"} alt={"인스타 프로필 이미지"}/>
                    </div>
                </div>
            </Html>

        </mesh>
    );
}

export default DefaultInfoModal;
