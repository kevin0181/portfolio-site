import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { FiArrowDown, FiArrowLeft, FiArrowRight, FiArrowUp, FiArrowUpRight, FiHelpCircle } from "react-icons/fi";
import GameWorld from "./GameWorld";
import ProjectPanel from "./ProjectPanel";
import Modal from "../resume/Modal";
import "./game.css";

const regionNames = { readapt: "Re:adapt", karkartrider: "KarKartRider", inversus: "INVERSUS", workshop: "Dev workshop" };
const zeroInput = { throttle: 0, steer: 0, brake: false, boost: false };
const controlNames = { left: "좌회전", right: "우회전", forward: "가속", reverse: "제동 · 후진", brake: "핸드브레이크" };
const controlIcons = { left: FiArrowLeft, right: FiArrowRight, forward: FiArrowUp, reverse: FiArrowDown };
function Key({ children }) { return <kbd>{children}</kbd>; }

export default function GamePortfolio() {
    const [selected, setSelected] = useState(null);
    const [status, setStatus] = useState({ speed: 0, nearby: null, flipped: false, ready: false });
    const [moveInput, setMoveInput] = useState(zeroInput);
    const [resetSignal, setResetSignal] = useState(0);
    const [showHint, setShowHint] = useState(true);
    const [reducedMotion, setReducedMotion] = useState(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    const heldControls = useRef(new Set());
    const hintTimer = useRef(null);
    const hasDriven = useRef(false);

    const releaseControls = useCallback(() => { heldControls.current.clear(); setMoveInput(zeroInput); }, []);
    const onStatus = useCallback((next) => {
        setStatus((current) => Math.round(current.speed) === Math.round(next.speed) && current.nearby === next.nearby && current.flipped === next.flipped && current.ready === next.ready ? current : next);
        if (next.speed > 3 && !hasDriven.current) {
            hasDriven.current = true;
            hintTimer.current = window.setTimeout(() => setShowHint(false), 4500);
        }
    }, []);
    const onSelect = useCallback((id) => { releaseControls(); setSelected(id); }, [releaseControls]);
    const onClose = useCallback(() => {
        setSelected(null);
        requestAnimationFrame(() => document.querySelector(".driving-canvas")?.focus({ preventScroll: true }));
    }, []);
    const resetCar = () => { releaseControls(); setResetSignal((value) => value + 1); setSelected(null); };

    useEffect(() => {
        const previousTitle = document.title;
        document.title = "유영빈 · Drive around";
        document.body.classList.add("game-mode", "drive-mode");
        const onVisibility = () => { if (document.hidden) releaseControls(); };
        window.addEventListener("blur", releaseControls);
        document.addEventListener("visibilitychange", onVisibility);
        return () => {
            window.removeEventListener("blur", releaseControls);
            document.removeEventListener("visibilitychange", onVisibility);
            window.clearTimeout(hintTimer.current);
            document.body.classList.remove("game-mode", "drive-mode");
            document.title = previousTitle;
        };
    }, [releaseControls]);
    useEffect(() => {
        const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
        const onChange = (event) => setReducedMotion(event.matches);
        preference.addEventListener("change", onChange);
        return () => preference.removeEventListener("change", onChange);
    }, []);

    const updateControls = () => {
        const keys = heldControls.current;
        setMoveInput({ throttle: Number(keys.has("forward")) - Number(keys.has("reverse")), steer: Number(keys.has("left")) - Number(keys.has("right")), brake: keys.has("brake"), boost: false });
    };
    const pressControl = (event, control) => { event.preventDefault(); event.currentTarget.setPointerCapture(event.pointerId); heldControls.current.add(control); updateControls(); };
    const releaseControl = (control) => { heldControls.current.delete(control); updateControls(); };
    const touchButton = (control) => {
        const Icon = controlIcons[control];
        return <button key={control} type="button" className={`drive-touch-button control-${control}`} aria-label={controlNames[control]} onPointerDown={(event) => pressControl(event, control)} onPointerUp={() => releaseControl(control)} onPointerCancel={() => releaseControl(control)} onLostPointerCapture={() => releaseControl(control)}>{Icon ? <Icon aria-hidden="true" /> : <span>DRIFT</span>}</button>;
    };

    return <main className="drive-site" aria-label="유영빈의 드라이빙 포트폴리오">
        <h1 className="sr-only">자동차로 탐험하는 유영빈의 포트폴리오</h1>
        <GameWorld paused={Boolean(selected)} onStatus={onStatus} onSelect={onSelect} moveInput={moveInput} reducedMotion={reducedMotion} resetSignal={resetSignal} />
        <header className="drive-header"><span className="drive-signature">유영빈<span>DRIVE AROUND.</span></span><nav aria-label="포트폴리오 메뉴"><Link to="/resume">이력서<FiArrowUpRight aria-hidden="true" /></Link><button type="button" onClick={() => onSelect("help")} aria-label="운전 방법"><FiHelpCircle aria-hidden="true" /></button></nav></header>
        <div className={`drive-hint${showHint ? "" : " is-dismissed"}`} aria-hidden={!showHint}><span><Key>W A S D</Key> 운전</span><span><Key>SPACE</Key> 드리프트</span><span><Key>SHIFT</Key> 부스트</span><span><Key>R</Key> 다시 놓기</span></div>
        <div className="drive-speed" aria-hidden="true"><strong>{Math.round(status.speed || 0)}</strong><span>km/h</span></div>
        {status.nearby && !selected && <button className="drive-region-prompt" type="button" onClick={() => onSelect(status.nearby)}><Key>E</Key><span>{regionNames[status.nearby]}</span><span>둘러보기<FiArrowUpRight aria-hidden="true" /></span></button>}
        {status.flipped && !selected && <button className="drive-recover" type="button" onClick={resetCar}>차량 바로 세우기<Key>R</Key></button>}
        {!selected && <div className="drive-touch" aria-label="터치 운전 조작"><div className="drive-steering">{touchButton("left")}{touchButton("right")}</div><div className="drive-handbrake">{touchButton("brake")}</div><div className="drive-pedals">{touchButton("forward")}{touchButton("reverse")}</div></div>}
        <ProjectPanel selected={selected} onClose={onClose} />
        <Modal isOpen={selected === "help"} onClose={onClose} title="천천히 드라이브해 보세요."><article className="game-panel driving-help"><p>경사로를 타고, 상자를 밀고, 원하는 곳에 멈춰 보세요. 네 개의 프로젝트 지역에서 차를 세우면 포트폴리오를 열 수 있습니다.</p><dl><div><dt><Key>W / ↑</Key></dt><dd>가속</dd></div><div><dt><Key>S / ↓</Key></dt><dd>제동 · 후진</dd></div><div><dt><Key>A D / ← →</Key></dt><dd>조향</dd></div><div><dt><Key>SPACE</Key></dt><dd>핸드브레이크 · 드리프트</dd></div><div><dt><Key>SHIFT</Key></dt><dd>부스트</dd></div><div><dt><Key>E</Key></dt><dd>정차한 지역의 포트폴리오 열기</dd></div><div><dt><Key>R</Key></dt><dd>차량 다시 놓기</dd></div></dl><div className="driving-help-actions"><button type="button" onClick={resetCar}>차량 초기화</button><button type="button" onClick={onClose}>운전 계속하기<FiArrowRight aria-hidden="true" /></button></div></article></Modal>
    </main>;
}
