import React, { useMemo, useState } from "react";
import "./demo.css";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, useGLTF, Html } from "@react-three/drei";
import BossPreview from "./BossPreview";

/** ====== tiny svg charts (no deps) ====== */
function SparkLine({ data, height = 56, padding = 6 }) {
    const width = 240;
    const points = useMemo(() => {
        if (!data?.length) return "";
        const min = Math.min(...data);
        const max = Math.max(...data);
        const range = Math.max(1e-6, max - min);
        const step = (width - padding * 2) / (data.length - 1);

        return data
            .map((v, i) => {
                const x = padding + i * step;
                const y = padding + (height - padding * 2) * (1 - (v - min) / range);
                return `${x.toFixed(1)},${y.toFixed(1)}`;
            })
            .join(" ");
    }, [data, height, padding]);

    return (
        <svg className="spark" viewBox={`0 0 240 ${height}`} preserveAspectRatio="none">
            <polyline className="sparkLine" points={points} />
            <line className="sparkAxis" x1="0" y1={height - 1} x2="240" y2={height - 1} />
        </svg>
    );
}

function MiniBar({ value01 }) {
    const v = Math.max(0, Math.min(1, value01));
    return (
        <div className="miniBar">
            <div className="miniBarFill" style={{ width: `${v * 100}%` }} />
        </div>
    );
}

/** ====== fake data ====== */
const ROUNDS = Array.from({ length: 8 }, (_, i) => i + 1);

function makeDemo(round) {
    // deterministic-ish variation per round
    const base = round * 7;
    const line = (n, fn) => Array.from({ length: n }, (_, i) => fn(i));

    const distance = line(12, (i) => 120 + (i * 8) + ((base + i * 11) % 17) - 8);
    const accuracy = line(12, (i) => 0.42 + (((base + i * 9) % 23) / 100) - 0.08);
    const evade = line(12, (i) => 0.30 + (((base + i * 13) % 29) / 100) - 0.10);

    const aiLogs = [
        { t: "00:14", tag: "Policy", msg: "공격 빈도 ↑ (Aggression +0.08)" },
        { t: "00:41", tag: "Difficulty", msg: "체력 스케일 1.00 → 1.10" },
        { t: "01:02", tag: "Counter", msg: "회피 성향 높음 → 투사체 속도 +6%" },
        { t: "01:25", tag: "Spawn", msg: "근접 몹 비중 ↓ / 원거리 비중 ↑" },
    ].map((x, idx) => ({
        ...x,
        id: `${round}-${idx}`,
        severity: idx % 3 === 0 ? "info" : idx % 3 === 1 ? "warn" : "ok",
    }));

    const pcg = {
        obstacleDensity: 0.25 + ((base % 20) / 100),
        clearTimeSec: 180 + (base % 60),
        deaths: [
            { reason: "투사체 피격", count: 2 + (base % 3) },
            { reason: "근접 러시", count: 1 + ((base + 1) % 3) },
            { reason: "함정/장애물", count: (base % 2) },
        ],
    };

    const aiParams = {
        hpScale: (1.0 + (base % 15) / 100).toFixed(2),
        dmgScale: (1.0 + ((base + 5) % 18) / 100).toFixed(2),
        aggression: (0.35 + ((base + 3) % 30) / 100).toFixed(2),
        projectileSpeed: (1.0 + ((base + 9) % 12) / 100).toFixed(2),
    };

    return { distance, accuracy, evade, aiLogs, pcg, aiParams };
}

/** ====== UI ====== */
function Pill({ children, tone = "neutral" }) {
    return <span className={`pill pill-${tone}`}>{children}</span>;
}

function StatCard({ label, value, sub }) {
    return (
        <div className="statCard">
            <div className="statLabel">{label}</div>
            <div className="statValue">{value}</div>
            {sub ? <div className="statSub">{sub}</div> : null}
        </div>
    );
}

let Demo = () => {
    const [round, setRound] = useState(4);
    const [query, setQuery] = useState("");
    const [compact, setCompact] = useState(false);

    const data = useMemo(() => makeDemo(round), [round]);

    const filteredLogs = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return data.aiLogs;
        return data.aiLogs.filter((l) => (l.tag + " " + l.msg).toLowerCase().includes(q));
    }, [data.aiLogs, query]);

    const totalDeaths = data.pcg.deaths.reduce((a, b) => a + b.count, 0) || 1;

    const bossPick = useMemo(() => {
        const acc = data.accuracy[data.accuracy.length - 1]; // 0~1
        const eva = data.evade[data.evade.length - 1];       // 0~1
        const dens = data.pcg.obstacleDensity;               // 0.xx

        if (dens > 0.38) {
            return {
                name: "Stone Golem",
                url: "/models/boss_golem.glb",
                reason: `장애물 밀도(${dens.toFixed(2)})가 높아서 지형 압박형 보스 확률 ↑`,
            };
        }
        if (acc > 0.55) {
            return {
                name: "Void Wraith",
                url: "/models/boss_wraith.glb",
                reason: `명중률(${(acc * 100).toFixed(0)}%)이 높아서 회피/은신형 보스 선택`,
            };
        }
        if (eva > 0.45) {
            return {
                name: "Hunter Stalker",
                url: "/models/boss_hunter.glb",
                reason: `회피 성향(${(eva * 100).toFixed(0)}%)이 높아서 추적/견제형 보스 선택`,
            };
        }
        return {
            name: "Default Brute",
            url: "/models/boss_hunter.glb",
            reason: "기본 난이도/행동 지표 → 표준 보스 선택",
        };
    }, [data]);

    return (
        <div className={`app ${compact ? "compact" : ""}`}>
            <header className="topbar">
                <div className="brand">
                    <div className="logo">AI</div>
                    <div>
                        <div className="title">인간 vs AI DashBoard</div>
                        <div className="subtitle">Player Behavior • AI Adaptation • PCG Stats</div>
                    </div>
                </div>

                <div className="controls">
                    <div className="control">
                        <label>Round</label>
                        <select value={round} onChange={(e) => setRound(Number(e.target.value))}>
                            {ROUNDS.map((r) => (
                                <option key={r} value={r}>
                                    Round {r}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="control grow">
                        <label>Search logs</label>
                        <input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="ex) aggression, hpScale, projectile..."
                        />
                    </div>

                    <button className="ghostBtn" onClick={() => setCompact((v) => !v)}>
                        {compact ? "Comfort" : "Compact"}
                    </button>
                </div>
            </header>

            <main className="grid">
                {/* Left: Player behavior */}
                <section className="panel">
                    <div className="panelHeader">
                        <h2>플레이어 행동 분석</h2>
                        <div className="mutedRow">
                            <Pill tone="neutral">Distance</Pill>
                            <Pill tone="neutral">Accuracy</Pill>
                            <Pill tone="neutral">Evasion</Pill>
                        </div>
                    </div>

                    <div className="panelBody">
                        <div className="chartBlock">
                            <div className="chartRow">
                                <div className="chartMeta">
                                    <div className="chartName">이동 거리</div>
                                    <div className="chartHint">최근 12 구간 (m)</div>
                                </div>
                                <div className="chartValue">
                                    {Math.round(data.distance[data.distance.length - 1])}m
                                </div>
                            </div>
                            <SparkLine data={data.distance} />
                        </div>

                        <div className="chartBlock">
                            <div className="chartRow">
                                <div className="chartMeta">
                                    <div className="chartName">명중률</div>
                                    <div className="chartHint">0~1</div>
                                </div>
                                <div className="chartValue">
                                    {(data.accuracy[data.accuracy.length - 1] * 100).toFixed(0)}%
                                </div>
                            </div>
                            <SparkLine data={data.accuracy.map((x) => x * 100)} />
                        </div>

                        <div className="chartBlock">
                            <div className="chartRow">
                                <div className="chartMeta">
                                    <div className="chartName">회피 성향</div>
                                    <div className="chartHint">0~1</div>
                                </div>
                                <div className="chartValue">
                                    {(data.evade[data.evade.length - 1] * 100).toFixed(0)}%
                                </div>
                            </div>
                            <SparkLine data={data.evade.map((x) => x * 100)} />
                        </div>

                        <div className="divider" />

                        <div className="stats3">
                            <StatCard label="Aggressiveness(추정)" value={data.aiParams.aggression} sub="행동 로그 기반" />
                            <StatCard label="Avg Clear Time" value={`${data.pcg.clearTimeSec}s`} sub="라운드 통계" />
                            <StatCard label="Obstacle Density" value={data.pcg.obstacleDensity.toFixed(2)} sub="PCG 요약" />
                        </div>
                    </div>
                </section>

                {/* Middle: AI adaptation logs */}
                <section className="panel">
                    <div className="panelHeader">
                        <h2>AI 난이도 / 정책 변화</h2>
                        <div className="mutedRow">
                            <Pill tone="ok">ok</Pill>
                            <Pill tone="warn">warn</Pill>
                            <Pill tone="info">info</Pill>
                        </div>
                    </div>

                    <div className="panelBody">
                        <div className="params">
                            <div className="param">
                                <span className="k">hpScale</span>
                                <span className="v">{data.aiParams.hpScale}</span>
                            </div>
                            <div className="param">
                                <span className="k">dmgScale</span>
                                <span className="v">{data.aiParams.dmgScale}</span>
                            </div>
                            <div className="param">
                                <span className="k">projectileSpeed</span>
                                <span className="v">{data.aiParams.projectileSpeed}</span>
                            </div>
                            <div className="param">
                                <span className="k">aggression</span>
                                <span className="v">{data.aiParams.aggression}</span>
                            </div>
                        </div>

                        <div className="divider" />

                        <div className="logList">
                            {filteredLogs.length === 0 ? (
                                <div className="empty">검색 결과 없음</div>
                            ) : (
                                filteredLogs.map((l) => (
                                    <div key={l.id} className={`logItem log-${l.severity}`}>
                                        <div className="logLeft">
                                            <div className="logTime">{l.t}</div>
                                            <div className="logTag">{l.tag}</div>
                                        </div>
                                        <div className="logMsg">{l.msg}</div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </section>

                {/* Right: PCG stats */}
                <section className="panel">
                    <div className="panelHeader">
                        <h2>PCG 스테이지 통계</h2>
                        <div className="mutedRow">
                            <Pill tone="neutral">Map</Pill>
                            <Pill tone="neutral">Wave</Pill>
                            <Pill tone="neutral">Death</Pill>
                        </div>
                    </div>

                    <div className="panelBody">
                        <div className="twoStats">
                            <StatCard label="Obstacle Density" value={data.pcg.obstacleDensity.toFixed(2)} sub="장애물 밀도" />
                            <StatCard label="Clear Time" value={`${data.pcg.clearTimeSec}s`} sub="클리어 시간" />
                        </div>

                        <div className="divider" />

                        <div className="sectionTitle">사망 원인 분포</div>
                        <div className="deathList">
                            {data.pcg.deaths.map((d) => {
                                const ratio = d.count / totalDeaths;
                                return (
                                    <div className="deathRow" key={d.reason}>
                                        <div className="deathLabel">
                                            <span className="reason">{d.reason}</span>
                                            <span className="count">{d.count}</span>
                                        </div>
                                        <MiniBar value01={ratio} />
                                    </div>
                                );
                            })}
                        </div>

                        <div className="divider" />

                        <BossPreview
                            bossName={bossPick.name}
                            bossUrl={bossPick.url}
                            reason={bossPick.reason}
                        />

                    </div>
                </section>
            </main>

            <footer className="footer">
                Demo only • React UI (no server) • {new Date().toLocaleDateString("ko-KR")}
            </footer>
        </div>
    );
}

export default Demo;