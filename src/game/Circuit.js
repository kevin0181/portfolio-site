// Shared circuit geometry: all distances and widths use world metres.
// Imported road models are fitted to this original shared route.
export const ROAD_WIDTH = 9;
export const START = { position: [18, 0.8, 22], yaw: 0 };

export const ZONES = [
    { id: "readapt", position: [35, 0, 10], radius: 3.2 },
    { id: "karkartrider", position: [35, 0, 0], radius: 3.2 },
    { id: "inversus", position: [35, 0, -10], radius: 3.2 },
    { id: "workshop", position: [35, 0, -20], radius: 3.2 },
];

const CONTROL_POINTS = [
    [18, 24], [18, 8], [18, -18], [14, -29], [-5, -33], [-22, -26],
    [-31, -11], [-27, 6], [-19, 16], [-17, 26], [-9, 35], [8, 35],
];
const SAMPLE_COUNT = 256;
const EPSILON = 1e-9;
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const lerp = (from, to, amount) => from + (to - from) * amount;
const length = (x, z) => Math.hypot(x, z);
const wrap = (value, total) => ((value % total) + total) % total;

function normalized(x, z) {
    const magnitude = length(x, z);
    return magnitude > EPSILON ? { x: x / magnitude, z: z / magnitude } : { x: 0, z: -1 };
}

function catmullRom(p0, p1, p2, p3, amount) {
    const squared = amount * amount;
    const cubed = squared * amount;
    const component = (axis) => 0.5 * (
        2 * p1[axis]
        + (-p0[axis] + p2[axis]) * amount
        + (2 * p0[axis] - 5 * p1[axis] + 4 * p2[axis] - p3[axis]) * squared
        + (-p0[axis] + 3 * p1[axis] - 3 * p2[axis] + p3[axis]) * cubed
    );
    return { x: component(0), z: component(1) };
}

function distanceTable(points, closed = false) {
    let total = 0;
    const result = points.map((point, index) => {
        if (index) total += length(point.x - points[index - 1].x, point.z - points[index - 1].z);
        return { x: point.x, z: point.z, distance: total };
    });
    if (closed) total += length(points[0].x - points[points.length - 1].x, points[0].z - points[points.length - 1].z);
    return { points: result, total };
}

function smoothLoop() {
    const dense = [];
    const count = CONTROL_POINTS.length;
    for (let index = 0; index < count; index += 1) {
        for (let sample = 0; sample < 64; sample += 1) {
            dense.push(catmullRom(
                CONTROL_POINTS[(index - 1 + count) % count],
                CONTROL_POINTS[index],
                CONTROL_POINTS[(index + 1) % count],
                CONTROL_POINTS[(index + 2) % count],
                sample / 64,
            ));
        }
    }
    const source = distanceTable(dense, true);
    const sourcePoints = [...source.points, { ...source.points[0], distance: source.total }];
    const equallySpaced = [];
    let sourceIndex = 0;
    for (let index = 0; index < SAMPLE_COUNT; index += 1) {
        const distance = index * source.total / SAMPLE_COUNT;
        while (sourcePoints[sourceIndex + 1].distance < distance) sourceIndex += 1;
        const from = sourcePoints[sourceIndex];
        const to = sourcePoints[sourceIndex + 1];
        const amount = (distance - from.distance) / Math.max(EPSILON, to.distance - from.distance);
        equallySpaced.push({ x: lerp(from.x, to.x, amount), z: lerp(from.z, to.z, amount) });
    }
    // Recompute distance along the final geometry so projection and lap progress agree exactly.
    const table = distanceTable(equallySpaced, true);
    return {
        total: table.total,
        points: table.points.map((point, index) => {
            const previous = table.points[(index - 1 + SAMPLE_COUNT) % SAMPLE_COUNT];
            const next = table.points[(index + 1) % SAMPLE_COUNT];
            const tangent = normalized(next.x - previous.x, next.z - previous.z);
            const incoming = normalized(point.x - previous.x, point.z - previous.z);
            const outgoing = normalized(next.x - point.x, next.z - point.z);
            const turn = Math.atan2(
                incoming.z * outgoing.x - incoming.x * outgoing.z,
                incoming.x * outgoing.x + incoming.z * outgoing.z,
            );
            const span = (length(point.x - previous.x, point.z - previous.z) + length(next.x - point.x, next.z - point.z)) / 2;
            return {
                ...point,
                tangent,
                // Positive lateral offsets are to the driver's left: -X when travelling -Z.
                normal: { x: tangent.z, z: -tangent.x },
                curvature: turn / Math.max(EPSILON, span),
            };
        }),
    };
}

const circuit = smoothLoop();
export const TRACK_POINTS = circuit.points;
export const TRACK_LENGTH = circuit.total;

function openPolyline(vertices, spacing = 0.7) {
    const points = [];
    vertices.forEach((vertex, index) => {
        if (index === vertices.length - 1) {
            points.push({ x: vertex[0], z: vertex[1] });
            return;
        }
        const next = vertices[index + 1];
        const samples = Math.max(1, Math.ceil(length(next[0] - vertex[0], next[1] - vertex[1]) / spacing));
        for (let sample = 0; sample < samples; sample += 1) {
            points.push({ x: lerp(vertex[0], next[0], sample / samples), z: lerp(vertex[1], next[1], sample / samples) });
        }
    });
    return distanceTable(points).points.map((point, index, all) => {
        const from = all[Math.max(0, index - 1)];
        const to = all[Math.min(all.length - 1, index + 1)];
        const tangent = normalized(to.x - from.x, to.z - from.z);
        return { ...point, tangent, normal: { x: tangent.z, z: -tangent.x }, curvature: 0 };
    });
}

export const PIT_POINTS = openPolyline([[18, 24], [30, 18], [30, -24], [18, -29]]);

export function sampleTrack(distance, laneOffset = 0) {
    const travelled = wrap(Number.isFinite(distance) ? distance : 0, TRACK_LENGTH);
    let low = 0;
    let high = TRACK_POINTS.length - 1;
    while (low < high) {
        const middle = Math.ceil((low + high) / 2);
        if (TRACK_POINTS[middle].distance <= travelled) low = middle;
        else high = middle - 1;
    }
    const index = low;
    const from = TRACK_POINTS[index];
    const to = TRACK_POINTS[(index + 1) % TRACK_POINTS.length];
    const segmentLength = (index === TRACK_POINTS.length - 1 ? TRACK_LENGTH : to.distance) - from.distance;
    const amount = (travelled - from.distance) / segmentLength;
    const tangent = normalized(lerp(from.tangent.x, to.tangent.x, amount), lerp(from.tangent.z, to.tangent.z, amount));
    const normal = { x: tangent.z, z: -tangent.x };
    const offset = Number.isFinite(laneOffset) ? laneOffset : 0;
    return {
        x: lerp(from.x, to.x, amount) + normal.x * offset,
        z: lerp(from.z, to.z, amount) + normal.z * offset,
        distance: travelled,
        tangent,
        normal,
        curvature: lerp(from.curvature, to.curvature, amount),
        index,
    };
}

function projectPolyline(x, z, points, closed, total = 0) {
    let best = null;
    const count = closed ? points.length : points.length - 1;
    for (let index = 0; index < count; index += 1) {
        const from = points[index];
        const to = points[(index + 1) % points.length];
        const dx = to.x - from.x;
        const dz = to.z - from.z;
        const squaredLength = dx * dx + dz * dz;
        if (squaredLength < EPSILON) continue;
        const amount = clamp(((x - from.x) * dx + (z - from.z) * dz) / squaredLength, 0, 1);
        const projectedX = from.x + dx * amount;
        const projectedZ = from.z + dz * amount;
        const squaredDistance = (x - projectedX) ** 2 + (z - projectedZ) ** 2;
        if (best && squaredDistance >= best.squaredDistance) continue;
        const tangent = normalized(lerp(from.tangent.x, to.tangent.x, amount), lerp(from.tangent.z, to.tangent.z, amount));
        const normal = { x: tangent.z, z: -tangent.x };
        const travelled = from.distance + Math.sqrt(squaredLength) * amount;
        best = {
            x: projectedX,
            z: projectedZ,
            distance: closed ? wrap(travelled, total) : travelled,
            offset: (x - projectedX) * normal.x + (z - projectedZ) * normal.z,
            distanceToTrack: Math.sqrt(squaredDistance),
            index,
            tangent,
            normal,
            curvature: lerp(from.curvature, to.curvature, amount),
            squaredDistance,
        };
    }
    if (!best) return null;
    const { squaredDistance, ...projection } = best;
    return projection;
}

// Global nearest-segment projection remains correct after collisions or a reset.
// The optional hint is reserved for callers that keep their previous segment index.
export function projectTrack(x, z, hint) {
    return projectPolyline(x, z, TRACK_POINTS, true, TRACK_LENGTH);
}

export function isOnRoad(x, z) {
    if (!Number.isFinite(x) || !Number.isFinite(z)) return false;
    if (x >= 26 && x <= 35 && z >= -25 && z <= 20) return true;
    if (projectTrack(x, z).distanceToTrack <= ROAD_WIDTH / 2) return true;
    return projectPolyline(x, z, PIT_POINTS, false).distanceToTrack <= ROAD_WIDTH / 2;
}

export function getPitDirection(x, z) {
    return projectPolyline(x, z, PIT_POINTS, false)?.tangent || { x: 0, z: -1 };
}

// Outer guardrails follow the shared road geometry. The pit entry and exit stay open.
const barrierCount = Math.ceil(TRACK_LENGTH / 4.5);
export const TRACK_BARRIERS = Array.from({ length: barrierCount }, (_, index) => {
    const point = sampleTrack((index + 0.5) * TRACK_LENGTH / barrierCount);
    if (point.x > 12 && point.z > -30 && point.z < 28) return null;
    const edge = sampleTrack(point.distance, -(ROAD_WIDTH / 2 + 1));
    return {
        id: `circuit-guardrail-${index}`,
        shape: "box",
        position: [edge.x, 0.45, edge.z],
        size: [0.45, 0.9, TRACK_LENGTH / barrierCount + 0.15],
        rotation: [0, Math.atan2(point.tangent.x, point.tangent.z), 0],
        color: index % 3 === 0 ? "#bb5c4c" : "#ece6d7",
    };
}).filter(Boolean);
