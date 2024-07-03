import React, {useEffect, useRef, useState} from "react";
import {Canvas, useFrame, useThree} from "@react-three/fiber";
import {Sphere, OrbitControls} from "@react-three/drei";
import {Physics, useSphere, Debug, useBox} from "@react-three/cannon";
import "./css/main.css";
import gsap from 'gsap';

const Ground = (props) => {
    const [ref] = useBox(() => ({
        args: [100, 0.1, 100],
        type: "Static",
        position: [0, 0, 0],
        ...props,
    }));
    return (
        <mesh ref={ref} receiveShadow>
            <boxGeometry args={[100, 0.1, 100]}/>
            <meshStandardMaterial color="#d67c38"/>
        </mesh>
    );
};

const Car = ({move}) => {
    const [ref, api] = useSphere(() => ({
        mass: 4,
        position: [0, 1, 0],
        args: [0.1], // 공의 반지름을 지정합니다.
    }));

    useFrame(() => {
        const velocity = [0, 0, 0];
        if (move.forward) velocity[0] -= 5;
        if (move.backward) velocity[0] += 5;
        if (move.left) velocity[2] += 5;
        if (move.right) velocity[2] -= 5;
        api.velocity.set(velocity[0], velocity[1], velocity[2]);
    });

    return (
        <mesh ref={ref} castShadow>
            <sphereGeometry args={[0.1]}/>
            {/* 공의 반지름을 지정합니다. */}
            <meshStandardMaterial color="red"/>
        </mesh>
    );
};

const CameraControls = ({position, target}) => {
    const { camera } = useThree();
    const ref = useRef(null);
    function cameraAnimate() {
        if (ref.current) {
            camera.position.set(position.x,position.y,position.z);
        }
    }

    useEffect(() => {
        cameraAnimate();
    }, [target, position]);

    return (
        <OrbitControls ref={ref} />
    );
}

const Main = () => {

    const [position, setPosition] = useState({x: 10, y: 10, z: -0.1})
    const [target, setTarget] = useState({x: 0, y: 0, z: 0});


    const [move, setMove] = useState({
        forward: false,
        backward: false,
        left: false,
        right: false,
    });

    const handleKeyDown = (event) => {
        switch (event.key) {
            case "ArrowUp":
                setMove((prev) => ({...prev, forward: true}));
                break;
            case "ArrowDown":
                setMove((prev) => ({...prev, backward: true}));
                break;
            case "ArrowLeft":
                setMove((prev) => ({...prev, left: true}));
                break;
            case "ArrowRight":
                setMove((prev) => ({...prev, right: true}));
                break;
            default:
                break;
        }
    };

    const handleKeyUp = (event) => {
        switch (event.key) {
            case "ArrowUp":
                setMove((prev) => ({...prev, forward: false}));
                break;
            case "ArrowDown":
                setMove((prev) => ({...prev, backward: false}));
                break;
            case "ArrowLeft":
                setMove((prev) => ({...prev, left: false}));
                break;
            case "ArrowRight":
                setMove((prev) => ({...prev, right: false}));
                break;
            default:
                break;
        }
    };

    useEffect(() => {
        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
        };
    }, []);


    return (
        <div className={"container"}>
            <Canvas shadows camera={{position: [0.5, 1, -0.1], fov: 70}}>
                <ambientLight intensity={3}/>
                <directionalLight
                    position={[3, 3, -3]}
                    intensity={0.5}
                    castShadow
                    shadow-mapSize-width={1024}
                    shadow-mapSize-height={1024}
                />
                {/*<OrbitControls/>*/}
                <CameraControls position={position} target={target}/>
                <Physics gravity={[0, -9.81, 0]}> {/* 중력 설정 */}
                    <Debug/> {/* 물리 객체를 시각화하여 디버깅 */}
                    <Ground/>
                    <Car move={move}/>
                </Physics>
            </Canvas>
        </div>
    );
};

export default Main;
