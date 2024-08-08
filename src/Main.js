import React, {useEffect, useRef, useState} from "react";
import {Canvas, useFrame, useLoader, useThree} from "@react-three/fiber";
import {Environment, OrbitControls, useGLTF} from "@react-three/drei";
import {Physics, useSphere, Debug, useBox} from "@react-three/cannon";
import "./css/main.css";
import {useNavigate} from "react-router-dom";
import {FBXLoader} from "three/examples/jsm/loaders/FBXLoader";
import * as THREE from 'three';
import Toy from "./model_page/Toy";

const Ground = (props) => {
    const fbx = useLoader(FBXLoader, './models/soccer field.fbx');
    const texture = useLoader(THREE.TextureLoader, './models/Soccer Field Texture_v2.png'); // 텍스처 경로를 올바르게 지정

    // FBX 모델에 텍스처를 적용
    fbx.traverse((child) => {
        if (child.isMesh) {
            child.material = new THREE.MeshStandardMaterial({map: texture});
        }
    });

    const [ref] = useBox(() => ({
        args: [10, 0.1, 20],
        position: [0, 0, 0],
        ...props,
    }));

    return <primitive object={fbx} ref={ref} scale={0.1} receiveShadow/>;
};

const GoalPost = (props) => {
    const goal_post_fbx = useLoader(FBXLoader, './models/goal post.fbx');
    const [ref, api] = useBox(() => ({
        args: [0, 0, 0],
        position: [0, 0, -8.25], // 위치만 props로 변경
        ...props,
    }));

    const helperRef = useRef();
    useEffect(() => {
        if (ref.current) {
            const helper = new THREE.BoxHelper(ref.current);
            helperRef.current.add(helper);
        }
    }, [ref]);

    const goal_post_l_fbx = useLoader(FBXLoader, './models/goal post_l.fbx');
    const [ref_l, api_l] = useBox(() => ({
        args: [0, 0, 0],
        position: [0, 0, 8.25], // 위치만 props로 변경
        ...props,
    }));

    return (
        <>
            <primitive object={goal_post_fbx} ref={ref} scale={0.1} receiveShadow/>
            <primitive object={goal_post_l_fbx} ref={ref_l} scale={0.1} receiveShadow/>
            <group ref={helperRef}/>
        </>
    );
};

const Car = ({move, setCarPosition, jump, isGrounded, setIsGrounded}) => {

    const initialPosition = [3, 0.5, 3];
    const model = useGLTF('./models/soccer_ball.glb'); // car 모델 로드

    const [ref, api] = useSphere(() => ({
        mass: 10,
        position: initialPosition,
        args: [0.1], // 공의 반지름을 지정합니다.
    }));

    // car가 특정 위치로 가면 특정 페이지로 이동.
    const navigate = useNavigate();
    useEffect(() => {
        const unsubscribe = api.position.subscribe((position) => {
            setCarPosition({x: position[0], y: position[1], z: position[2]});
            if (position[1] < -2) {
                api.position.set(...initialPosition); // 위치 초기화
                api.velocity.set(0, 0, 0); // 속도 초기화
            }

            if (position[0] > 10) { // 예: x 좌표가 10보다 크면 페이지 이동
                //navigate('/resume');
            }

            // 땅에 닿았는지 여부를 확인
            if (position[1] <= 0.6) {
                setIsGrounded(true);
            } else {
                setIsGrounded(false);
            }
        });
        return () => unsubscribe();
    }, [api.position, navigate, setCarPosition, setIsGrounded]);

    useFrame(() => {
        const velocity = [0, 0, 0];
        if (move.forward) velocity[0] += 5;
        if (move.backward) velocity[0] -= 5;
        if (move.left) velocity[2] -= 5;
        if (move.right) velocity[2] += 5;
        api.velocity.set(velocity[0], velocity[1], velocity[2]);

        if (jump && isGrounded) {
            api.applyImpulse([0, 50, 0], [0, 0, 0]); // 점프할 때 위쪽으로 힘을 가함
        }
    });

    return (
        <primitive object={model.scene} ref={ref} scale={0.2} castShadow={true}/>
    );
};

const CameraControls = ({carPosition}) => {
    const {camera} = useThree();

    const xOffset = -10; // x 방향 오프셋
    const yOffset = 10; // y 방향 오프셋
    const zOffset = -5; // z 방향 오프셋

    useFrame(() => {
        camera.position.x = carPosition.x + xOffset; // 카메라가 Car의 위치를 따라가도록 설정
        camera.position.y = carPosition.y + yOffset;
        camera.position.z = carPosition.z + zOffset;
        camera.lookAt(carPosition.x, carPosition.y, carPosition.z);
    });

    return (
        <>
            <OrbitControls/>
        </>
    );
};

const InvisibleBlock = (props) => {
    const [ref] = useBox(() => ({
        args: props.args || [0, 0, 0], // 블록의 크기
        position: props.position || [0, 0, 0], // 블록의 위치
        ...props,
    }));

    return (
        <>
            {/*충돌 와이어 프레임*/}
            <mesh ref={ref} visible={true}>
                <boxGeometry args={props.args}/>
                <meshBasicMaterial color="blue" wireframe/>
            </mesh>
        </>
    );
};

const Main = () => {
    const [move, setMove] = useState({
        forward: false,
        backward: false,
        left: false,
        right: false,
    });

    const [jump, setJump] = useState(false); // 점프 상태 추가
    const [carPosition, setCarPosition] = useState({x: 0, y: 1, z: 0});
    const [isGrounded, setIsGrounded] = useState(true); // 땅에 닿아 있는지 여부

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
            case " ":
                if (isGrounded) {
                    setJump(true); // 스페이스바를 누르면 점프
                }
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
            case " ":
                setJump(false); // 스페이스바를 떼면 점프 중지
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
    }, [isGrounded]);

    return (
        <div className={"container"}>
            <Canvas shadows camera={{fov: 40}}>
                <ambientLight intensity={3}/>
                <directionalLight
                    position={[3, 3, -3]}
                    intensity={0.5}
                    castShadow
                    shadow-mapSize-width={1024}
                    shadow-mapSize-height={1024}
                />
                <Physics gravity={[0, -100, 0]}> {/* 중력 설정 */}
                    <Debug/> {/* 물리 객체를 시각화하여 디버깅 */}
                    <Ground/>
                    <GoalPost/> {/* GoalPost 위치 변경 */}
                    <Car move={move} setCarPosition={setCarPosition} jump={jump} isGrounded={isGrounded} setIsGrounded={setIsGrounded}/> {/* 점프 상태 및 땅에 닿음 상태 전달 */}
                    <>
                        {/*right invisible block*/}
                        <InvisibleBlock position={[0, 0, -9.2]} args={[2.6, 2, 0.1]}/>
                        <InvisibleBlock position={[1.25, 0, -8.75]} args={[0.1, 2, 1]}/>
                        <InvisibleBlock position={[-1.25, 0, -8.75]} args={[0.1, 2, 1]}/>
                        <InvisibleBlock position={[0, 0.7, -8.75]} args={[2.6, 0.1, 1]}/>
                    </>
                    <>
                        <InvisibleBlock position={[0, 0, 9.2]} args={[2.6, 2, 0.1]}/>
                        <InvisibleBlock position={[1.25, 0, 8.75]} args={[0.1, 2, 1]}/>
                        <InvisibleBlock position={[-1.25, 0, 8.75]} args={[0.1, 2, 1]}/>
                        <InvisibleBlock position={[0, 0.7, 8.75]} args={[2.6, 0.1, 1]}/>
                    </>
                    <Toy/>
                    <CameraControls carPosition={carPosition}/>
                </Physics>
            </Canvas>
        </div>
    );
};

export default Main;
