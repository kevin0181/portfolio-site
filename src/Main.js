import {Canvas, useFrame} from "@react-three/fiber";
import {Box, OrbitControls, Plane} from "@react-three/drei";
import "./css/main.css";
import {useEffect, useRef} from "react";

let Main = () => {
    return (
        <div className={"container"}>
            <Canvas shadows camera={{position: [0.5, 1, -0.1], fov: 100}}>
                <ambientLight intensity={3}/>
                <directionalLight position={[3, 3, -3]} intensity={0.5}
                                  castShadow
                                  shadow-mapSize-width={1024}
                                  shadow-mapSize-height={1024}
                />
                <OrbitControls/>
                <Box position={[0, 0, 0]} args={[10, 0.1, 10]} receiveShadow>
                    <meshStandardMaterial color="#d67c38"/>
                </Box>

                <Box position={[0, 0.15, 0]} args={[1, 0.2, 0.5]} castShadow>
                    <meshStandardMaterial color="red"/>
                </Box>
            </Canvas>
        </div>
    )
}

export default Main;