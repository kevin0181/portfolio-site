import {
    ROAD_WIDTH,
    START,
    ZONES,
    TRACK_LENGTH,
    TRACK_POINTS,
    sampleTrack,
    projectTrack,
    isOnRoad,
} from "./Circuit";

const wrappedDistanceError = (first, second) => {
    const difference = Math.abs(first - second);
    return Math.min(difference, TRACK_LENGTH - difference);
};

test("crossing the finish line keeps the road and heading continuous", () => {
    const before = sampleTrack(TRACK_LENGTH - 0.01);
    const after = sampleTrack(0.01);
    expect(Math.hypot(before.x - after.x, before.z - after.z)).toBeLessThan(0.021);
    expect(before.tangent.x * after.tangent.x + before.tangent.z * after.tangent.z).toBeGreaterThan(0.999);
    expect(projectTrack(before.x, before.z).distance).toBeGreaterThan(TRACK_LENGTH - 0.02);
    expect(projectTrack(after.x, after.z).distance).toBeLessThan(0.02);

    const negative = sampleTrack(-0.01);
    const extraLap = sampleTrack(TRACK_LENGTH * 3 + 0.01);
    expect(Math.hypot(negative.x - before.x, negative.z - before.z)).toBeLessThan(1e-7);
    expect(Math.hypot(extraLap.x - after.x, extraLap.z - after.z)).toBeLessThan(1e-7);
});

test("world positions project back to stable lap progress and signed driving lanes", () => {
    for (let sample = 0; sample < 80; sample += 1) {
        const distance = (sample + 0.35) * TRACK_LENGTH / 80;
        for (const lane of [-2, 0, 2]) {
            const point = sampleTrack(distance, lane);
            const projection = projectTrack(point.x, point.z);
            expect(wrappedDistanceError(projection.distance, distance)).toBeLessThan(0.2);
            expect(Math.abs(projection.offset - lane)).toBeLessThan(0.04);
            expect(Math.abs(projection.distanceToTrack - Math.abs(lane))).toBeLessThan(0.015);
        }
    }
});

test("the drivable surface covers the full circuit, connected pit lane and project stops", () => {
    TRACK_POINTS.forEach((point) => {
        expect(isOnRoad(point.x, point.z)).toBe(true);
        expect(Number.isFinite(point.curvature)).toBe(true);
    });
    expect(isOnRoad(START.position[0], START.position[2])).toBe(true);
    for (let z = -24; z <= 18; z += 2) expect(isOnRoad(30, z)).toBe(true);
    ZONES.forEach((zone) => expect(isOnRoad(zone.position[0], zone.position[2])).toBe(true));
    expect(isOnRoad(0, 0)).toBe(false);
    expect(isOnRoad(60, 0)).toBe(false);
});

test("road edge classification follows the curve rather than a bounding rectangle", () => {
    const distance = TRACK_LENGTH * 0.44;
    const inside = sampleTrack(distance, ROAD_WIDTH / 2 - 0.1);
    const outside = sampleTrack(distance, ROAD_WIDTH / 2 + 0.5);
    expect(isOnRoad(inside.x, inside.z)).toBe(true);
    expect(isOnRoad(outside.x, outside.z)).toBe(false);
});


test("corner radii leave space for the full road ribbon and the vehicle wheelbase", () => {
    const maximumCurvature = Math.max(...TRACK_POINTS.map((point) => Math.abs(point.curvature)));
    expect(maximumCurvature).toBeLessThanOrEqual(0.18);
});
