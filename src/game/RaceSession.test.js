import RaceSession from "./RaceSession";
import { TRACK_LENGTH } from "./Circuit";

const wrapped = (distance) => ((distance % TRACK_LENGTH) + TRACK_LENGTH) % TRACK_LENGTH;

function singleRace(startDistance = 0) {
    const race = new RaceSession({ competitors: [{ id: "player", name: "YOU" }] });
    const runner = { id: "player", distance: startDistance, speed: 72, onTrack: true };
    race.start([runner]);
    race.update(4, [runner]);
    const drive = (distance, { onTrack = true } = {}) => {
        let remaining = Math.abs(distance);
        const direction = Math.sign(distance);
        while (remaining > 1e-7) {
            const step = Math.min(2, remaining);
            runner.distance = wrapped(runner.distance + direction * step);
            runner.onTrack = onTrack;
            race.update(step / 20, [runner]);
            remaining -= step;
        }
        return race.snapshot();
    };
    return { race, runner, drive };
}

test("starts with a four-second countdown and ignores countdown movement", () => {
    const race = new RaceSession();
    const samples = [{ id: "player", distance: 2, speed: 0, onTrack: true }];
    expect(race.snapshot().phase).toBe("free");
    expect(race.start(samples).countdown).toBe(4);
    expect(race.update(1, samples).countdown).toBe(3);
    expect(race.update(2, samples).countdown).toBe(1);
    samples[0].distance = 3;
    const started = race.update(1, samples);
    expect(started.phase).toBe("racing");
    expect(started.countdown).toBe(0);
    expect(started.elapsed).toBe(0);
    expect(started.lap).toBe(1);
    expect(started.results.find(({ id }) => id === "player").progress).toBe(0);
});

test("requires three complete ordered circuits from the starting grid", () => {
    // Starting just after the shared line must not grant a lap on the first wrap.
    const { race, drive } = singleRace(2);
    expect(drive(TRACK_LENGTH - 1).lap).toBe(1);
    let state = drive(1.5);
    expect(state.lap).toBe(2);
    expect(state.finished).toBe(false);
    expect(state.lastLap).toBeGreaterThan(0);

    state = drive(TRACK_LENGTH);
    expect(state.lap).toBe(3);
    expect(state.finished).toBe(false);
    state = drive(TRACK_LENGTH);
    expect(state.phase).toBe("finished");
    expect(state.finished).toBe(true);
    expect(state.lap).toBe(3);
    expect(state.bestLap).toBeGreaterThan(0);
    expect(state.bestLap).toBeLessThanOrEqual(state.lastLap);
    expect(state.results[0].time).toBeCloseTo(state.elapsed, 6);
    const finished = race.snapshot();
    expect(race.update(20, [])).toEqual(finished);
});

test("reverse travel loses position and cannot farm laps by recrossing the line", () => {
    const { race, drive } = singleRace();
    drive(TRACK_LENGTH * 0.65);
    const leadingProgress = race.snapshot().results[0].progress;
    const reversed = drive(-TRACK_LENGTH * 0.4);
    expect(reversed.results[0].progress).toBeLessThan(leadingProgress);
    expect(reversed.lap).toBe(1);
    drive(TRACK_LENGTH * 0.4);
    expect(race.snapshot().lap).toBe(1);
    drive(TRACK_LENGTH * 0.36);
    expect(race.snapshot().lap).toBe(2);

    for (let crossing = 0; crossing < 4; crossing += 1) {
        drive(-4);
        drive(4);
    }
    expect(race.snapshot().lap).toBe(2);
    expect(race.snapshot().finished).toBe(false);
});

test("off-track shortcuts and teleports cannot advance the race", () => {
    const { race, runner, drive } = singleRace();
    drive(TRACK_LENGTH * 0.45);
    drive(TRACK_LENGTH * 0.3, { onTrack: false });
    const afterShortcut = drive(TRACK_LENGTH * 0.3);
    expect(afterShortcut.lap).toBe(1);
    expect(afterShortcut.finished).toBe(false);

    // A sudden projected half-course jump at ordinary speed invalidates this attempt.
    runner.distance = wrapped(runner.distance + TRACK_LENGTH * 0.45);
    race.update(1 / 60, [runner]);
    expect(race.snapshot().results[0].progress).toBeLessThan(1);
    expect(drive(TRACK_LENGTH * 0.6).lap).toBe(1);
    expect(drive(TRACK_LENGTH * 0.41).lap).toBe(2);
});

test("ranks all cars by track progress and preserves actual finishing order", () => {
    const race = new RaceSession({ laps: 1 });
    const speeds = { player: 20, "ai-1": 24, "ai-2": 18, "ai-3": 16 };
    const samples = Object.keys(speeds).map((id, index) => ({
        id, distance: wrapped(2 - index * 3), speed: speeds[id] * 3.6, onTrack: true,
    }));
    race.start(samples);
    race.update(4, samples);
    let state;
    for (let frame = 0; frame < 500; frame += 1) {
        samples.forEach((sample) => { sample.distance = wrapped(sample.distance + speeds[sample.id] * 0.05); });
        state = race.update(0.05, samples);
        if (state.finished) break;
    }
    expect(state.phase).toBe("finished");
    expect(state.position).toBe(2);
    expect(state.results[0].id).toBe("ai-1");
    expect(state.results[0].finished).toBe(true);
    expect(state.results[1].id).toBe("player");
    expect(state.results[1].finished).toBe(true);
    expect(state.results[0].time).toBeLessThan(state.results[1].time);
    expect(state.results[2].finished).toBe(false);
    expect(state.results.map(({ position }) => position)).toEqual([1, 2, 3, 4]);
});

test("grid spacing counts toward position before an opponent physically passes", () => {
    const race = new RaceSession({ competitors: [{ id: "player" }, { id: "ai-1" }] });
    const samples = [{ id: "player", distance: 0, speed: 0, onTrack: true }, { id: "ai-1", distance: wrapped(-5), speed: 36, onTrack: true }];
    race.start(samples);
    race.update(4, samples);
    samples[1].distance = wrapped(-4);
    expect(race.update(.1, samples).position).toBe(1);
    for (let distance = -3; distance <= 1; distance += 1) {
        samples[1].distance = wrapped(distance);
        race.update(.1, samples);
    }
    expect(race.snapshot().position).toBe(2);
});

test("reset returns to free driving and restart clears previous results", () => {
    const { race, runner, drive } = singleRace();
    drive(TRACK_LENGTH * 1.1);
    expect(race.snapshot().lastLap).toBeGreaterThan(0);
    const reset = race.reset();
    expect(reset.phase).toBe("free");
    expect(reset.lap).toBe(1);
    expect(reset.elapsed).toBe(0);
    expect(reset.lastLap).toBeNull();
    expect(reset.bestLap).toBeNull();
    expect(reset.results[0].progress).toBe(0);
    expect(race.update(1, [runner])).toEqual(reset);
    const restarted = race.start([runner]);
    expect(restarted.phase).toBe("countdown");
    expect(restarted.countdown).toBe(4);
    expect(restarted.results[0].time).toBeNull();
    expect(restarted.finished).toBe(false);
});
