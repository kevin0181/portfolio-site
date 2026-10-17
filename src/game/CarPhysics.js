import * as CANNON from "cannon-es";
import { TRACK_BARRIERS, ZONES, sampleTrack, projectTrack, isOnRoad } from "./Circuit";

export { ZONES } from "./Circuit";
const box = (id, position, size, color) => ({ id, shape: "box", position, size, rotation: [0, 0, 0], color });
export const PARK = [
    box("floor", [0, -.3, 0], [130, .6, 120], "#a8bb93"),
    ...TRACK_BARRIERS,
    ...ZONES.flatMap((zone) => [
        box(`${zone.id}-garage-back`, [42.3, 1.4, zone.position[2]], [.35, 2.8, 7.8], "#c8c6b8"),
        box(`${zone.id}-garage-side-north`, [39.2, 1.4, zone.position[2] - 3.85], [6.3, 2.8, .25], "#dfddcf"),
        box(`${zone.id}-garage-side-south`, [39.2, 1.4, zone.position[2] + 3.85], [6.3, 2.8, .25], "#dfddcf"),
    ]),
];
export const COMPETITORS = [
    { id: "player", name: "YOU", color: "#e67754", number: "01", lane: -.9, pace: 1 },
    { id: "ai-1", name: "MINT", color: "#69aa9c", number: "02", lane: 1.25, pace: .94 },
    { id: "ai-2", name: "SKY", color: "#719dc7", number: "03", lane: -.95, pace: 1 },
    { id: "ai-3", name: "BERRY", color: "#bd8fac", number: "04", lane: .4, pace: .91 },
];
const FIXED_STEP = 1 / 60;
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const normalizeAngle = (value) => Math.atan2(Math.sin(value), Math.cos(value));
const forwardAxis = new CANNON.Vec3(0, 0, -1);
const upAxis = new CANNON.Vec3(0, 1, 0);

function shapeFor(item) {
    return item.shape === "cylinder" ? new CANNON.Cylinder(item.size[0], item.size[0], item.size[1], 12) : new CANNON.Box(new CANNON.Vec3(item.size[0] / 2, item.size[1] / 2, item.size[2] / 2));
}
function restore(body, x, z, yaw = 0) {
    body.position.set(x, .83, z);
    body.previousPosition.copy(body.position);
    body.interpolatedPosition.copy(body.position);
    body.quaternion.setFromEuler(0, yaw, 0);
    body.previousQuaternion.copy(body.quaternion);
    body.interpolatedQuaternion.copy(body.quaternion);
    body.velocity.setZero(); body.angularVelocity.setZero(); body.force.setZero(); body.torque.setZero();
    body.aabbNeedsUpdate = true;
    body.wakeUp();
}

export class CarPhysics {
    constructor() {
        this.world = new CANNON.World({ gravity: new CANNON.Vec3(0, -9.82, 0), allowSleep: true });
        this.world.broadphase = new CANNON.SAPBroadphase(this.world);
        this.world.solver.iterations = 12;
        this.world.defaultContactMaterial.friction = .45;
        this.world.defaultContactMaterial.restitution = .08;
        this.world.defaultContactMaterial.contactEquationStiffness = 1e7;
        this.world.defaultContactMaterial.contactEquationRelaxation = 4;
        this.staticObjects = PARK;
        this.staticBodies = PARK.map((item) => {
            const body = new CANNON.Body({ mass: 0, shape: shapeFor(item) });
            body.position.set(...item.position); body.quaternion.setFromEuler(...item.rotation, "XYZ");
            body.aabbNeedsUpdate = true; body.parkId = item.id; this.world.addBody(body); return body;
        });
        this.vehicles = COMPETITORS.map((config) => {
            const chassis = new CANNON.Body({ mass: 310, allowSleep: false, linearDamping: .045, angularDamping: .42 });
            chassis.addShape(new CANNON.Box(new CANNON.Vec3(.67, .21, 1.55)), new CANNON.Vec3(0, .14, 0));
            chassis.parkId = config.id;
            const vehicle = new CANNON.RaycastVehicle({ chassisBody: chassis, indexRightAxis: 0, indexUpAxis: 1, indexForwardAxis: 2 });
            [[-.9, .08, -1.12], [.9, .08, -1.12], [-.9, .08, 1.12], [.9, .08, 1.12]].forEach((point, index) => vehicle.addWheel({
                radius: .36, directionLocal: new CANNON.Vec3(0, -1, 0), axleLocal: new CANNON.Vec3(-1, 0, 0),
                chassisConnectionPointLocal: new CANNON.Vec3(...point), isFrontWheel: index < 2,
                suspensionRestLength: .28, suspensionStiffness: 44, dampingRelaxation: 3.2, dampingCompression: 4.6,
                maxSuspensionForce: 80000, maxSuspensionTravel: .2, frictionSlip: 4.1, rollInfluence: .012,
                customSlidingRotationalSpeed: -32, useCustomSlidingRotationalSpeed: true,
            }));
            vehicle.addToWorld(this.world);
            return { ...config, chassis, vehicle, forward: new CANNON.Vec3(), up: new CANNON.Vec3(), force: new CANNON.Vec3(), throttle: 0, steering: 0, grounded: false, stuck: 0, safeDistance: 0, collisions: 0, collisionTimes: new Map() };
        });
        this.player = this.vehicles[0]; this.chassis = this.player.chassis; this.vehicle = this.player.vehicle;
        this._onCollide = (event) => {
            if (event.body.parkId === "floor") return;
            const impact = Math.abs(event.contact.getImpactVelocityAlongNormal());
            const previous = this.player.collisionTimes.get(event.body.id) ?? -Infinity;
            if (impact > 1.2 && this.world.time - previous > .4) { this.player.collisions += 1; this.player.collisionTimes.set(event.body.id, this.world.time); }
        };
        this.chassis.addEventListener("collide", this._onCollide);
        this.mode = "free"; this.disposed = false; this.reset("free");
    }

    placeCar(car, distance, lane = car.lane) {
        const point = sampleTrack(distance, lane);
        restore(car.chassis, point.x, point.z, Math.atan2(-point.tangent.x, -point.tangent.z));
        car.safeDistance = distance; car.throttle = 0; car.steering = 0; car.stuck = 0; car.grounded = false;
        car.avoidUntil = 0; car.avoidLane = lane; car.reverseUntil = 0; car.flippedTime = 0;
        car.vehicle.wheelInfos.forEach((wheel, index) => {
            wheel.rotation = 0; wheel.deltaRotation = 0; wheel.suspensionLength = wheel.suspensionRestLength; wheel.raycastResult.reset();
            car.vehicle.setSteeringValue(0, index); car.vehicle.applyEngineForce(0, index); car.vehicle.setBrake(0, index); car.vehicle.updateWheelTransform(index);
        });
    }
    reset(mode = "free") {
        this.mode = mode;
        this.vehicles.forEach((car, index) => {
            this.placeCar(car, mode === "race" ? -index * 4.3 : 35 + index * 47, mode === "race" ? (index % 2 ? 1.25 : -1.25) : car.lane);
            car.collisions = 0; car.collisionTimes.clear();
        });
        if (mode === "free") restore(this.chassis, 30, 18, 0);
    }
    recover() { this.placeCar(this.player, projectTrack(this.chassis.position.x, this.chassis.position.z).distance, 0); }
    returnToPits() { this.reset("free"); }

    aiInput(car) {
        const projection = projectTrack(car.chassis.position.x, car.chassis.position.z);
        const speed = Math.hypot(car.chassis.velocity.x, car.chassis.velocity.z);
        car.chassis.quaternion.vmult(forwardAxis, car.forward);
        const heading = Math.atan2(-car.forward.x, -car.forward.z);
        const lookAhead = 4.2 + speed * .43;
        let lane = this.world.time < car.avoidUntil ? car.avoidLane : car.lane;
        let targetSpeed = (this.mode === "race" ? 17 : 12) * car.pace;
        let curvature = 0;
        for (let distance = 2; distance <= 17; distance += 3) curvature = Math.max(curvature, Math.abs(sampleTrack(projection.distance + distance).curvature));
        targetSpeed = Math.min(targetSpeed, Math.sqrt(6.8 / Math.max(curvature, .018)));
        let blocker = null;
        let nearest = Infinity;
        this.vehicles.forEach((other) => {
            if (other === car) return;
            const dx = other.chassis.position.x - car.chassis.position.x;
            const dz = other.chassis.position.z - car.chassis.position.z;
            const ahead = dx * car.forward.x + dz * car.forward.z;
            if (ahead > -1 && ahead < 10 && Math.abs(dx * -car.forward.z + dz * car.forward.x) < 2.2 && ahead < nearest) {
                blocker = other; nearest = ahead;
            }
        });
        if (blocker) {
            const otherLane = projectTrack(blocker.chassis.position.x, blocker.chassis.position.z).offset;
            lane = otherLane > 0 ? -2.55 : 2.55;
            car.avoidLane = lane; car.avoidUntil = this.world.time + 1.5;
            if (nearest < 3.7) targetSpeed = Math.min(targetSpeed, 4);
        }
        const target = sampleTrack(projection.distance + lookAhead, lane);
        const desiredHeading = Math.atan2(-(target.x - car.chassis.position.x), -(target.z - car.chassis.position.z));
        const error = normalizeAngle(desiredHeading - heading);
        if (car.stuck > 1.6 && this.world.time >= car.reverseUntil) {
            car.reverseUntil = this.world.time + 1.25; car.stuck = 0;
        }
        if (this.world.time < car.reverseUntil) return { throttle: -1, steer: -clamp(error * 2.1, -1, 1), brake: false, boost: false };
        if (Math.abs(error) > .8) targetSpeed = Math.min(targetSpeed, 6);
        const throttle = speed > targetSpeed + .65 ? -Math.min(1, (speed - targetSpeed) / 3) : clamp((targetSpeed - speed) / 4, .12, 1);
        return { throttle, steer: clamp(error * 2.1, -1, 1), brake: false, boost: false };
    }

    applyControl(car, input, dt, locked) {
        const body = car.chassis;
        body.quaternion.vmult(forwardAxis, car.forward);
        const velocity = body.velocity.dot(car.forward);
        const speed = Math.abs(velocity);
        const throttle = clamp(input.throttle || 0, -1, 1);
        car.throttle += (throttle - car.throttle) * (1 - Math.exp(-dt * 8));
        const maxSteer = .52 / (1 + speed * .023);
        car.steering += (clamp(input.steer || 0, -1, 1) * maxSteer - car.steering) * (1 - Math.exp(-dt * 11));
        car.vehicle.setSteeringValue(car.steering, 0); car.vehicle.setSteeringValue(car.steering, 1);
        const onRoad = isOnRoad(body.position.x, body.position.z);
        const inPit = body.position.x > 25 && body.position.z > -27 && body.position.z < 22;
        const limit = throttle < 0 ? 5 : inPit ? 8 : onRoad ? (input.boost ? 33 : 26) : 11;
        const changingDirection = throttle * velocity < -.6;
        const engine = locked || changingDirection || input.brake ? 0 : car.throttle * 1050 * (input.boost ? 1.45 : 1) * clamp((limit - speed) / 4, 0, 1);
        const brake = locked ? 80 : changingDirection ? 26 : input.brake ? 30 : Math.abs(throttle) < .01 ? .3 : 0;
        for (let index = 0; index < 4; index += 1) {
            car.vehicle.applyEngineForce(index >= 2 ? engine : 0, index);
            car.vehicle.setBrake(brake, index);
            car.vehicle.wheelInfos[index].frictionSlip = onRoad ? 4.1 : 2.5;
        }
        if (car.grounded && !locked) { car.force.set(-body.velocity.x * (onRoad ? .9 : 9), -speed * speed * 2.2, -body.velocity.z * (onRoad ? .9 : 9)); body.applyForce(car.force); }
    }
    step(delta, input = {}, { locked = false, playerFinished = false } = {}) {
        if (this.disposed) return;
        const dt = clamp(Number.isFinite(delta) ? delta : FIXED_STEP, 0, .1);
        this.vehicles.forEach((car, index) => this.applyControl(car, index === 0 ? input : this.aiInput(car), dt, locked || (index === 0 && playerFinished)));
        this.world.step(FIXED_STEP, dt, 6);
        this.vehicles.forEach((car, index) => {
            car.grounded = car.vehicle.wheelInfos.some((wheel) => wheel.raycastResult.hasHit);
            car.vehicle.wheelInfos.forEach((_, wheelIndex) => car.vehicle.updateWheelTransform(wheelIndex));
            const projection = projectTrack(car.chassis.position.x, car.chassis.position.z);
            if (projection.distanceToTrack < 4.7 && car.grounded) car.safeDistance = projection.distance;
            car.chassis.quaternion.vmult(upAxis, car.up);
            const speed = car.chassis.velocity.length();
            car.stuck = !locked && speed < 1.1 ? car.stuck + dt : 0;
            car.flippedTime = !locked && car.up.y < .25 ? car.flippedTime + dt : 0;
            if (car.chassis.position.y < -4 || Math.abs(car.chassis.position.x) > 65 || Math.abs(car.chassis.position.z) > 60) this.placeCar(car, car.safeDistance);
            else if (index > 0 && car.flippedTime > 5) this.placeCar(car, car.safeDistance, car.lane);
        });
    }
    status() {
        this.chassis.quaternion.vmult(forwardAxis, this.player.forward); this.chassis.quaternion.vmult(upAxis, this.player.up);
        const { x, z } = this.chassis.position;
        const speed = Math.hypot(this.chassis.velocity.x, this.chassis.velocity.z) * 3.6;
        const zone = ZONES.find((item) => Math.hypot(x - item.position[0], z - item.position[2]) < item.radius);
        return { x, z, speed, signedSpeed: this.chassis.velocity.dot(this.player.forward) * 3.6, nearby: speed < 7 ? zone?.id || null : null, grounded: this.player.grounded, flipped: this.player.up.y < .25, collisions: this.player.collisions, onTrack: isOnRoad(x, z) };
    }
    samples() {
        return this.vehicles.map((car) => {
            const { x, z } = car.chassis.position;
            const point = projectTrack(x, z);
            return { id: car.id, distance: point.distance, speed: Math.hypot(car.chassis.velocity.x, car.chassis.velocity.z) * 3.6, onTrack: point.distanceToTrack < 7.5 || isOnRoad(x, z) };
        });
    }
    dispose() {
        if (this.disposed) return;
        this.chassis.removeEventListener("collide", this._onCollide);
        this.vehicles.forEach((car) => car.vehicle.removeFromWorld(this.world));
        this.staticBodies.forEach((body) => this.world.removeBody(body)); this.disposed = true;
    }
}
export default CarPhysics;
