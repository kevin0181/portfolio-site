const stagePackage = {
        "schema_version": "1.0",
        "stage_id": "STG-2025-12-21-0007",
        "run_id": "RUN-9c2c8b5e",
        "round_index": 7,
        "difficulty_tier": "HARD",
        "seed": 1938475123,

        "meta": {
            "generated_by": "pcg_llm_server",
            "generated_at": "2025-12-21T17:00:00+09:00",
            "theme": "Abandoned Subway",
            "biome": "URBAN",
            "music_tag": "tense_subway",
            "notes": "좁은 통로 + 시야 제한 룰로 압박감 강화"
        },

        "map": {
            "type": "grid",
            "grid": { "width": 18, "height": 18, "cell_size": 400 },
            "layout": {
                "generator": "drunk_walk",
                "params": {
                    "walkers": 2,
                    "steps": 180,
                    "carve_width": 2,
                    "min_rooms": 4
                }
            },

            "spawn_points": {
                "player_start": { "x": 2, "y": 2 },
                "enemy_spawns": [
                    { "id": "S1", "x": 15, "y": 3 },
                    { "id": "S2", "x": 16, "y": 14 },
                    { "id": "S3", "x": 6, "y": 16 }
                ],
                "boss_spawn": { "x": 9, "y": 9 }
            },

            "poi": [
                {
                    "id": "POI_HEAL_1",
                    "type": "healing_station",
                    "pos": { "x": 5, "y": 5 },
                    "params": { "heal_percent": 25, "cooldown_sec": 30 }
                },
                {
                    "id": "POI_SHOP_1",
                    "type": "shop",
                    "pos": { "x": 14, "y": 14 },
                    "params": { "reroll_cost": 25, "item_pool": "urban_shop_pool_v2" }
                }
            ],

            "obstacles": [
                {
                    "id": "OBS_001",
                    "type": "cover_crate",
                    "pos": { "x": 10, "y": 6 },
                    "rotation_yaw": 90,
                    "scale": 1.0
                },
                {
                    "id": "OBS_002",
                    "type": "pillar",
                    "pos": { "x": 8, "y": 10 },
                    "rotation_yaw": 0,
                    "scale": 1.2
                }
            ]
        },

        "rules": [
            {
                "id": "RULE_FOG_OF_WAR",
                "name": "Fog of War",
                "params": { "vision_radius": 1200, "soft_edge": true }
            },
            {
                "id": "RULE_LOW_GRAVITY",
                "name": "Low Gravity",
                "params": { "gravity_scale": 0.85, "air_control_bonus": 0.15 }
            },
            {
                "id": "RULE_DOUBLE_ELITE_CHANCE",
                "name": "Double Elite Chance",
                "params": { "elite_chance_multiplier": 2.0 }
            }
        ],

        "waves": [
            {
                "wave_index": 1,
                "time_limit_sec": 60,
                "spawn": [
                    {
                        "from_spawn_id": "S1",
                        "enemy": "ENEMY_MELEE_GRUNT",
                        "count": 8,
                        "interval_sec": 1.0,
                        "elite_chance": 0.05
                    },
                    {
                        "from_spawn_id": "S2",
                        "enemy": "ENEMY_RANGED_GRUNT",
                        "count": 6,
                        "interval_sec": 1.4,
                        "elite_chance": 0.08
                    }
                ],
                "clear_condition": { "type": "kill_all" }
            },
            {
                "wave_index": 2,
                "time_limit_sec": 75,
                "spawn": [
                    {
                        "from_spawn_id": "S3",
                        "enemy": "ENEMY_DASHER",
                        "count": 7,
                        "interval_sec": 1.2,
                        "elite_chance": 0.10,
                        "modifiers": ["MOD_FAST", "MOD_GLASS_CANNON"]
                    },
                    {
                        "from_spawn_id": "S1",
                        "enemy": "ENEMY_TANK",
                        "count": 3,
                        "interval_sec": 6.0,
                        "elite_chance": 0.12
                    }
                ],
                "clear_condition": { "type": "survive", "seconds": 70 }
            }
        ],

        "boss": {
            "enabled": true,
            "boss_id": "BOSS_SUBWAY_WARDEN",
            "spawn_at": { "after_wave_index": 2 },
            "ai_profile": {
                "aggression_level": 0.72,
                "attack_interval_scale": 0.90,
                "pattern_weights": {
                    "pattern_slam": 0.35,
                    "pattern_dash": 0.25,
                    "pattern_summon": 0.20,
                    "pattern_zone_control": 0.20
                }
            },
            "loot": {
                "drop_table": "boss_rare_table_v1",
                "guaranteed": [
                    { "type": "augment_choice", "count": 1 },
                    { "type": "currency", "amount": 120 }
                ]
            }
        },

        "augments": {
            "offered": [
                {
                    "augment_id": "AUG_CHAIN_LIGHTNING",
                    "rarity": "RARE",
                    "title": "Chain Lightning",
                    "desc": "적중 시 근처 적에게 연쇄 번개가 튄다.",
                    "params": { "chains": 3, "damage_ratio": 0.45, "cooldown_sec": 2.5 }
                },
                {
                    "augment_id": "AUG_ARMOR_PLATING",
                    "rarity": "UNCOMMON",
                    "title": "Armor Plating",
                    "desc": "받는 피해가 감소하지만 이동 속도가 소폭 감소한다.",
                    "params": { "damage_taken_mul": 0.88, "move_speed_mul": 0.95 }
                },
                {
                    "augment_id": "AUG_BLOOD_FOR_POWER",
                    "rarity": "EPIC",
                    "title": "Blood for Power",
                    "desc": "체력이 낮을수록 공격력이 증가한다.",
                    "params": { "max_bonus": 0.35, "curve": "quadratic" }
                }
            ],
            "selection_rules": {
                "pick_count": 1,
                "reroll_count": 1,
                "ban_duplicates": true
            }
        },

        "telemetry": {
            "expected_events": [
                "stage_start",
                "wave_start",
                "enemy_spawn",
                "damage_taken",
                "damage_dealt",
                "augment_offered",
                "augment_picked",
                "boss_spawn",
                "stage_clear",
                "stage_fail"
            ],
            "client_log_level": "INFO"
        },

        "integrity": {
            "hash_algo": "sha256",
            "payload_hash": "PLACEHOLDER_SHA256_OF_STAGE_PACKAGE_BODY"
        }
    }
;

const DemoJson = () => {
    return (
        <pre style={{
            background: "#0f172a",
            color: "#e5e7eb",
            padding: "16px",
            borderRadius: "8px",
            fontSize: "13px",
            overflowX: "auto"
        }}>
      {JSON.stringify(stagePackage, null, 2)}
    </pre>
    );
};

export default DemoJson;
