import { Vec3 } from "cannon-es";
import CarPhysics from "./CarPhysics";

const STEP = 1 / 60;
const cars = [];

function createCar() {
    const car = new CarPhysics();
    cars.push(car);
    return car;
}

function advance(car, seconds, input = {}, observe) {
    for (let frame = 0; frame < Math.round(seconds / STEP); frame += 1) {
        car.step(STEP, input);
        observe?.();
    }
}

function upright(car) {
    return car.chassis.quaternion.vmult(new Vec3(0, 1, 0)).y;
}

function finiteTransform({ position, quaternion }) {
    return [position.x, position.y, position.z, quaternion.x, quaternion.y, quaternion.z, quaternion.w]
        .every(Number.isFinite);
}

function expectFiniteTransforms(car) {
    expect(finiteTransform(car.chassis)).toBe(true);
    expect(car.dynamicObjects.every(({ body }) => finiteTransform(body))).toBe(true);
    expect(car.vehicle.wheelInfos.every(({ worldTransform }) => finiteTransform(worldTransform))).toBe(true);
}

afterEach(() => {
    cars.splice(0).forEach((car) => car.dispose());
});

test("an idle car settles upright on its wheels with finite transforms", () => {
    const car = createCar();
    advance(car, 2);

    expect(car.status().grounded).toBe(true);
    expect(car.vehicle.wheelInfos.filter(({ raycastResult }) => raycastResult.hasHit).length).toBeGreaterThanOrEqual(3);
    expect(upright(car)).toBeGreaterThan(0.9);
    expect(car.chassis.position.y).toBeGreaterThan(0.3);
    expect(car.chassis.position.y).toBeLessThan(1);
    expect(car.status().speed).toBeLessThan(1);
    expectFiniteTransforms(car);
});

test("acceleration follows the car's forward axis and left steering turns its actual path", () => {
    const car = createCar();
    advance(car, 1.5);
    const start = car.chassis.position.clone();
    const forward = car.chassis.quaternion.vmult(new Vec3(0, 0, -1));

    advance(car, 1, { throttle: 1 });

    const straightDisplacement = car.chassis.position.vsub(start);
    expect(straightDisplacement.dot(forward)).toBeGreaterThan(0.6);
    expect(Math.abs(straightDisplacement.x)).toBeLessThan(0.25);
    const turnStart = car.chassis.position.clone();

    advance(car, 1, { throttle: 1, steer: 1 });

    const turnedForward = car.chassis.quaternion.vmult(new Vec3(0, 0, -1));
    expect(car.chassis.position.x).toBeLessThan(turnStart.x - 0.25);
    expect(turnedForward.x).toBeLessThan(-0.1);
    expect(car.status().signedSpeed).toBeGreaterThan(0);
    expect(upright(car)).toBeGreaterThan(0.75);
    expectFiniteTransforms(car);
});

test("driving into the starting crates moves dynamic objects and registers an impact", () => {
    const car = createCar();
    advance(car, 1.5);
    const crates = car.dynamicObjects.filter(({ id }) => id.startsWith("crate-"));
    expect(crates.length).toBeGreaterThan(0);
    const initialPositions = crates.map(({ body }) => body.position.clone());

    advance(car, 4, { throttle: 1, boost: true });

    const displacements = crates.map(({ body }, index) => Math.hypot(
        body.position.x - initialPositions[index].x,
        body.position.z - initialPositions[index].z,
    ));
    expect(Math.max(...displacements)).toBeGreaterThan(0.6);
    expect(car.status().collisions).toBeGreaterThan(0);
    expectFiniteTransforms(car);
});

test("the reverse pedal brakes forward motion before backing up", () => {
    const car = createCar();
    advance(car, 1.5);
    advance(car, 1, { throttle: 1 });
    const forwardSpeed = car.status().speed;
    expect(forwardSpeed).toBeGreaterThan(5);

    advance(car, 0.45, { throttle: -1 });

    expect(car.status().speed).toBeLessThan(forwardSpeed * 0.4);
    const brakingPosition = car.chassis.position.clone();
    advance(car, 1.3, { throttle: -1 });
    expect(car.status().signedSpeed).toBeLessThan(-2);
    expect(car.chassis.position.z).toBeGreaterThan(brakingPosition.z + 1);
    expect(upright(car)).toBeGreaterThan(0.9);
    expectFiniteTransforms(car);
});

test("a boosted approach launches off the main ramp and lands upright", () => {
    const car = createCar();
    advance(car, 1.5);
    const restingHeight = car.chassis.position.y;
    let reachedRamp = false;
    let airborneAboveRest = false;
    let landedAfterJump = false;
    let invalidTransform = false;
    const observe = () => {
        const { grounded } = car.status();
        if (car.chassis.position.z < 1) reachedRamp = true;
        if (reachedRamp && !grounded && car.chassis.position.y > restingHeight + 0.7) airborneAboveRest = true;
        if (airborneAboveRest && grounded) landedAfterJump = true;
        if (!finiteTransform(car.chassis)) invalidTransform = true;
    };

    advance(car, 5, { throttle: 1, boost: true }, observe);
    advance(car, 3, { brake: true }, observe);

    expect(reachedRamp).toBe(true);
    expect(airborneAboveRest).toBe(true);
    expect(landedAfterJump).toBe(true);
    expect(invalidTransform).toBe(false);
    expect(car.status().grounded).toBe(true);
    expect(upright(car)).toBeGreaterThan(0.7);
    expectFiniteTransforms(car);
});

test("reset halts a moving car and restores a stable starting stance", () => {
    const car = createCar();
    const spawn = car.chassis.position.clone();
    advance(car, 1.5);
    advance(car, 1.2, { throttle: 1, steer: 1, boost: true });
    expect(car.status().speed).toBeGreaterThan(2);

    car.reset();

    expect(car.chassis.position.distanceTo(spawn)).toBeLessThan(0.01);
    expect(car.chassis.velocity.length()).toBeLessThan(0.01);
    expect(car.chassis.angularVelocity.length()).toBeLessThan(0.01);
    expect(upright(car)).toBeGreaterThan(0.99);
    advance(car, 2);
    expect(car.status().grounded).toBe(true);
    expect(car.status().speed).toBeLessThan(1);
    expect(Math.hypot(car.chassis.position.x - spawn.x, car.chassis.position.z - spawn.z)).toBeLessThan(0.2);
    expectFiniteTransforms(car);
});

test("dispose removes the simulation bodies and tolerates repeated cleanup", () => {
    const car = createCar();
    advance(car, 0.5);
    expect(car.world.bodies.length).toBeGreaterThan(0);

    car.dispose();
    car.dispose();
    car.step(STEP, { throttle: 1 });

    expect(car.world.bodies).toHaveLength(0);
});
