import {Canvas} from "@react-three/fiber";
import {Box, OrbitControls} from "@react-three/drei";
import {Physics, useBox, Debug} from "@react-three/cannon";
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
            <boxGeometry args={[100, 0.1, 100]}/>
            <meshStandardMaterial color="#d67c38"/>
        </mesh>
    );
};

const Car = (props) => {
    const [ref] = useBox(() => ({
        mass: 4,
        position: [0, 1, 0], // 자동차가 땅 위에서 시작하도록 설정
        ...props,
        args: [0.3, 0.05, 0.2], // 자동차의 크기 지정
    }));
    return (
        <mesh ref={ref} castShadow>
            <boxGeometry args={[0.3, 0.05, 0.2]}/>
            <meshStandardMaterial color="red"/>
        </mesh>
    );
};

const Main = () => {
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
                <OrbitControls/>
                <Physics gravity={[0, -9.81, 0]}> {/* 중력 설정 */}
                    <Debug/> {/* 물리 객체를 시각화하여 디버깅 */}
                    <Ground/>
                    <Car/>
                </Physics>
            </Canvas>
        </div>
    );
};

export default Main;
