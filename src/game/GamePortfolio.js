import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { FiArrowDown, FiArrowRight, FiArrowUpRight, FiCheck, FiChevronDown, FiChevronLeft, FiChevronRight, FiChevronUp, FiCompass, FiGithub, FiHelpCircle, FiMapPin, FiRotateCcw, FiSun, FiUser, FiVolume2, FiVolumeX } from "react-icons/fi";
import GameWorld from "./GameWorld";
import ProjectPanel from "./ProjectPanel";
import Modal from "../resume/Modal";
import "./game.css";

const places = [
    { id: "readapt", number: "01", name: "Re:adapt", field: "TPS · UNREAL ENGINE 5", image: "readapt-project.png", color: "coral" },
    { id: "karkartrider", number: "02", name: "KarKartRider", field: "RACING · C++ / OPENGL", image: "kartrider.png", color: "blue" },
    { id: "inversus", number: "03", name: "INVERSUS", field: "2D SHOOTER · WIN32 API", image: "인버서스.png", color: "sage" },
    { id: "workshop", number: "04", name: "Dev workshop", field: "AI AGENTS · DEV TOOLS", image: "devil-codex-main.png", color: "purple" },
];
const progressKey = "youngbin-world-explored-v1";
function readProgress() {
    try { const value = JSON.parse(localStorage.getItem(progressKey) || "[]"); return Array.isArray(value) ? [...new Set(value.filter((id) => places.some((place) => place.id === id)))] : []; } catch { return []; }
}
function Key({ children }) { return <kbd>{children}</kbd>; }

export default function GamePortfolio() {
    const [playing, setPlaying] = useState(false);
    const [selected, setSelected] = useState(null);
    const [visited, setVisited] = useState(readProgress);
    const [travelTarget, setTravelTarget] = useState(null);
    const [status, setStatus] = useState({ x: 0, z: 3, nearby: null, moving: false, ready: false });
    const [moveInput, setMoveInput] = useState({ x: 0, y: 0 });
    const [interactSignal, setInteractSignal] = useState(0);
    const [sound, setSound] = useState(false);
    const [reducedMotion, setReducedMotion] = useState(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    const audioRef = useRef(null);
    const serialRef = useRef(0);
    const onStart = useCallback(() => setPlaying(true), []);
    const onStatus = useCallback((next) => setStatus((current) => current.x === next.x && current.z === next.z && current.nearby === next.nearby && current.moving === next.moving && current.ready === next.ready ? current : next), []);
    const onClose = useCallback(() => setSelected(null), []);

    useEffect(() => {
        const previousTitle = document.title;
        document.title = "유영빈 · Playable Portfolio";
        document.body.classList.add("game-mode");
        return () => { document.body.classList.remove("game-mode"); document.title = previousTitle; audioRef.current?.close(); };
    }, []);
    useEffect(() => { try { localStorage.setItem(progressKey, JSON.stringify(visited)); } catch { /* Progress remains available for this visit. */ } }, [visited]);
    useEffect(() => {
        const release = () => setMoveInput({ x: 0, y: 0 });
        const onVisibility = () => { if (document.hidden) release(); };
        window.addEventListener("blur", release);
        document.addEventListener("visibilitychange", onVisibility);
        return () => { window.removeEventListener("blur", release); document.removeEventListener("visibilitychange", onVisibility); };
    }, []);
    useEffect(() => {
        const media = window.matchMedia("(prefers-reduced-motion: reduce)");
        const onChange = (event) => setReducedMotion(event.matches);
        media.addEventListener("change", onChange);
        return () => media.removeEventListener("change", onChange);
    }, []);

    const playChime = useCallback(() => {
        const context = audioRef.current;
        if (!sound || !context || context.state !== "running") return;
        [523.25, 659.25, 783.99].forEach((frequency, index) => {
            const oscillator = context.createOscillator();
            const gain = context.createGain();
            const start = context.currentTime + index * .075;
            oscillator.type = "sine";
            oscillator.frequency.value = frequency;
            gain.gain.setValueAtTime(0, start);
            gain.gain.linearRampToValueAtTime(.05, start + .012);
            gain.gain.exponentialRampToValueAtTime(.001, start + .22);
            oscillator.connect(gain); gain.connect(context.destination);
            oscillator.start(start); oscillator.stop(start + .24);
        });
    }, [sound]);
    const toggleSound = async () => {
        if (sound) { setSound(false); return; }
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        try { if (!audioRef.current) audioRef.current = new AudioContext(); await audioRef.current.resume(); setSound(true); } catch { setSound(false); }
    };
    const onSelect = useCallback((id) => {
        setSelected(id); setMoveInput({ x: 0, y: 0 });
        if (places.some((place) => place.id === id)) {
            setVisited((current) => current.includes(id) ? current : [...current, id]);
            playChime();
        }
    }, [playChime]);
    const onTravel = useCallback((id) => {
        setPlaying(true); setSelected(null); setMoveInput({ x: 0, y: 0 });
        if (!status.ready && id !== "spawn") { onSelect(id); return; }
        setTravelTarget({ id, serial: ++serialRef.current });
    }, [status.ready, onSelect]);
    const startMove = (event, x, y) => { event.preventDefault(); event.currentTarget.setPointerCapture(event.pointerId); setPlaying(true); setMoveInput({ x, y }); };
    const stopMove = () => setMoveInput({ x: 0, y: 0 });
    const nearby = places.find((place) => place.id === status.nearby);
    const coordinates = `${Number(status.x || 0).toFixed(1)}, ${Number(status.z || 0).toFixed(1)}`;

    return <main className={`game-site${playing ? " is-playing" : ""}${reducedMotion ? " motion-reduced" : ""}`}>
        <a className="game-skip" href="#project-dock">프로젝트 바로 보기</a>
        <header className="game-topbar">
            <a className="game-brand" href={`${process.env.PUBLIC_URL}/play`} aria-label="유영빈 플레이그라운드 처음으로"><span className="brand-symbol"><FiCompass aria-hidden="true" /></span><span>YB<span className="brand-slash"> / </span>PLAYGROUND<span className="brand-caption">GAME CLIENT DEVELOPER</span></span></a>
            <nav className="game-topnav" aria-label="주요 메뉴"><button onClick={() => onSelect("profile")}><FiUser aria-hidden="true" /><span>플레이어 소개</span></button><Link to="/resume">이력서<FiArrowUpRight aria-hidden="true" /></Link><a href="https://github.com/neneee0181" target="_blank" rel="noopener noreferrer"><FiGithub aria-hidden="true" /><span>GitHub</span><FiArrowUpRight aria-hidden="true" /></a><span className="topnav-divider" /><button className="icon-button sound-toggle" onClick={toggleSound} aria-label={sound ? "효과음 끄기" : "효과음 켜기"} aria-pressed={sound}>{sound ? <FiVolume2 aria-hidden="true" /> : <FiVolumeX aria-hidden="true" />}</button></nav>
        </header>
        <div className="game-stage">
            <section className="game-hero" aria-label="플레이 가능한 포트폴리오">
                <div className="hero-eyebrow"><span />A PLAYABLE PORTFOLIO</div>
                <h1>코드로 만든<br /><span>작은 세계.</span><span className="hero-star" aria-hidden="true">✳</span></h1>
                <div className="hero-copy"><p className="hero-name">유영빈<span>게임 클라이언트 개발자</span></p><p>C++과 Unreal Engine으로 게임을 만들고,<br />더 나은 제작 경험을 위한 도구를 개발합니다.</p></div>
                <div className="hero-actions"><button className="play-button" onClick={onStart}>월드 탐험하기<FiArrowRight aria-hidden="true" /></button><button className="profile-button" onClick={() => onSelect("profile")}>프로필 보기<FiArrowUpRight aria-hidden="true" /></button></div>
                <p className="hero-hint"><span className="hint-line" />프로젝트로 걸어가거나, 아래 목록에서 골라보세요.</p>
                {playing && <div className="explorer-badge"><span className="explorer-dot" /><span>EXPLORING THE WORLD</span><button onClick={() => setPlaying(false)}>소개 보기</button></div>}
            </section>
            <div className="world-status"><span className="world-id">WORLD 01<span>THE DEVELOPER'S GARDEN</span></span><div className="discovery-progress" aria-label={`지역 ${places.length}개 중 ${visited.length}개 탐험 완료`}><span>탐험 기록</span><div>{places.map((place) => <span key={place.id} className={visited.includes(place.id) ? "is-found" : ""}>{visited.includes(place.id) && <FiCheck aria-hidden="true" />}</span>)}</div><strong>{String(visited.length).padStart(2, "0")}<span> / 04</span></strong></div></div>
            <GameWorld isPlaying={playing && !selected} onStart={onStart} onSelect={onSelect} onStatus={onStatus} reducedMotion={reducedMotion} travelTarget={travelTarget} moveInput={moveInput} interactSignal={interactSignal} />
            <div className="world-corner-note" aria-hidden="true"><span>N</span><FiCompass /><span>34° / ISOMETRIC</span></div>
            <div className="game-hud"><div className="hud-position"><FiMapPin aria-hidden="true" /><span>PLAYER 01</span><span className="coordinate-value">{coordinates}</span><span className={`movement-dot${status.moving ? " is-moving" : ""}`} /></div><div className="keyboard-guide"><span><Key>W</Key><Key>A</Key><Key>S</Key><Key>D</Key><span>이동</span></span><span><Key>SHIFT</Key><span>달리기</span></span><span><Key>E</Key><span>프로젝트 열기</span></span></div><div className="hud-actions"><button onClick={() => onTravel("spawn")} aria-label="시작 위치로 돌아가기" title="시작 위치로"><FiRotateCcw aria-hidden="true" /></button><button onClick={() => setReducedMotion((value) => !value)} aria-label={reducedMotion ? "장식 애니메이션 켜기" : "움직임 줄이기"} aria-pressed={reducedMotion} title="움직임 줄이기"><FiSun aria-hidden="true" /></button><button onClick={() => setSelected("help")} aria-label="조작 방법 보기" title="조작 방법"><FiHelpCircle aria-hidden="true" /></button></div></div>
            {playing && nearby && !selected && <button className="interaction-prompt" onClick={() => onSelect(nearby.id)}><Key>E</Key><span>{nearby.name}</span><span>프로젝트 열기<FiArrowUpRight aria-hidden="true" /></span></button>}
            <div className="touch-controls" aria-label="터치 이동 조작"><div className="touch-dpad">{[{key:"up",x:0,y:1,Icon:FiChevronUp,label:"앞으로 이동"},{key:"left",x:-1,y:0,Icon:FiChevronLeft,label:"왼쪽으로 이동"},{key:"right",x:1,y:0,Icon:FiChevronRight,label:"오른쪽으로 이동"},{key:"down",x:0,y:-1,Icon:FiChevronDown,label:"뒤로 이동"}].map(({key,x,y,Icon,label})=><button key={key} className={`dpad-${key}`} aria-label={label} onPointerDown={(event)=>startMove(event,x,y)} onPointerUp={stopMove} onPointerCancel={stopMove} onLostPointerCapture={stopMove}><Icon aria-hidden="true" /></button>)}<span className="dpad-center" /></div><button className="touch-interact" onClick={() => { setPlaying(true); setInteractSignal((value)=>value+1); }} disabled={!nearby} aria-label={nearby ? `${nearby.name} 프로젝트 열기` : "프로젝트 가까이 이동하세요"}><Key>E</Key><span>열기</span></button></div>
            <section className="project-dock" id="project-dock" aria-labelledby="dock-heading"><div className="dock-heading"><h2 id="dock-heading">어디부터 가볼까요?<span>SELECT A DESTINATION</span></h2><span><FiArrowDown aria-hidden="true" />4개의 지역, 4개의 이야기</span></div><div className="dock-slots">{places.map((place) => <button className={`zone-card zone-${place.color}${visited.includes(place.id) ? " is-visited" : ""}`} key={place.id} onClick={() => onTravel(place.id)} aria-label={`${place.name} 지역으로 이동`}><span className="zone-number">{place.number}</span><span className="zone-visual"><img src={`${process.env.PUBLIC_URL}/img/project/${place.image}`} alt="" />{visited.includes(place.id) && <span className="zone-check"><FiCheck aria-hidden="true" /></span>}</span><span className="zone-copy"><span className="zone-field">{place.field}</span><strong>{place.name}</strong><span className="zone-link">탐험하기<FiArrowUpRight aria-hidden="true" /></span></span></button>)}</div></section>
        </div>
        <footer className="game-footer"><span>DESIGNED TO BE EXPLORED.<span>BUILT TO BE PLAYED.</span></span><a href="mailto:kevin018111@gmail.com">함께 만들 이야기가 있나요?<span>LET'S TALK<FiArrowUpRight aria-hidden="true" /></span></a></footer>
        <ProjectPanel selected={selected} onClose={onClose} onTravel={onTravel} />
        <Modal isOpen={selected === "help"} onClose={onClose} title="HOW TO PLAY"><article className="game-panel help-panel"><div className="panel-eyebrow"><span>CONTROLS / 00</span><span>WELCOME, PLAYER</span></div><h3>당신의 속도로 탐험하세요.</h3><p>작은 섬의 네 지역에 개발 이야기를 담았습니다. 캐릭터를 움직여 프로젝트에 가까이 가거나, 아래 지역 목록을 선택해 보세요.</p><dl className="help-controls"><div><dt><Key>W A S D</Key> / <Key>↑ ← ↓ →</Key></dt><dd>캐릭터 이동</dd></div><div><dt><Key>SHIFT</Key></dt><dd>빠르게 이동</dd></div><div><dt><Key>E</Key></dt><dd>가까운 프로젝트 열기</dd></div><div><dt><Key>R</Key></dt><dd>시작 위치로 돌아가기</dd></div><div><dt><Key>ESC</Key></dt><dd>프로젝트 창 닫기</dd></div></dl><p className="help-note">마우스나 터치로 바닥을 누르면 해당 위치로 이동합니다. 모바일에서는 화면 아래 방향키로도 움직일 수 있어요. 상단 이력서에서 모든 프로젝트와 경력을 문서로 볼 수 있습니다.</p><button className="play-button" onClick={() => { onClose(); onStart(); }}>탐험 계속하기<FiArrowRight aria-hidden="true" /></button></article></Modal>
    </main>;
}
