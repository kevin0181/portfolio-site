import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Physics, useBox, Debug } from "@react-three/cannon";
import React, { useState, useEffect } from "react";
import "./css/main.css";

const Ground = (props) => {
    const [ref] = useBox(() => ({
        args: [100, 0.1, 100],
        type: "Static",
        position: [0, 0, 0],
        ...props,
    }));
    return (
        <mesh ref={ref} receiveShadow>
            <boxGeometry args={[100, 0.1, 100]} />
            <meshStandardMaterial color="#d67c38" />
        </mesh>
    );
};

const Car = (props) => {
    const [ref, api] = useBox(() => ({
        mass: 4,
        position: [0, 1, 0], // 자동차가 땅 위에서 시작하도록 설정
        args: [0.3, 0.05, 0.2], // 자동차의 크기 지정
        ...props,
    }));

    const [moveForward, setMoveForward] = useState(false);
    const [moveBackward, setMoveBackward] = useState(false);
    const [moveLeft, setMoveLeft] = useState(false);
    const [moveRight, setMoveRight] = useState(false);

    useEffect(() => {
        const handleKeyDown = (event) => {
            switch (event.key) {
                case "ArrowUp":
                    setMoveForward(true);
                    break;
                case "ArrowDown":
                    setMoveBackward(true);
                    break;
                case "ArrowLeft":
                    setMoveLeft(true);
                    break;
                case "ArrowRight":
                    setMoveRight(true);
                    break;
                default:
                    break;
            }
        };

        const handleKeyUp = (event) => {
            switch (event.key) {
                case "ArrowUp":
                    setMoveForward(false);
                    break;
                case "ArrowDown":
                    setMoveBackward(false);
                    break;
                case "ArrowLeft":
                    setMoveLeft(false);
                    break;
                case "ArrowRight":
                    setMoveRight(false);
                    break;
                default:
                    break;
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
        };
    }, []);

    useFrame(() => {
        let velocity = [0, 0, 0];

        if (moveForward) velocity[2] -= 1;
        if (moveBackward) velocity[2] += 1;
        if (moveLeft) velocity[0] -= 1;
        if (moveRight) velocity[0] += 1;

        const length = Math.sqrt(velocity[0]**2 + velocity[2]**2);
        if (length > 0) {
            velocity = velocity.map(v => v / length * 5); // 속도 크기 조정
            api.velocity.set(...velocity);
        } else {
            api.velocity.set(0, 0, 0);
        }
    });

    return (
        <mesh ref={ref} castShadow>
            <boxGeometry args={[0.3, 0.05, 0.2]} /> {/* 자동차의 크기 지정 */}
            <meshStandardMaterial color="red" />
        </mesh>
    );
};

const Main = () => {
    return (
        <div className={"container"}>
            <Canvas shadows camera={{ position: [0.5, 1, -0.1], fov: 70 }}>
                <ambientLight intensity={3} />
                <directionalLight
                    position={[3, 3, -3]}
                    intensity={0.5}
                    castShadow
                    shadow-mapSize-width={1024}
                    shadow-mapSize-height={1024}
                />
                <OrbitControls />
                <Physics gravity={[0, -9.81, 0]}> {/* 중력 설정 */}
                    <Debug /> {/* 물리 객체를 시각화하여 디버깅 */}
                    <Ground />
                    <Car />
                </Physics>
            </Canvas>
        </div>
    );
};

export default Main;
