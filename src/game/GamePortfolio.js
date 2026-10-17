import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { FiArrowDown, FiArrowLeft, FiArrowRight, FiArrowUp, FiArrowUpRight, FiFlag, FiHelpCircle } from "react-icons/fi";
import GameWorld from "./GameWorld";
import ProjectPanel from "./ProjectPanel";
import Modal from "../resume/Modal";
import "./game.css";

const regionNames = { readapt: "Re:adapt", karkartrider: "KarKartRider", inversus: "INVERSUS", workshop: "Dev workshop" };
const zeroInput = { throttle: 0, steer: 0, brake: false, boost: false };
const controlNames = { left: "좌회전", right: "우회전", forward: "가속", reverse: "제동 · 후진", brake: "브레이크" };
const controlIcons = { left: FiArrowLeft, right: FiArrowRight, forward: FiArrowUp, reverse: FiArrowDown };
function Key({ children }) { return <kbd>{children}</kbd>; }
function formatRaceTime(value) {
    if (!Number.isFinite(value)) return "—";
    const hundredths = Math.floor(Math.max(0, value) * 100);
    const minutes = Math.floor(hundredths / 6000);
    const seconds = String(Math.floor(hundredths / 100) % 60).padStart(2, "0");
    return `${minutes}:${seconds}.${String(hundredths % 100).padStart(2, "0")}`;
}

export default function GamePortfolio() {
    const [selected, setSelected] = useState(null);
    const [status, setStatus] = useState({ speed: 0, nearby: null, flipped: false, ready: false });
    const [moveInput, setMoveInput] = useState(zeroInput);
    const [resetSignal, setResetSignal] = useState(0);
    const [raceCommand, setRaceCommand] = useState(null);
    const [showHint, setShowHint] = useState(true);
    const [reducedMotion, setReducedMotion] = useState(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    const heldControls = useRef(new Set());
    const hintTimer = useRef(null);
    const hasDriven = useRef(false);
    const finishRef = useRef(null);
    const race = status.race;
    const raceActive = Boolean(race && race.phase !== "free");
    const raceFinished = race?.phase === "finished";

    const releaseControls = useCallback(() => { heldControls.current.clear(); setMoveInput(zeroInput); }, []);
    const onStatus = useCallback((next) => {
        setStatus(next);
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
    const resetCar = () => { releaseControls(); setResetSignal((value) => value + 1); onClose(); };
    const commandRace = (type) => {
        releaseControls();
        setSelected(null);
        setRaceCommand((current) => ({ type, serial: (current?.serial || 0) + 1 }));
    };

    useEffect(() => {
        const previousTitle = document.title;
        document.title = "유영빈 · PIT LANE.";
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
    useEffect(() => {
        if (raceFinished) {
            releaseControls();
            finishRef.current?.focus({ preventScroll: true });
        }
    }, [raceFinished, releaseControls]);

    const updateControls = () => {
        const keys = heldControls.current;
        setMoveInput({ throttle: Number(keys.has("forward")) - Number(keys.has("reverse")), steer: Number(keys.has("left")) - Number(keys.has("right")), brake: keys.has("brake"), boost: false });
    };
    const pressControl = (event, control) => { event.preventDefault(); event.currentTarget.setPointerCapture(event.pointerId); heldControls.current.add(control); updateControls(); };
    const releaseControl = (control) => { heldControls.current.delete(control); updateControls(); };
    const touchButton = (control) => {
        const Icon = controlIcons[control];
        return <button key={control} type="button" className={`drive-touch-button control-${control}`} aria-label={controlNames[control]} onPointerDown={(event) => pressControl(event, control)} onPointerUp={() => releaseControl(control)} onPointerCancel={() => releaseControl(control)} onLostPointerCapture={() => releaseControl(control)}>{Icon ? <Icon aria-hidden="true" /> : <span>BRAKE</span>}</button>;
    };

    return <main className={`drive-site${raceActive ? " is-racing" : ""}`} aria-label="유영빈의 서킷 포트폴리오">
        <h1 className="sr-only">서킷을 달리며 만나는 유영빈의 포트폴리오</h1>
        <GameWorld paused={Boolean(selected)} onStatus={onStatus} onSelect={onSelect} moveInput={moveInput} reducedMotion={reducedMotion} resetSignal={resetSignal} raceCommand={raceCommand} />
        <header className="drive-header">
            <span className="drive-signature">유영빈<span>PIT LANE.</span></span>
            <nav aria-label="포트폴리오 메뉴">
                <button className={`drive-race-toggle${raceActive ? " is-active" : ""}`} type="button" disabled={!status.ready} onClick={() => commandRace(raceActive ? "free" : "start")}>
                    {!raceActive && <FiFlag aria-hidden="true" />}{raceActive ? "피트로" : "AI와 3랩"}
                </button>
                <Link to="/resume">이력서<FiArrowUpRight aria-hidden="true" /></Link>
                <button type="button" onClick={() => onSelect("help")} aria-label="운전 방법"><FiHelpCircle aria-hidden="true" /></button>
            </nav>
        </header>
        {raceActive && <section className="race-status" aria-label="레이스 현황">
            <div><span>POS</span><strong>{race.position}<small> / {race.results?.length || 4}</small></strong></div>
            <div><span>LAP</span><strong>{race.lap}<small> / {race.totalLaps}</small></strong></div>
            <div className="race-status-time"><span>TIME</span><strong>{formatRaceTime(race.elapsed)}</strong></div>
        </section>}
        {race?.phase === "countdown" && !selected && <div className="race-countdown" role="status" aria-live="polite" aria-atomic="true"><span>READY TO RACE</span><strong key={race.countdown}>{race.countdown}</strong><p>AI 차량 3대와 3랩</p></div>}
        {raceFinished && !selected && <section ref={finishRef} className="race-results" tabIndex={-1} aria-labelledby="race-result-title">
            <div className="race-results-heading"><FiFlag aria-hidden="true" /><span>CHEQUERED FLAG</span></div>
            <h2 id="race-result-title">{race.position === 1 ? "첫 번째로 들어왔어요." : `${race.position}위로 완주했어요.`}</h2>
            <div className="race-results-time"><span>총 주행 시간</span><strong>{formatRaceTime(race.elapsed)}</strong></div>
            <ol aria-label="레이스 결과">{race.results?.map((result) => <li key={result.id} className={result.id === "player" ? "is-player" : ""}><span className="race-result-position">{result.position}</span><span className="race-result-name">{result.id === "player" ? "YOU" : result.name}</span><span className="race-result-time">{result.finished ? formatRaceTime(result.time) : "주행 중"}</span></li>)}</ol>
            {Number.isFinite(race.bestLap) && <p className="race-best-lap"><span>BEST LAP</span><strong>{formatRaceTime(race.bestLap)}</strong></p>}
            <div className="race-results-actions"><button type="button" onClick={() => commandRace("free")}>피트로 돌아가기</button><button type="button" onClick={() => commandRace("start")}>다시 달리기<FiArrowRight aria-hidden="true" /></button></div>
        </section>}
        <div className={`drive-hint${showHint ? "" : " is-dismissed"}`} aria-hidden={!showHint}><span className="drive-project-hint">피트에 정차 → <Key>E</Key> 프로젝트</span><span><Key>W A S D</Key> 운전</span><span><Key>SPACE</Key> 브레이크</span><span><Key>SHIFT</Key> 부스트</span><span><Key>R</Key> 트랙 복귀</span></div>
        <div className="drive-speed" aria-hidden="true"><strong>{Math.round(status.speed || 0)}</strong><span>km/h</span></div>
        {status.nearby && !selected && !raceFinished && <button className="drive-region-prompt" type="button" onClick={() => onSelect(status.nearby)}><Key>E</Key><span>{regionNames[status.nearby]}</span><span>둘러보기<FiArrowUpRight aria-hidden="true" /></span></button>}
        {status.flipped && !selected && !raceFinished && <button className="drive-recover" type="button" onClick={resetCar}>차량 바로 세우기<Key>R</Key></button>}
        {!selected && !raceFinished && <div className="drive-touch" aria-label="터치 운전 조작"><div className="drive-steering">{touchButton("left")}{touchButton("right")}</div><div className="drive-handbrake">{touchButton("brake")}</div><div className="drive-pedals">{touchButton("forward")}{touchButton("reverse")}</div></div>}
        <ProjectPanel selected={selected} onClose={onClose} />
        <Modal isOpen={selected === "help"} onClose={onClose} title="서킷과 피트레인">
            <article className="game-panel driving-help">
                <p>서킷을 자유롭게 달리거나 AI 차량 3대와 3랩 레이스를 즐겨 보세요. 피트레인의 네 개 프로젝트 차고 앞에 정차하면 포트폴리오를 열 수 있습니다.</p>
                <dl><div><dt><Key>W / ↑</Key></dt><dd>가속</dd></div><div><dt><Key>S / ↓</Key></dt><dd>제동 · 후진</dd></div><div><dt><Key>A D / ← →</Key></dt><dd>조향</dd></div><div><dt><Key>SPACE</Key></dt><dd>브레이크</dd></div><div><dt><Key>SHIFT</Key></dt><dd>부스트</dd></div><div><dt><Key>E</Key></dt><dd>정차한 차고의 포트폴리오 열기</dd></div><div><dt><Key>R</Key></dt><dd>가까운 트랙으로 차량 복귀</dd></div></dl>
                <p className="driving-help-note">커브에 진입하기 전에 속도를 줄여 보세요. 프로젝트를 읽거나 이 창을 여는 동안에는 주행과 레이스 시간이 잠시 멈춥니다.</p>
                <p className="driving-help-note">3D 모델: <a href="https://kenney.nl/assets/racing-kit" target="_blank" rel="noopener noreferrer">Kenney Racing Kit · CC0<FiArrowUpRight aria-hidden="true" /></a></p>
                <div className="driving-help-actions"><button type="button" onClick={resetCar}>차량 복귀</button><button type="button" onClick={onClose}>운전 계속하기<FiArrowRight aria-hidden="true" /></button></div>
            </article>
        </Modal>
    </main>;
}
