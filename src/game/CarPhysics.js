import * as CANNON from "cannon-es";

const box = (id, position, size, color, rotation = [0, 0, 0]) => ({ id, shape: "box", position, size, rotation, color });
const cylinder = (id, position, radius, height, color) => ({ id, shape: "cylinder", position, size: [radius, height, radius], rotation: [0, 0, 0], color });

export const ZONES = [
    { id: "readapt", position: [-15, 0, -12], radius: 4 },
    { id: "karkartrider", position: [14, 0, -12], radius: 4 },
    { id: "inversus", position: [15, 0, 12], radius: 4 },
    { id: "workshop", position: [-15, 0, 12], radius: 4 },
];

// Full box dimensions; cylinders use [radius, height, radius] with their axis along Y.
// These same descriptors drive the visible geometry and the rigid collision shapes.
export const PARK = [
    box("floor", [0, -0.25, 0], [48, 0.5, 44], "#dddccf"),
    box("rail-west", [-23.85, 0.4, 0], [0.3, 0.8, 44], "#b5b6aa"),
    box("rail-east", [23.85, 0.4, 0], [0.3, 0.8, 44], "#b5b6aa"),
    box("rail-north", [0, 0.4, -21.85], [48, 0.8, 0.3], "#b5b6aa"),
    box("rail-south", [0, 0.4, 21.85], [48, 0.8, 0.3], "#b5b6aa"),
    box("main-ramp", [0, 0.65, -3], [6, 0.5, 7], "#e2c796", [0.24, 0, 0]),
    box("landing-pad", [0, 0.55, -11], [6, 1.1, 5], "#d2b580"),
    box("west-ramp", [-10, 0.48, 1], [5, 0.4, 5], "#d6b5a4", [0, 0, -0.2]),
    box("east-ramp", [10, 0.48, 0], [5, 0.4, 5], "#aabec7", [0, 0, 0.2]),
    box("south-funbox", [7, 0.3, 15], [4.8, 0.6, 3.2], "#d6bb96"),
    box("funbox-entry", [3.7, 0.19, 15], [2.2, 0.3, 3.2], "#d6bb96", [0, 0, 0.18]),
    cylinder("bollard-west-a", [-6.5, 0.4, -14.8], 0.38, 0.8, "#daa35f"),
    cylinder("bollard-west-b", [-6.5, 0.4, -12.8], 0.38, 0.8, "#daa35f"),
    cylinder("bollard-east-a", [6.5, 0.4, -14.8], 0.38, 0.8, "#daa35f"),
    cylinder("bollard-east-b", [6.5, 0.4, -12.8], 0.38, 0.8, "#daa35f"),
    ...ZONES.flatMap((zone) => [
        box(`${zone.id}-sign-board`, [zone.position[0], 2.15, zone.position[2] - 4.1], [3.4, 1.14, 0.16], "#f4e8cf"),
        ...[-1.25, 1.25].map((offset, index) => cylinder(`${zone.id}-sign-post-${index}`, [zone.position[0] + offset, 1.05, zone.position[2] - 4.1], 0.055, 2.1, "#7b887a")),
    ]),
];

const SPAWN = [0, 1.2, 14];
const FIXED_STEP = 1 / 60;
const WHEEL_RADIUS = 0.36;
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

function makeShape(shape, size) {
    if (shape === "barrel" || shape === "cylinder") return new CANNON.Cylinder(size[0], size[0], size[1], 16);
    if (shape === "ball") return new CANNON.Sphere(size[0]);
    return new CANNON.Box(new CANNON.Vec3(size[0] / 2, size[1] / 2, size[2] / 2));
}

export class CarPhysics {
    constructor() {
        this.world = new CANNON.World({ gravity: new CANNON.Vec3(0, -9.82, 0), allowSleep: true });
        this.world.broadphase = new CANNON.SAPBroadphase(this.world);
        this.world.solver.iterations = 12;
        this.world.defaultContactMaterial.friction = 0.55;
        this.world.defaultContactMaterial.restitution = 0.12;
        this.world.defaultContactMaterial.contactEquationStiffness = 1e7;
        this.world.defaultContactMaterial.contactEquationRelaxation = 4;

        this.staticObjects = PARK;
        this.staticBodies = PARK.map((item) => {
            const body = new CANNON.Body({ mass: 0, shape: makeShape(item.shape, item.size) });
            body.position.set(...item.position);
            body.quaternion.setFromEuler(...item.rotation, "XYZ");
            body.aabbNeedsUpdate = true;
            body.parkId = item.id;
            this.world.addBody(body);
            return body;
        });

        this.chassis = new CANNON.Body({ mass: 340, allowSleep: false, linearDamping: 0.045, angularDamping: 0.38 });
        // The shape sits above the body origin, lowering the centre of mass without fake stabilization.
        this.chassis.addShape(new CANNON.Box(new CANNON.Vec3(0.8, 0.28, 1.4)), new CANNON.Vec3(0, 0.12, 0));
        this.chassis.position.set(...SPAWN);
        this.vehicle = new CANNON.RaycastVehicle({ chassisBody: this.chassis, indexRightAxis: 0, indexUpAxis: 1, indexForwardAxis: 2 });
        const wheelOptions = {
            radius: WHEEL_RADIUS,
            directionLocal: new CANNON.Vec3(0, -1, 0),
            axleLocal: new CANNON.Vec3(-1, 0, 0),
            suspensionRestLength: 0.38,
            suspensionStiffness: 34,
            dampingRelaxation: 2.8,
            dampingCompression: 4.4,
            maxSuspensionForce: 80000,
            maxSuspensionTravel: 0.28,
            frictionSlip: 2.7,
            rollInfluence: 0.025,
            customSlidingRotationalSpeed: -28,
            useCustomSlidingRotationalSpeed: true,
        };
        [[-0.84, 0.12, -0.98], [0.84, 0.12, -0.98], [-0.84, 0.12, 0.98], [0.84, 0.12, 0.98]].forEach((point, index) => {
            this.vehicle.addWheel({ ...wheelOptions, chassisConnectionPointLocal: new CANNON.Vec3(...point), isFrontWheel: index < 2 });
        });
        this.vehicle.addToWorld(this.world);

        const pushables = [
            ...[-2.1, 0, 2.1].map((x, index) => ({ id: `crate-bottom-${index}`, shape: "box", position: [x, x === 0 ? 0.26 : 0.43, 7], size: x === 0 ? [0.5, 0.5, 0.5] : [0.86, 0.86, 0.86], color: "#e3a65e", mass: x === 0 ? 3 : 9 })),
            ...[-2.1, 2.1].map((x, index) => ({ id: `crate-top-${index}`, shape: "box", position: [x, 1.29, 7], size: [0.86, 0.86, 0.86], color: "#dc9652", mass: 7 })),
            { id: "barrel-west-a", shape: "barrel", position: [-5, 0.55, 6], size: [0.43, 1.1, 0.43], color: "#668e9a", mass: 12 },
            { id: "barrel-west-b", shape: "barrel", position: [-5.9, 0.55, 6.3], size: [0.43, 1.1, 0.43], color: "#749eaa", mass: 12 },
            { id: "barrel-east-a", shape: "barrel", position: [6.3, 0.55, 5.3], size: [0.43, 1.1, 0.43], color: "#d68569", mass: 12 },
            { id: "barrel-east-b", shape: "barrel", position: [7.4, 0.55, 5.6], size: [0.43, 1.1, 0.43], color: "#d99b70", mass: 12 },
            { id: "ball-west", shape: "ball", position: [-4, 0.67, -7], size: [0.65, 0.65, 0.65], color: "#d9ad54", mass: 8 },
            { id: "ball-east", shape: "ball", position: [5.5, 0.77, -7], size: [0.75, 0.75, 0.75], color: "#dc927f", mass: 10 },
            { id: "ball-south", shape: "ball", position: [-6.5, 0.57, 15], size: [0.55, 0.55, 0.55], color: "#a9a0cb", mass: 7 },
            ...[-1, 1].map((x, index) => ({ id: `marker-${index}`, shape: "box", position: [x * 4.5, 0.3, 10], size: [0.4, 0.6, 0.4], color: "#f18d4e", mass: 3 })),
        ];
        this.dynamicObjects = pushables.map((item) => {
            const body = new CANNON.Body({ mass: item.mass, shape: makeShape(item.shape, item.size), linearDamping: 0.14, angularDamping: 0.16, sleepSpeedLimit: 0.2, sleepTimeLimit: 1 });
            body.position.set(...item.position);
            body.aabbNeedsUpdate = true;
            body.parkId = item.id;
            this.world.addBody(body);
            return { id: item.id, body, shape: item.shape, size: item.size, color: item.color, initialPosition: item.position };
        });

        this._forward = new CANNON.Vec3();
        this._up = new CANNON.Vec3();
        this._throttle = 0;
        this._steering = 0;
        this._grounded = false;
        this._collisions = 0;
        this._maxJump = 0;
        this._collisionTimes = new Map();
        this._disposed = false;
        this._onCollide = (event) => {
            if (event.body.parkId === "floor") return;
            const impact = Math.abs(event.contact.getImpactVelocityAlongNormal());
            const previous = this._collisionTimes.get(event.body.id) ?? -Infinity;
            if (impact > 1.2 && this.world.time - previous > 0.4) {
                this._collisions += 1;
                this._collisionTimes.set(event.body.id, this.world.time);
            }
        };
        this.chassis.addEventListener("collide", this._onCollide);
        this.reset();
    }

    step(delta, input = {}) {
        if (this._disposed) return;
        const elapsed = clamp(Number.isFinite(delta) ? delta : FIXED_STEP, 0, 0.1);
        const throttle = clamp(input.throttle || 0, -1, 1);
        const steer = clamp(input.steer || 0, -1, 1);
        this.chassis.quaternion.vmult(new CANNON.Vec3(0, 0, -1), this._forward);
        const signedVelocity = this.chassis.velocity.dot(this._forward);
        const speed = Math.abs(signedVelocity);
        this._throttle += (throttle - this._throttle) * (1 - Math.exp(-elapsed * 7));
        const steeringTarget = steer * (0.46 / (1 + speed * 0.065));
        this._steering += (steeringTarget - this._steering) * (1 - Math.exp(-elapsed * 9));
        this.vehicle.setSteeringValue(this._steering, 0);
        this.vehicle.setSteeringValue(this._steering, 1);

        // Positive engine force propels this explicit axis layout toward local -Z.
        const changingDirection = throttle * signedVelocity < -0.7;
        const limit = throttle < 0 ? 7 : input.boost ? 19 : 14;
        const taper = clamp((limit - speed) / 3, 0, 1);
        const engine = changingDirection || input.brake ? 0 : this._throttle * 710 * (input.boost ? 1.65 : 1) * taper;
        const braking = changingDirection ? 18 : Math.abs(throttle) < 0.01 ? 0.45 : 0;
        for (let index = 0; index < 4; index += 1) {
            this.vehicle.applyEngineForce(index >= 2 ? engine : 0, index);
            this.vehicle.setBrake(input.brake ? (index >= 2 ? 12 : 0) : braking, index);
            this.vehicle.wheelInfos[index].frictionSlip = input.brake && index >= 2 ? 0.8 : 2.7;
        }
        this.world.step(FIXED_STEP, elapsed, 6);
        this._grounded = this.vehicle.wheelInfos.some((wheel) => wheel.raycastResult.hasHit);
        // updateWheelTransform clears isInContact internally; capture grounded state first.
        for (let index = 0; index < 4; index += 1) this.vehicle.updateWheelTransform(index);
        this._maxJump = Math.max(this._maxJump, this.chassis.position.y - 0.56);
        if (this.chassis.position.y < -8 || Math.abs(this.chassis.position.x) > 32 || Math.abs(this.chassis.position.z) > 30) this.reset();
    }

    status() {
        this.chassis.quaternion.vmult(new CANNON.Vec3(0, 0, -1), this._forward);
        this.chassis.quaternion.vmult(new CANNON.Vec3(0, 1, 0), this._up);
        const signedSpeed = this.chassis.velocity.dot(this._forward) * 3.6;
        const speed = Math.hypot(this.chassis.velocity.x, this.chassis.velocity.z) * 3.6;
        const { x, z } = this.chassis.position;
        const zone = ZONES.find((item) => Math.hypot(x - item.position[0], z - item.position[2]) < item.radius);
        return { x, z, speed, signedSpeed, nearby: speed < 7 ? zone?.id || null : null, grounded: this._grounded, flipped: this._up.y < 0.25, collisions: this._collisions, maxJump: this._maxJump };
    }

    reset() {
        if (this._disposed) return;
        this._restoreBody(this.chassis, SPAWN);
        this._throttle = 0;
        this._steering = 0;
        this._grounded = false;
        this._maxJump = 0;
        this._collisions = 0;
        this._collisionTimes?.clear();
        this.vehicle.wheelInfos.forEach((wheel, index) => {
            wheel.rotation = 0;
            wheel.deltaRotation = 0;
            wheel.suspensionLength = wheel.suspensionRestLength;
            wheel.raycastResult.reset();
            this.vehicle.setSteeringValue(0, index);
            this.vehicle.applyEngineForce(0, index);
            this.vehicle.setBrake(0, index);
            this.vehicle.updateWheelTransform(index);
        });
    }

    resetObjects() {
        this.dynamicObjects.forEach((item) => this._restoreBody(item.body, item.initialPosition));
    }

    _restoreBody(body, position) {
        body.position.set(...position);
        body.previousPosition.copy(body.position);
        body.interpolatedPosition.copy(body.position);
        body.quaternion.set(0, 0, 0, 1);
        body.previousQuaternion.copy(body.quaternion);
        body.interpolatedQuaternion.copy(body.quaternion);
        body.velocity.setZero();
        body.angularVelocity.setZero();
        body.force.setZero();
        body.torque.setZero();
        body.aabbNeedsUpdate = true;
        body.wakeUp();
    }

    dispose() {
        if (this._disposed) return;
        this.chassis.removeEventListener("collide", this._onCollide);
        this.vehicle.removeFromWorld(this.world);
        [...this.staticBodies, ...this.dynamicObjects.map((item) => item.body)].forEach((body) => this.world.removeBody(body));
        this._collisionTimes.clear();
        this._disposed = true;
    }
}

export default CarPhysics;
