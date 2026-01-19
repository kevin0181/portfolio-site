import React, { useMemo, useState } from "react";
import "./demo.css";

const defaultFeature = {
    player_id: 1,
    avg_attack_interval: 0.5,
    avg_move_speed: 2.0,
    aggressiveness: 0.7,
    risk_taking: 0.3,
    damage_taken: 100,
    damage_given: 180
};

const clamp01 = (x) => Math.max(0, Math.min(1, x));
const toNum = (v, fallback = 0) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : fallback;
};

function safeJsonParse(text) {
    try {
        const obj = JSON.parse(text);
        return { ok: true, obj, error: null };
    } catch (e) {
        return { ok: false, obj: null, error: e?.message ?? "Invalid JSON" };
    }
}

function simulateRL(feature) {
    const atkFast = clamp01((1.2 - toNum(feature.avg_attack_interval, 0.8)) / 1.0);
    const moveFast = clamp01((toNum(feature.avg_move_speed, 2.0) - 1.0) / 3.0);
    const aggro = clamp01(toNum(feature.aggressiveness, 0.5));
    const risk = clamp01(toNum(feature.risk_taking, 0.5));

    const dmgGiven = Math.max(0, toNum(feature.damage_given, 0));
    const dmgTaken = Math.max(0, toNum(feature.damage_taken, 0));
    const dpsDominant = clamp01((dmgGiven - dmgTaken + 200) / 400);

    const aggression_level = clamp01(
        0.25 * aggro + 0.20 * atkFast + 0.20 * dpsDominant + 0.15 * risk + 0.20 * moveFast
    );

    const attack_interval_scale = 1.15 - 0.5 * aggression_level;
    const move_speed_scale = 0.95 + 0.35 * moveFast;

    let w_slam = 0.30 + 0.25 * aggro + 0.15 * dpsDominant;
    let w_dash = 0.20 + 0.35 * moveFast;
    let w_summon = 0.20 + 0.25 * (1 - risk) + 0.10 * clamp01(dmgTaken / 300);
    let w_zone = 0.30 + 0.20 * aggression_level;

    const sum = w_slam + w_dash + w_summon + w_zone;
    w_slam /= sum;
    w_dash /= sum;
    w_summon /= sum;
    w_zone /= sum;

    const reward_proxy =
        0.4 * dpsDominant +
        0.2 * aggro +
        0.2 * atkFast +
        0.2 * moveFast -
        0.15 * clamp01(dmgTaken / 400);

    return {
        status: "ok",
        model: "demo-rl-simulator-v1",
        input_feature: feature,
        output: {
            ai_profile: {
                aggression_level: Number(aggression_level.toFixed(3)),
                attack_interval_scale: Number(attack_interval_scale.toFixed(3)),
                move_speed_scale: Number(move_speed_scale.toFixed(3)),
                pattern_weights: {
                    pattern_slam: Number(w_slam.toFixed(3)),
                    pattern_dash: Number(w_dash.toFixed(3)),
                    pattern_summon: Number(w_summon.toFixed(3)),
                    pattern_zone_control: Number(w_zone.toFixed(3))
                }
            },
            diagnostics: {
                atkFast: Number(atkFast.toFixed(3)),
                moveFast: Number(moveFast.toFixed(3)),
                dpsDominant: Number(dpsDominant.toFixed(3)),
                reward_proxy: Number(reward_proxy.toFixed(3))
            }
        }
    };
}

function MiniBar({ label, value }) {
    const v = clamp01(Number(value) || 0);
    return (
        <div className="deathRow" style={{ gap: 8 }}>
            <div className="deathLabel">
                <span className="reason">{label}</span>
                <span className="count">{Math.round(v * 100)}%</span>
            </div>
            <div className="miniBar">
                <div className="miniBarFill" style={{ width: `${v * 100}%` }} />
            </div>
        </div>
    );
}

export default function DemoRL() {
    const [bodyText, setBodyText] = useState(JSON.stringify(defaultFeature, null, 2));
    const [loading, setLoading] = useState(false);
    const [errorText, setErrorText] = useState("");
    const [responseObj, setResponseObj] = useState(null);

    const parsed = useMemo(() => safeJsonParse(bodyText), [bodyText]);
    const ai = responseObj?.output?.ai_profile;

    const execute = async () => {
        setErrorText("");
        setResponseObj(null);

        if (!parsed.ok) {
            setErrorText(`JSON 파싱 오류: ${parsed.error}`);
            return;
        }

        setLoading(true);
        await new Promise((r) => setTimeout(r, 700));

        try {
            const res = simulateRL(parsed.obj);
            setResponseObj(res);
        } catch (e) {
            setErrorText(`시뮬레이션 실패: ${e?.message ?? e}`);
        } finally {
            setLoading(false);
        }
    };

    const setPreset = (type) => {
        if (type === "aggressive") {
            setBodyText(
                JSON.stringify(
                    {
                        player_id: 2,
                        avg_attack_interval: 0.35,
                        avg_move_speed: 2.4,
                        aggressiveness: 0.9,
                        risk_taking: 0.7,
                        damage_taken: 80,
                        damage_given: 260
                    },
                    null,
                    2
                )
            );
        } else if (type === "evasive") {
            setBodyText(
                JSON.stringify(
                    {
                        player_id: 3,
                        avg_attack_interval: 0.9,
                        avg_move_speed: 3.6,
                        aggressiveness: 0.35,
                        risk_taking: 0.25,
                        damage_taken: 60,
                        damage_given: 120
                    },
                    null,
                    2
                )
            );
        } else {
            setBodyText(JSON.stringify(defaultFeature, null, 2));
        }
    };

    return (
        <div className="app">
            {/* TOP BAR */}
            <div className="topbar">
                <div className="brand">
                    <div className="logo">RL</div>
                    <div>
                        <div className="title">RE:ADAPT (RL Demo)</div>
                        <div className="subtitle">“Feature → RL 결과 → 보스 파라미터” </div>
                    </div>
                </div>

                <div className="controls">
                    <button className="ghostBtn" onClick={() => setPreset("default")}>
                        기본
                    </button>
                    <button className="ghostBtn" onClick={() => setPreset("aggressive")}>
                        공격형
                    </button>
                    <button className="ghostBtn" onClick={() => setPreset("evasive")}>
                        회피형
                    </button>
                    <button className="ghostBtn" onClick={execute} disabled={loading}>
                        {loading ? "Training..." : "Execute (Simulate RL)"}
                    </button>
                </div>
            </div>

            {/* 2 COLUMNS */}
            <div className="grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
                {/* REQUEST */}
                <div className="panel">
                    <div className="panelHeader">
                        <h2>Request JSON (Feature)</h2>
                        <div className="mutedRow">
              <span className={`pill ${parsed.ok ? "pill-ok" : "pill-warn"}`}>
                {parsed.ok ? "valid" : "invalid"}
              </span>
                        </div>
                    </div>

                    <div className="panelBody">
            <textarea
                value={bodyText}
                onChange={(e) => setBodyText(e.target.value)}
                spellCheck={false}
                style={{
                    width: "100%",
                    flex: 1,
                    minHeight: 420,
                    resize: "none",
                    fontFamily:
                        'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace',
                    fontSize: 12,
                    lineHeight: 1.4
                }}
            />
                        {errorText && (
                            <div className="hintCard" style={{ boxShadow: "inset 0 0 0 999px rgba(255,0,0,0.06)" }}>
                                <div className="hintTitle">Error</div>
                                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.86)", whiteSpace: "pre-wrap" }}>
                                    {errorText}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* RESPONSE */}
                <div className="panel">
                    <div className="panelHeader">
                        <h2>Response (Boss AI Params)</h2>
                        <div className="mutedRow">
              <span className={`pill ${responseObj ? "pill-info" : ""}`}>
                {responseObj ? responseObj.model : "no response"}
              </span>
                        </div>
                    </div>

                    <div className="panelBody">
                        <div className="hintCard">
                            <div className="hintTitle">Core Params</div>
                            <div className="deathList">
                                <MiniBar label="aggression_level" value={ai?.aggression_level ?? 0} />
                                <MiniBar label="pattern_slam" value={ai?.pattern_weights?.pattern_slam ?? 0} />
                                <MiniBar label="pattern_dash" value={ai?.pattern_weights?.pattern_dash ?? 0} />
                                <MiniBar label="pattern_summon" value={ai?.pattern_weights?.pattern_summon ?? 0} />
                                <MiniBar label="pattern_zone_control" value={ai?.pattern_weights?.pattern_zone_control ?? 0} />
                            </div>
                        </div>

                        <div className="divider" />

                        <div className="hintCard" style={{ flex: 1, overflow: "hidden" }}>
                            <div className="hintTitle">Raw JSON</div>
                            <pre style={{ margin: 0, height: "100%", overflow: "auto", padding: 10 }}>
                {responseObj ? JSON.stringify(responseObj, null, 2) : "(no response yet)"}
              </pre>
                        </div>
                    </div>
                </div>
            </div>

            <div className="footer">
                발표 멘트: “simulateRL() 자리에 실제로는 학습된 RL 정책(모델)이 들어가 보스 파라미터를 출력합니다.”
            </div>
        </div>
    );
}
