import { TRACK_LENGTH } from "./Circuit";

const DEFAULT_COMPETITORS = [
    { id: "player", name: "YOU" },
    { id: "ai-1", name: "MINT" },
    { id: "ai-2", name: "CORAL" },
    { id: "ai-3", name: "LILAC" },
];
const SECTORS = 8;
const wrap = (distance) => ((distance % TRACK_LENGTH) + TRACK_LENGTH) % TRACK_LENGTH;
const duration = (value) => Number.isFinite(value) && value > 0 ? value : 0;

export default class RaceSession {
    constructor({ laps = 3, competitors = DEFAULT_COMPETITORS } = {}) {
        this.totalLaps = Math.max(1, Math.floor(laps) || 3);
        const seen = new Set();
        this.competitors = competitors.filter(({ id }) => id && !seen.has(id) && seen.add(id))
            .map(({ id, name }) => ({ id, name: name || id }));
        if (!this.competitors.length) this.competitors = DEFAULT_COMPETITORS.map((item) => ({ ...item }));
        this.playerId = this.competitors.some(({ id }) => id === "player") ? "player" : this.competitors[0].id;
        this.reset();
    }

    reset() {
        this.phase = "free";
        this.remaining = 0;
        this.elapsed = 0;
        this.racers = this.competitors.map((competitor, index) => ({
            ...competitor, order: index, distance: null, speed: 0, completed: 0,
            lapDistance: 0, sector: 0, lapStarted: 0, lastLap: null, bestLap: null, finishTime: null,
        }));
        return this.snapshot();
    }

    start(samples = []) {
        this.reset();
        this.phase = "countdown";
        this.remaining = 4;
        this._seed(samples);
        return this.snapshot();
    }

    _seed(samples) {
        const byId = new Map(samples.map((sample) => [sample.id, sample]));
        const start = byId.get(this.playerId)?.distance;
        this.racers.forEach((racer) => {
            const sample = byId.get(racer.id);
            if (sample && Number.isFinite(sample.distance)) {
                racer.distance = wrap(sample.distance);
                // A car behind the grid leader must actually pass it to gain a position.
                // All cars finish their laps at the same projected start/finish point.
                racer.lapDistance = racer.id !== this.playerId && Number.isFinite(start) ? wrap(sample.distance - start + TRACK_LENGTH / 2) - TRACK_LENGTH / 2 : 0;
            }
            racer.speed = Math.max(0, Number.isFinite(sample?.speed) ? sample.speed : 0);
        });
    }

    update(dt, samples = []) {
        let elapsed = duration(dt);
        if (!elapsed || this.phase === "free" || this.phase === "finished") return this.snapshot();

        if (this.phase === "countdown") {
            this._seed(samples);
            const counting = Math.min(elapsed, this.remaining);
            this.remaining -= counting;
            elapsed -= counting;
            if (this.remaining > 0) return this.snapshot();
            this.phase = "racing";
            if (!elapsed) return this.snapshot();
        }

        const previousElapsed = this.elapsed;
        this.elapsed += elapsed;
        const byId = new Map(samples.map((sample) => [sample.id, sample]));
        this.racers.forEach((racer) => {
            const sample = byId.get(racer.id);
            if (racer.finishTime !== null || !sample) return;
            if (!Number.isFinite(sample.distance)) {
                this._invalidateLap(racer);
                racer.distance = null;
                return;
            }
            const distance = wrap(sample.distance);
            const speed = Math.max(0, Number.isFinite(sample.speed) ? sample.speed : 0);
            if (racer.distance === null) {
                racer.distance = distance;
                racer.speed = speed;
                return;
            }

            let delta = distance - racer.distance;
            if (delta > TRACK_LENGTH / 2) delta -= TRACK_LENGTH;
            if (delta < -TRACK_LENGTH / 2) delta += TRACK_LENGTH;
            // Samples use km/h, matching the physics status. Reject position jumps rather than
            // turning a teleport into track progress. Re-entry must complete a fresh clean lap.
            const plausibleDistance = Math.min(Math.max(speed, racer.speed), 300) / 3.6 * elapsed * 2 + 1.5;
            racer.distance = distance;
            racer.speed = speed;
            if (sample.onTrack !== true || Math.abs(delta) > plausibleDistance) {
                this._invalidateLap(racer);
                return;
            }

            const previousDistance = racer.lapDistance;
            racer.lapDistance += delta;
            const sectorLength = TRACK_LENGTH / SECTORS;
            // Reverse travel removes progress, including previously reached sectors.
            racer.sector = Math.max(0, Math.min(SECTORS, Math.floor((racer.lapDistance + 1e-7) / sectorLength)));
            if (racer.lapDistance + 1e-7 < TRACK_LENGTH || racer.sector < SECTORS) return;

            const fraction = delta > 0 ? Math.max(0, Math.min(1, (TRACK_LENGTH - previousDistance) / delta)) : 1;
            const crossedAt = previousElapsed + elapsed * fraction;
            const lapTime = crossedAt - racer.lapStarted;
            racer.completed += 1;
            racer.lastLap = lapTime;
            racer.bestLap = racer.bestLap === null ? lapTime : Math.min(racer.bestLap, lapTime);
            racer.lapStarted = crossedAt;
            racer.lapDistance = Math.max(0, racer.lapDistance - TRACK_LENGTH);
            racer.sector = 0;
            if (racer.completed >= this.totalLaps) {
                racer.lapDistance = 0;
                racer.finishTime = crossedAt;
            }
        });

        const player = this.racers.find(({ id }) => id === this.playerId);
        if (player.finishTime !== null) {
            this.phase = "finished";
            this.elapsed = player.finishTime;
        }
        return this.snapshot();
    }

    _invalidateLap(racer) {
        racer.lapDistance = Math.min(0, racer.lapDistance);
        racer.sector = 0;
        // Keep elapsed lap time: leaving the course never improves the lap record.
    }

    snapshot() {
        const ordered = [...this.racers].sort((a, b) => {
            if (a.finishTime !== null && b.finishTime !== null) return a.finishTime - b.finishTime || a.order - b.order;
            if (a.finishTime !== null) return -1;
            if (b.finishTime !== null) return 1;
            return (b.completed * TRACK_LENGTH + b.lapDistance) - (a.completed * TRACK_LENGTH + a.lapDistance) || a.order - b.order;
        });
        const results = ordered.map((racer, index) => ({
            id: racer.id, name: racer.name, position: index + 1,
            lap: Math.min(this.totalLaps, racer.completed + 1), finished: racer.finishTime !== null,
            time: racer.finishTime, progress: racer.completed * TRACK_LENGTH + racer.lapDistance,
        }));
        const player = this.racers.find(({ id }) => id === this.playerId);
        return {
            phase: this.phase, countdown: this.phase === "countdown" ? Math.ceil(this.remaining) : 0,
            elapsed: this.elapsed, position: results.find(({ id }) => id === this.playerId).position,
            lap: Math.min(this.totalLaps, player.completed + 1), totalLaps: this.totalLaps,
            finished: player.finishTime !== null, results, lastLap: player.lastLap, bestLap: player.bestLap,
        };
    }
}

export { RaceSession };
