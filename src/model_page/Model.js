import Loading from "../load/Loading";
import {useBox, useSphere} from "@react-three/cannon";
import BackgroundModel from "./BackgroundModel";
import Toy from "./Toy";
import React, {Suspense, useEffect, useRef, useState} from "react";
import {useNavigate} from "react-router-dom";
import * as THREE from "three";
import {Html, OrbitControls, Text, useGLTF} from "@react-three/drei";
import {useFrame, useLoader, useThree} from "@react-three/fiber";
import {FBXLoader} from "three/examples/jsm/loaders/FBXLoader";
import DefaultInfoModal from "./DefaultInfoModal";
import {useControls} from "leva";

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

const MouseHandler = ({setTargetPosition}) => {
    const {camera} = useThree();

    useEffect(() => {
        const handleMouseClick = (event) => {
            event.preventDefault();

            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

            raycaster.setFromCamera(mouse, camera);

            const groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
            const intersect = new THREE.Vector3();

            raycaster.ray.intersectPlane(groundPlane, intersect);

            setTargetPosition(intersect);
        };

        window.addEventListener("click", handleMouseClick);

        return () => {
            window.removeEventListener("click", handleMouseClick);
        };
    }, [camera, setTargetPosition]);

    return null;
};

const Ground = (props) => {
    const fbx = useLoader(FBXLoader, './models/soccer field.fbx');
    const texture = useLoader(THREE.TextureLoader, './models/Soccer Field Texture_v3.png');

    fbx.traverse((child) => {
        if (child.isMesh) {
            child.material = new THREE.MeshStandardMaterial({map: texture});
            child.castShadow = true;
            child.receiveShadow = true;
        }
    });

    const [ref] = useBox(() => ({
        args: [49.9, 2, 100],
        position: [0, 0, 0],
        ...props,
    }));

    return (
        <mesh ref={ref} scale={0.5} receiveShadow>
            <primitive object={fbx}/>
        </mesh>
    );
};

const GoalPost = (props) => {
    const goal_post_fbx = useLoader(FBXLoader, './models/goal post.fbx');
    const [ref] = useBox(() => ({
        args: [0, 0, 0],
        position: [0, 0.15, -41.25],
        ...props,
    }));

    goal_post_fbx.traverse((child) => {
        if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
        }
    });

    const goal_post_l_fbx = useLoader(FBXLoader, './models/goal post_l.fbx');

    goal_post_l_fbx.traverse((child) => {
        if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
        }
    });

    const [ref_l] = useBox(() => ({
        args: [0, 0, 0],
        position: [0, 0.15, 41.25],
        ...props,
    }));

    return (
        <>
            <primitive object={goal_post_fbx} ref={ref} scale={0.5} receiveShadow/>
            <primitive object={goal_post_l_fbx} ref={ref_l} scale={0.5} receiveShadow/>
        </>
    );
};

const Ball = ({
                  move,
                  setCarPosition,
                  jump,
                  isGrounded,
                  setIsGrounded,
                  onCollision,
                  targetPosition,
                  carPosition,
                  setTargetPosition
              }) => {
    const initialPosition = [3, 1, 3];
    const model = useGLTF('./models/soccer_ball.glb');

    const [ref, api] = useSphere(() => ({
        mass: 10,
        position: initialPosition,
        args: [0.9],
        angularDamping: 0,
        onCollide: (e) => onCollision(e),
    }));

    model.scene.traverse((child) => {
        if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
        }
    });

    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = api.position.subscribe((position) => {
            setCarPosition({x: position[0], y: position[1], z: position[2]});
            if (position[1] < -2) {
                api.position.set(...initialPosition);
                api.velocity.set(0, 0, 0);
            }

            if (position[1] <= 2.5) {
                setIsGrounded(true);
            } else {
                setIsGrounded(false);
            }
        });
        return () => unsubscribe();
    }, [api.position, navigate, setCarPosition, setIsGrounded]);

    useFrame(() => {
        let velocity = [0, 0, 0];

        if (targetPosition) {
            const distance = Math.sqrt(
                Math.pow(targetPosition.x - carPosition.x, 2) +
                Math.pow(targetPosition.z - carPosition.z, 2)
            );

            if (distance > 0.1) { // 목표 위치와의 거리가 0.1 이상이면 계속 이동
                const direction = new THREE.Vector3(
                    targetPosition.x - carPosition.x,
                    0,
                    targetPosition.z - carPosition.z
                ).normalize();

                velocity = [direction.x * 5, 0, direction.z * 5];
            } else {
                setTargetPosition(null); // 목표 위치에 도달하면 초기화
            }
        }

        if (!targetPosition) {
            if (move.forward) velocity[0] += 15;
            if (move.backward) velocity[0] -= 15;
            if (move.left) velocity[2] -= 15;
            if (move.right) velocity[2] += 15;
        }

        api.velocity.set(velocity[0], velocity[1], velocity[2]);

        if (jump && isGrounded) {
            api.applyImpulse([0, 100, 0], [0, 0, 0]);
        }
    });

    return (
        <primitive object={model.scene} ref={ref} scale={1} castShadow={true}/>
    );
};

const CameraControls = ({carPosition}) => {
    const {camera} = useThree();

    const xOffset = -20;
    const yOffset = 20;
    const zOffset = -10;

    useFrame(() => {
        camera.position.x = carPosition.x + xOffset;
        camera.position.y = carPosition.y + yOffset;
        camera.position.z = carPosition.z + zOffset;
        camera.lookAt(carPosition.x, carPosition.y, carPosition.z);
    });

    return (
        <OrbitControls/>
    );
};

const Project_InvisibleBlock = (props) => {
    const [ref] = useBox(() => ({
        userData: {type: 'project_block'},
        args: props.args,
        position: props.position,
        ...props,
    }));

    return (
        <mesh ref={ref} visible={false}>
            <boxGeometry args={props.args}/>
            <meshBasicMaterial color="blue" wireframe/>
        </mesh>
    );
};

const Resume_InvisibleBlock = (props) => {
    const [ref] = useBox(() => ({
        userData: {type: 'resume_block'},
        args: props.args,
        position: props.position,
        ...props,
    }));

    return (
        <mesh ref={ref} visible={false}>
            <boxGeometry args={props.args}/>
            <meshBasicMaterial/>
        </mesh>
    );
};

const LoadingBar = ({progress, position, color1, color2, border}) => {
    return (
        <Html position={position} transform>
            <div style={{
                width: '100px',
                height: '10px',
                backgroundColor: color1,
                borderRadius: '5px',
                border: border,
                overflow: 'hidden',
                //transform: 'rotate(45deg)', // 로딩 바를 45도 회전
            }}>
                <div style={{
                    width: `${progress}%`,
                    height: '100%',
                    backgroundColor: color2,
                    transition: 'width 0.1s ease'
                }}/>
            </div>
        </Html>
    );
};

let Model = () => {


    const options = useControls('이동', {
        useMouse: {
            value: false,
            options: [true, false]
        }
    });


    const [move, setMove] = useState({
        forward: false,
        backward: false,
        left: false,
        right: false,
    });

    const [jump, setJump] = useState(false);
    const [carPosition, setCarPosition] = useState({x: 0, y: 1, z: 0});
    const [isGrounded, setIsGrounded] = useState(true);
    const [targetPosition, setTargetPosition] = useState(null);
    const [loadingProgress, setLoadingProgress] = useState(0);  // Loading progress state
    const [loadingProgress_project, setLoadingProgress_project] = useState(0);  // Loading progress state
    const [showLoadingBar, setShowLoadingBar] = useState(false); // Loading bar visibility
    const [showLoadingBar_project, setShowLoadingBar_project] = useState(false); // Loading bar visibility

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
                    setJump(true);
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
                setJump(false);
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

    const navigate = useNavigate(); // 페이지 이동을 위한 useNavigate hook

    const collisionTimeoutRef = useRef(null);
    const collisionTimeoutRef2 = useRef(null);

    const handleCollision = (event) => {
        if (event.body) {
            // Check if the collided object is the "resume_block"
            if (event.body.userData && event.body.userData.type === 'resume_block') {
                if (!collisionTimeoutRef.current) {
                    setShowLoadingBar(true);  // Show the loading bar
                    let progress = 0;
                    const interval = setInterval(() => {
                        progress += 4;
                        setLoadingProgress(progress);
                        if (progress >= 100) {
                            clearInterval(interval);
                            navigate("/resume");
                        }
                    }, 62.5); // 4 seconds total

                    collisionTimeoutRef.current = interval;
                }
            } else {
                // Clear the timeout if the collision ends before 4 seconds
                if (collisionTimeoutRef.current) {
                    clearInterval(collisionTimeoutRef.current);
                    collisionTimeoutRef.current = null;
                    setShowLoadingBar(false);  // Hide the loading bar
                    setLoadingProgress(0); // Reset progress
                }
            }
        }


        if (event.body) {
            if (event.body.userData && event.body.userData.type === 'project_block') {
                if (!collisionTimeoutRef2.current) {
                    setShowLoadingBar_project(true);  // Show the loading bar
                    let progress = 0;
                    const interval = setInterval(() => {
                        progress += 4;
                        setLoadingProgress_project(progress);
                        if (progress >= 100) {
                            clearInterval(interval);
                            navigate("/project");
                        }
                    }, 62.5); // 4 seconds total

                    collisionTimeoutRef2.current = interval;
                }
            } else {
                // Clear the timeout if the collision ends before 4 seconds
                if (collisionTimeoutRef2.current) {
                    clearInterval(collisionTimeoutRef2.current);
                    collisionTimeoutRef2.current = null;
                    setShowLoadingBar_project(false);  // Hide the loading bar
                    setLoadingProgress_project(0); // Reset progress
                }
            }
        }

    };

    return (
        <>
            <Suspense fallback={<Loading/>}>
                <ambientLight intensity={3}/>
                <directionalLight
                    position={[5, 20, 5]}
                    castShadow
                    shadow-mapSize-width={4096}
                    shadow-mapSize-height={4096}
                    shadow-camera-far={100}  // 그림자가 렌더링될 최대 거리
                    shadow-camera-left={-100}  // 카메라의 좌측 경계를 넓힘
                    shadow-camera-right={100}  // 카메라의 우측 경계를 넓힘
                    shadow-camera-top={100}  // 카메라의 상단 경계를 넓힘
                    shadow-camera-bottom={-100}  // 카메라의 하단 경계를 넓힘
                />
                <Ground/>
                <GoalPost/>
                <Ball
                    move={move}
                    setCarPosition={setCarPosition}
                    jump={jump}
                    isGrounded={isGrounded}
                    setIsGrounded={setIsGrounded}
                    onCollision={handleCollision}
                    targetPosition={targetPosition}
                    carPosition={carPosition}
                    setTargetPosition={setTargetPosition}
                />
                <Resume_InvisibleBlock position={[0, 2.5, -46.3]} args={[12.5, 5, 0.1]}/>
                <Resume_InvisibleBlock position={[6.3, 2.5, -43.8]} args={[0.1, 5, 5]}/>
                <Resume_InvisibleBlock position={[-6.6, 2.5, -43.8]} args={[0.1, 5, 5]}/>
                {/* <Resume_InvisibleBlock position={[0, 0.85, -46.3]} args={[2.6, 0.1, 1]}/>*/}
                <Resume_InvisibleBlock position={[0, 0.97, -43.3]} args={[12.5, 0.1, 5]}/>

                <Project_InvisibleBlock position={[0, 2.5, 46.3]} args={[12.5, 5, 0.1]}/>
                <Project_InvisibleBlock position={[6.3, 2.5, 43.8]} args={[0.1, 5, 5]}/>
                <Project_InvisibleBlock position={[-6.6, 2.5, 43.8]} args={[0.1, 5, 5]}/>
                {/*<Project_InvisibleBlock position={[0, 0.85, 8.75]} args={[2.6, 0.1, 1]}/>*/}
                <Project_InvisibleBlock position={[0, 0.97, 43.3]} args={[12.5, 0.1, 5]}/>
                <BackgroundModel/>
                <Toy/>
                <CameraControls carPosition={carPosition}/>

                {/*카메라 컨트롤보다 아래에 위치해야됨*/}
                <DefaultInfoModal/>

            </Suspense>

            {showLoadingBar &&
                <LoadingBar progress={loadingProgress} position={[0, 1.4, -6]} color1={"greenyellow"}
                            color2={"white"}/>}
            {showLoadingBar_project &&
                <LoadingBar progress={loadingProgress_project} position={[0, 1.4, 12]} color1={"white"}
                            color2={"greenyellow"}/>}
            {options.useMouse && <MouseHandler setTargetPosition={setTargetPosition}/>}
        </>
    )
}

export default Model;