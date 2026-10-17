import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import CarPhysics, { COMPETITORS } from "./CarPhysics";
import RaceSession from "./RaceSession";
import { buildCircuit, createFormulaCar } from "./CircuitVisuals";
import { loadRacingAssets } from "./RacingAssets";

const NEUTRAL = { throttle: 0, steer: 0, brake: false, boost: false };
const KEY_CODES = { KeyW: "up", ArrowUp: "up", KeyS: "down", ArrowDown: "down", KeyA: "left", ArrowLeft: "left", KeyD: "right", ArrowRight: "right", KeyE: "interact", KeyR: "reset", Space: "brake", ShiftLeft: "boostLeft", ShiftRight: "boostRight" };
const FALLBACK_KEYS = { w: "up", arrowup: "up", s: "down", arrowdown: "down", a: "left", arrowleft: "left", d: "right", arrowright: "right", e: "interact", r: "reset", " ": "brake", shift: "boostLeft" };
const PROJECTS = { readapt: "Re:adapt", karkartrider: "KarKartRider", inversus: "INVERSUS", workshop: "Dev workshop" };
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
function disposeScene(scene) {
    const geometries = new Set(), materials = new Set(), textures = new Set();
    scene.traverse((object) => {
        if (object.geometry) geometries.add(object.geometry);
        if (object.material) (Array.isArray(object.material) ? object.material : [object.material]).forEach((material) => {
            materials.add(material);
            Object.values(material).forEach((value) => { if (value?.isTexture) textures.add(value); });
        });
    });
    geometries.forEach((entry) => entry.dispose()); textures.forEach((entry) => entry.dispose()); materials.forEach((entry) => entry.dispose());
}

export default function GameWorld({ paused = false, onStatus, onSelect, moveInput = NEUTRAL, reducedMotion = false, resetSignal = 0, raceCommand }) {
    const hostRef = useRef(null);
    const runtimeRef = useRef(null);
    const latestRef = useRef({ paused, onStatus, onSelect, moveInput, reducedMotion });
    const resetRef = useRef(resetSignal);
    const commandRef = useRef(0);
    const [failed, setFailed] = useState(false);
    const [loading, setLoading] = useState(true);
    latestRef.current = { paused, onStatus, onSelect, moveInput, reducedMotion };

    useEffect(() => {
        const host = hostRef.current;
        let cancelled = false;
        let teardown = () => {};
        const initialize = async () => {
            const assets = await loadRacingAssets().catch(() => null);
            if (cancelled) { assets?.dispose(); return; }
            let renderer;
            let physics;
            try {
                renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
                physics = new CarPhysics();
            } catch {
                renderer?.dispose();
                assets?.dispose();
                setFailed(true);
                setLoading(false);
                latestRef.current.onStatus?.({ speed: 0, nearby: null, flipped: false, ready: false });
                return undefined;
            }
            const race = new RaceSession({ laps: 3, competitors: COMPETITORS });
            const scene = new THREE.Scene();
            teardown = () => { disposeScene(scene); assets?.dispose(); physics.dispose(); renderer.dispose(); renderer.domElement.remove(); };
            scene.background = new THREE.Color("#c6cdb4");
            scene.fog = new THREE.Fog("#c6cdb4", 78, 155);
            const camera = new THREE.PerspectiveCamera(44, 1, .1, 240);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));
            renderer.outputColorSpace = THREE.SRGBColorSpace;
            renderer.toneMapping = THREE.ACESFilmicToneMapping;
            renderer.toneMappingExposure = 1;
            renderer.shadowMap.enabled = true;
            renderer.shadowMap.type = THREE.PCFShadowMap;
            const canvas = renderer.domElement;
            canvas.setAttribute("aria-label", "AI 포뮬러 차량과 경주하고 프로젝트 피트에 정차하는 로우폴리 서킷");
            canvas.setAttribute("role", "img");
            host.appendChild(canvas);
            scene.add(new THREE.AmbientLight("#fff0d7", .6), new THREE.HemisphereLight("#e2f0f4", "#8f9e74", 1.2));
            const sun = new THREE.DirectionalLight("#fff0d1", 2.7);
            sun.castShadow = true;
            sun.shadow.mapSize.set(2048, 2048);
            Object.assign(sun.shadow.camera, { left: -33, right: 33, top: 33, bottom: -33, far: 100 });
            sun.shadow.normalBias = .04; sun.shadow.bias = -.00013;
            scene.add(sun, sun.target);
            const circuit = buildCircuit(scene, physics, assets);
            const cars = physics.vehicles.map((car) => ({ ...createFormulaCar(scene, car.color, car.number, assets), simulation: car }));
            canvas.dataset.assets = assets ? "kenney-racing" : "fallback";
            canvas.dataset.assetCount = String(assets?.count || 0);
            setLoading(false);
            const keys = new Set();
            const target = new THREE.Vector3(30, .5, 14);
            const desired = new THREE.Vector3();
            const forward = new THREE.Vector3();
            const offset = new THREE.Vector3(-13.5, 18, 22);
            let frame = 0;
            let lastTime = 0;
            let lastStatusTime = -Infinity;
            let lastSnapshot = "";
            let ready = false;
            let disposed = false;
            let contextLost = false;
            let padBlocked = false;
            let wasPaused = latestRef.current.paused;
            let goTime = 0;

            const emit = (force = false) => {
                const snapshot = { ...physics.status(), ready, race: race.snapshot() };
                const serialized = JSON.stringify(snapshot);
                if (force || serialized !== lastSnapshot) { latestRef.current.onStatus?.(snapshot); lastSnapshot = serialized; }
            };
            const focus = () => { if (!latestRef.current.paused) host.focus({ preventScroll: true }); };
            const release = () => { keys.clear(); padBlocked = true; };
            const recover = () => { release(); physics.recover(); focus(); };
            const command = (type) => {
                release();
                if (type === "start") { physics.reset("race"); race.start(physics.samples()); }
                else { physics.returnToPits(); race.reset(); }
                forward.set(0, 0, -1).applyQuaternion(physics.chassis.quaternion);
                target.set(physics.chassis.position.x, .6, physics.chassis.position.z).addScaledVector(forward, 4.5);
                focus(); emit(true);
            };
            runtimeRef.current = { recover, release, command };
            const resize = () => {
                const width = Math.max(host.clientWidth, 1);
                const height = Math.max(host.clientHeight, 1);
                camera.aspect = width / height; camera.updateProjectionMatrix(); renderer.setSize(width, height);
            };
            const observer = new ResizeObserver(resize);
            observer.observe(host); resize();
            const held = (...codes) => codes.some((code) => keys.has(code));
            const onKeyDown = (event) => {
                if (contextLost || latestRef.current.paused || event.altKey || event.ctrlKey || event.metaKey) return;
                if (event.target instanceof HTMLElement && (event.target.matches("button,a,input,textarea,select") || event.target.isContentEditable)) return;
                const key = KEY_CODES[event.code] || FALLBACK_KEYS[event.key.toLowerCase()];
                if (!key) return;
                event.preventDefault();
                if (key === "reset") { if (!event.repeat) recover(); return; }
                if (key === "interact") {
                    const current = physics.status();
                    if (!event.repeat && current.nearby && current.speed < 7) { release(); latestRef.current.onSelect?.(current.nearby); }
                    return;
                }
                keys.add(event.code || key);
            };
            const onKeyUp = (event) => keys.delete(event.code || FALLBACK_KEYS[event.key.toLowerCase()]);
            const onContextLost = (event) => {
                event.preventDefault(); contextLost = true; ready = false; cancelAnimationFrame(frame); release();
                canvas.dataset.ready = "false"; canvas.hidden = true; runtimeRef.current = null; emit(true); setFailed(true);
            };
            canvas.addEventListener("pointerdown", focus); canvas.addEventListener("webglcontextlost", onContextLost);
            window.addEventListener("keydown", onKeyDown); window.addEventListener("keyup", onKeyUp); window.addEventListener("blur", release);
            const render = (time) => {
                if (disposed || contextLost || document.hidden) return;
                frame = requestAnimationFrame(render);
                const delta = lastTime ? Math.min((time - lastTime) / 1000, .05) : 1 / 60;
                lastTime = time;
                const options = latestRef.current;
                if (options.paused && !wasPaused) release();
                wasPaused = options.paused;
                const pad = options.moveInput || NEUTRAL;
                if (padBlocked && !pad.throttle && !pad.steer && !pad.brake && !pad.boost) padBlocked = false;
                const activePad = padBlocked ? NEUTRAL : pad;
                const input = options.paused ? NEUTRAL : {
                    throttle: clamp(Number(held("KeyW", "ArrowUp", "up")) - Number(held("KeyS", "ArrowDown", "down")) + (activePad.throttle || 0), -1, 1),
                    steer: clamp(Number(held("KeyA", "ArrowLeft", "left")) - Number(held("KeyD", "ArrowRight", "right")) + (activePad.steer || 0), -1, 1),
                    brake: held("Space", "brake") || Boolean(activePad.brake), boost: held("ShiftLeft", "ShiftRight", "boostLeft", "boostRight") || Boolean(activePad.boost),
                };
                const previousPhase = race.phase;
                if (!options.paused) {
                    physics.step(delta, input, { locked: race.phase === "countdown", playerFinished: race.phase === "finished" });
                    race.update(delta, physics.samples());
                    if (previousPhase === "countdown" && race.phase === "racing") goTime = 1.1;
                    goTime = Math.max(0, goTime - delta);
                }
                const snapshot = race.snapshot();
                circuit.setStartLights(snapshot.phase === "countdown" ? Math.min(5, 1 + Math.floor((4 - race.remaining) * 1.25)) : goTime > 0 ? "go" : "off");
                circuit.update(options.paused ? 0 : delta, null, options.reducedMotion);
                cars.forEach(({ body, wheels, brakeMaterial, simulation: car }, index) => {
                    body.position.copy(car.chassis.position); body.quaternion.copy(car.chassis.quaternion);
                    wheels.forEach((wheel, wheelIndex) => { const transform = car.vehicle.wheelInfos[wheelIndex].worldTransform; wheel.position.copy(transform.position); wheel.quaternion.copy(transform.quaternion); });
                    brakeMaterial.emissiveIntensity = index === 0 && (input.brake || input.throttle < 0) ? 1 : .05;
                });
                forward.set(0, 0, -1).applyQuaternion(physics.chassis.quaternion); forward.y = 0; forward.normalize();
                desired.set(physics.chassis.position.x, .6, physics.chassis.position.z).addScaledVector(forward, 4.5);
                target.lerp(desired, 1 - Math.exp(-delta * 3.8));
                camera.position.copy(target).add(offset); camera.lookAt(target);
                sun.position.set(target.x - 15, 35, target.z + 20); sun.target.position.set(target.x, 0, target.z);
                renderer.render(scene, camera);
                canvas.dataset.drawCalls = String(renderer.info.render.calls);
                const status = physics.status();
                Object.assign(canvas.dataset, { x: status.x.toFixed(2), z: status.z.toFixed(2), speed: status.speed.toFixed(2), height: physics.chassis.position.y.toFixed(3), grounded: String(status.grounded), flipped: String(status.flipped), collisions: String(status.collisions), nearby: status.nearby || "", phase: snapshot.phase, lap: String(snapshot.lap), position: String(snapshot.position), elapsed: snapshot.elapsed.toFixed(2), ai: JSON.stringify(physics.samples().filter((car) => car.id !== "player")) });
                if (!ready) { ready = true; canvas.dataset.ready = "true"; emit(true); }
                if (time - lastStatusTime > 120) { emit(); lastStatusTime = time; }
            };
            const onVisibility = () => { release(); if (contextLost) return; if (document.hidden) cancelAnimationFrame(frame); else { lastTime = 0; frame = requestAnimationFrame(render); } };
            document.addEventListener("visibilitychange", onVisibility);
            frame = requestAnimationFrame(render); focus();
            teardown = () => {
                disposed = true; cancelAnimationFrame(frame); observer.disconnect();
                canvas.removeEventListener("pointerdown", focus); canvas.removeEventListener("webglcontextlost", onContextLost);
                window.removeEventListener("keydown", onKeyDown); window.removeEventListener("keyup", onKeyUp); window.removeEventListener("blur", release); document.removeEventListener("visibilitychange", onVisibility);
                disposeScene(scene);
                sun.shadow.dispose(); physics.dispose(); renderer.dispose(); assets?.dispose(); canvas.remove(); runtimeRef.current = null;
            };
        };
        initialize().catch(() => {
            teardown();
            if (!cancelled) { setLoading(false); setFailed(true); }
        });
        return () => { cancelled = true; teardown(); };
    }, []);
    useEffect(() => { if (paused) runtimeRef.current?.release(); }, [paused]);
    useEffect(() => { if (resetRef.current !== resetSignal) { resetRef.current = resetSignal; runtimeRef.current?.recover(); } }, [resetSignal]);
    useEffect(() => { if (raceCommand && commandRef.current !== raceCommand.serial) { commandRef.current = raceCommand.serial; runtimeRef.current?.command(raceCommand.type); } }, [raceCommand]);
    return <div className="driving-world"><div className="driving-canvas" ref={hostRef} tabIndex={0} aria-label="포뮬러 운전. WASD 또는 방향키, Space 제동, Shift 부스트, E 피트 프로젝트, R 복구." />{loading && <div className="drive-loading" role="status">서킷을 준비하고 있어요.</div>}{failed && <div className="drive-fallback"><p>3D 서킷을 표시할 수 없어요. 프로젝트를 바로 볼 수 있습니다.</p><div>{Object.entries(PROJECTS).map(([id, name]) => <button key={id} type="button" onClick={() => onSelect?.(id)}>{name}</button>)}</div></div>}</div>;
}
