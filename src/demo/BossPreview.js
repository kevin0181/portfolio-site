import React, { Suspense, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, useGLTF, Html } from "@react-three/drei";
import boss1 from "./vilhelm_draft.glb";

function Loader() {
    return (
        <Html center>
            <div style={{ color: "rgba(255,255,255,0.8)", fontSize: 12 }}>Loading 3D...</div>
        </Html>
    );
}

function BossModel({ url, scale = 0.05 }) {
    // drei가 glTF를 자동 로딩/캐싱해줌
    const { scene } = useGLTF(url);

    // 일부 모델은 방향/크기가 이상할 수 있어서 기본 회전/스케일 조정
    return (
        <primitive
            object={scene}
            scale={scale}
            rotation={[0, Math.PI * 0.15, 0]}
            position={[0, -0.9, 0]}
        />
    );
}

// 프리로드(선택): 첫 로딩 시 버벅임 줄임
useGLTF.preload("/models/vilhelm_draft.glb");
useGLTF.preload("/models/vilhelm_draft.glb");
useGLTF.preload("/models/vilhelm_draft.glb");

export default function BossPreview({ bossName, bossUrl }) {
    return (
        <div className="bossCard">
            <div className="bossTop">
                <div>
                    <div className="hintTitle">Next Boss Preview</div>
                    <div className="bossName">{bossName}</div>
                </div>
                <div className="bossBadge">3D</div>
            </div>

            <div className="bossViewport">
                <Canvas camera={{ position: [0, 1.0, 6.5], fov: 40 }}>
                    <ambientLight intensity={0.8} />
                    <directionalLight position={[2, 3, 2]} intensity={1.2} />

                    <Suspense fallback={<Loader />}>
                        <Environment preset="city" />
                        <BossModel url={boss1} />
                    </Suspense>

                    <OrbitControls
                        target={[0, 0.6, 0]}
                        enablePan={false}
                        minDistance={4}
                        maxDistance={14}
                        minPolarAngle={Math.PI * 0.25}
                        maxPolarAngle={Math.PI * 0.6}
                    />
                </Canvas>
            </div>

            <div className="bossInfo">
                <div className="bossLine">
                    <span className="mutedKey">Hint</span>
                    <span className="mutedVal">통계 기반으로 다음 라운드 보스 예측</span>
                </div>
                <div className="bossLine">
                    <span className="mutedKey">Model</span>
                    <span className="mutedVal">{bossUrl}</span>
                </div>
            </div>
        </div>
    );
}
