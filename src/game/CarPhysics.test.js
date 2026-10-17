import { Vec3 } from "cannon-es";
import CarPhysics from "./CarPhysics";
import { TRACK_LENGTH } from "./Circuit";
import RaceSession from "./RaceSession";

const STEP = 1 / 60;
const simulations = [];

function createSimulation() {
    const physics = new CarPhysics();
    simulations.push(physics);
    return physics;
}

function advance(physics, seconds, input = {}, options, observe) {
    for (let frame = 0; frame < Math.round(seconds / STEP); frame += 1) {
        physics.step(STEP, input, options);
        observe?.();
    }
}

function upright(body) {
    return body.quaternion.vmult(new Vec3(0, 1, 0)).y;
}

function finiteTransform({ position, quaternion }) {
    return [position.x, position.y, position.z, quaternion.x, quaternion.y, quaternion.z, quaternion.w]
        .every(Number.isFinite);
}

function expectFiniteVehicles(physics) {
    for (const car of physics.vehicles) {
        expect(finiteTransform(car.chassis)).toBe(true);
        expect(car.vehicle.wheelInfos.every(({ worldTransform }) => finiteTransform(worldTransform))).toBe(true);
    }
}

afterEach(() => {
    simulations.splice(0).forEach((physics) => physics.dispose());
    jest.restoreAllMocks();
});

test("all four stationary cars settle upright on their wheels", () => {
    const physics = createSimulation();
    expect(physics.vehicles).toHaveLength(4);
    advance(physics, 2, {}, { locked: true });

    for (const car of physics.vehicles) {
        expect(car.grounded).toBe(true);
        expect(upright(car.chassis)).toBeGreaterThan(0.95);
        expect(car.chassis.position.y).toBeGreaterThan(0.3);
        expect(car.chassis.position.y).toBeLessThan(0.8);
        expect(car.chassis.velocity.length()).toBeLessThan(0.5);
    }
    expectFiniteVehicles(physics);
});

test("throttle moves along the physical forward axis and left steering bends the path", () => {
    const physics = createSimulation();
    advance(physics, 2, {}, { locked: true });
    const start = physics.chassis.position.clone();
    const forward = physics.chassis.quaternion.vmult(new Vec3(0, 0, -1));

    advance(physics, 1, { throttle: 1 });

    const displacement = physics.chassis.position.vsub(start);
    expect(displacement.dot(forward)).toBeGreaterThan(1);
    expect(Math.abs(displacement.x)).toBeLessThan(0.25);
    const turnStart = physics.chassis.position.clone();
    advance(physics, 0.8, { throttle: 1, steer: 1 });

    const turnedForward = physics.chassis.quaternion.vmult(new Vec3(0, 0, -1));
    expect(physics.chassis.position.x).toBeLessThan(turnStart.x - 0.5);
    expect(turnedForward.x).toBeLessThan(-0.2);
    expect(physics.status().signedSpeed).toBeGreaterThan(3);
    expect(upright(physics.chassis)).toBeGreaterThan(0.8);
    expectFiniteVehicles(physics);
});

test("reverse input brakes forward motion before backing the car up", () => {
    const physics = createSimulation();
    advance(physics, 2, {}, { locked: true });
    advance(physics, 1, { throttle: 1 });
    const forwardSpeed = physics.status().signedSpeed;
    expect(forwardSpeed).toBeGreaterThan(10);

    advance(physics, 0.2, { throttle: -1 });
    expect(physics.status().signedSpeed).toBeLessThan(forwardSpeed * 0.75);
    const brakingPosition = physics.chassis.position.clone();
    advance(physics, 1.8, { throttle: -1 });

    expect(physics.status().signedSpeed).toBeLessThan(-3);
    expect(physics.chassis.position.z).toBeGreaterThan(brakingPosition.z + 1);
    expect(upright(physics.chassis)).toBeGreaterThan(0.8);
    expectFiniteVehicles(physics);
});

test("each AI completes a real circuit and passes a stopped player without teleporting", () => {
    const physics = createSimulation();
    physics.reset("race");
    advance(physics, 2, {}, { locked: true });
    const teleport = jest.spyOn(physics, "placeCar");
    const previous = new Map(physics.samples().map(({ id, distance }) => [id, distance]));
    const progress = new Map(physics.vehicles.slice(1).map(({ id }) => [id, 0]));
    let maximumSampleJump = 0;
    let invalidTransform = false;

    advance(physics, 60, { brake: true }, undefined, () => {
        physics.samples().forEach(({ id, distance }) => {
            if (!progress.has(id)) return;
            let delta = distance - previous.get(id);
            if (delta > TRACK_LENGTH / 2) delta -= TRACK_LENGTH;
            if (delta < -TRACK_LENGTH / 2) delta += TRACK_LENGTH;
            progress.set(id, progress.get(id) + delta);
            maximumSampleJump = Math.max(maximumSampleJump, Math.abs(delta));
            previous.set(id, distance);
        });
        if (physics.vehicles.some(({ chassis }) => !finiteTransform(chassis))) invalidTransform = true;
    });

    expect(invalidTransform).toBe(false);
    expect(maximumSampleJump).toBeLessThan(1.5);
    expect(teleport.mock.calls.length).toBe(0);
    for (const [id, distance] of progress) {
        // Include the car ID in a failure without requiring an exact lap time or racing line.
        expect({ id, completedCircuit: distance >= TRACK_LENGTH }).toEqual({ id, completedCircuit: true });
    }
    expectFiniteVehicles(physics);
});

test("cars exchange a real collision impulse in their shared physics world", () => {
    const physics = createSimulation();
    const opponent = physics.vehicles[1];
    // Isolate the impact on the opening straight; neither body is moved once simulation begins.
    physics.placeCar(physics.player, 15, 1.25);
    physics.placeCar(opponent, 21, 1.25);
    jest.spyOn(physics, "aiInput").mockReturnValue({ throttle: 0, brake: true });
    advance(physics, 2, {}, { locked: true });
    const opponentStart = opponent.chassis.position.clone();
    let touchedOpponent = false;
    const onCollide = ({ body }) => { if (body === opponent.chassis) touchedOpponent = true; };
    physics.chassis.addEventListener("collide", onCollide);

    advance(physics, 2, { throttle: 1 });
    physics.chassis.removeEventListener("collide", onCollide);

    expect(touchedOpponent).toBe(true);
    expect(physics.status().collisions).toBeGreaterThan(0);
    expect(opponent.chassis.position.distanceTo(opponentStart)).toBeGreaterThan(0.3);
    expectFiniteVehicles(physics);
});

test("a physical three-lap race reaches the chequered flag with consistent results", () => {
    const physics = createSimulation();
    physics.reset("race");
    const race = new RaceSession();
    race.start(physics.samples());
    const teleport = jest.spyOn(physics, "placeCar");
    for (let frame = 0; frame < 120 * 60 && race.phase !== "finished"; frame += 1) {
        physics.step(STEP, physics.aiInput(physics.player), { locked: race.phase === "countdown" });
        race.update(STEP, physics.samples());
    }
    const result = race.snapshot();
    expect(teleport.mock.calls.length).toBe(0);
    expect(result.phase).toBe("finished");
    expect(result.lap).toBe(3);
    expect(result.elapsed).toBeGreaterThan(20);
    expect(result.results).toHaveLength(4);
    expect(result.results.find(({ id }) => id === "player").finished).toBe(true);
    expect(result.bestLap).toBeGreaterThan(5);
    expectFiniteVehicles(physics);
});

test("reset and recovery restore stance, and disposal removes every body", () => {
    const physics = createSimulation();
    advance(physics, 2, {}, { locked: true });
    advance(physics, 1, { throttle: 1, steer: 1 });
    expect(physics.status().speed).toBeGreaterThan(2);

    physics.reset("race");
    expect(physics.mode).toBe("race");
    for (const { chassis } of physics.vehicles) {
        expect(chassis.velocity.length()).toBeLessThan(0.01);
        expect(chassis.angularVelocity.length()).toBeLessThan(0.01);
        expect(upright(chassis)).toBeGreaterThan(0.99);
    }

    physics.chassis.quaternion.setFromEuler(Math.PI, 0, 0);
    physics.chassis.velocity.set(2, 1, -3);
    physics.recover();
    expect(upright(physics.chassis)).toBeGreaterThan(0.99);
    expect(physics.chassis.velocity.length()).toBeLessThan(0.01);
    advance(physics, 2, {}, { locked: true });
    expect(physics.status().grounded).toBe(true);
    expectFiniteVehicles(physics);

    physics.returnToPits();
    expect(physics.mode).toBe("free");
    expect(physics.chassis.position.x).toBeCloseTo(30, 1);
    expect(physics.chassis.position.z).toBeCloseTo(18, 1);
    physics.dispose();
    physics.dispose();
    physics.step(STEP, { throttle: 1 });
    expect(physics.world.bodies).toHaveLength(0);
});
