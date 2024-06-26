import {Canvas} from "@react-three/fiber";
import {Box, OrbitControls} from "@react-three/drei";
import "./css/main.css";

let Main = () => {
    return (
        <div className={"container"}>
            <Canvas>
                <ambientLight intensity={0.5}/>
                <directionalLight position={[2, 1, 3]} intensity={0.5}/>
                <OrbitControls/>
                <Box position={[0, 0, 0]} args={[3, 3, 3]}>
                    <meshStandardMaterial color="springgreen"/>
                </Box>
            </Canvas>
        </div>
    )
}

export default Main;