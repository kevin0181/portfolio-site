import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const ASSET_NAMES = [
    "roadStraightLong", "roadPitStraightLong",
    "pitsGarage", "pitsOffice", "grandStandCovered", "grandStandRound", "barrierRed", "barrierWhite",
    "fenceStraight", "lightPostLarge", "tent", "treeLarge", "treeSmall", "raceCarWhite", "overhead",
];

function disposeScenes(scenes) {
    const geometries = new Set();
    const materials = new Set();
    const textures = new Set();
    scenes.forEach((scene) => scene.traverse((object) => {
        if (object.geometry) geometries.add(object.geometry);
        if (!object.material) return;
        (Array.isArray(object.material) ? object.material : [object.material]).forEach((material) => {
            materials.add(material);
            Object.values(material).forEach((value) => { if (value?.isTexture) textures.add(value); });
        });
    }));
    const bitmaps = new Set();
    textures.forEach((texture) => {
        const images = Array.isArray(texture.image) ? texture.image : [texture.image];
        images.forEach((image) => { if (typeof image?.close === "function") bitmaps.add(image); });
        texture.dispose();
    });
    // GLTFLoader can decode embedded PNGs to ImageBitmap. Texture.dispose()
    // releases GPU storage but leaves those CPU-side bitmaps open.
    bitmaps.forEach((image) => image.close());
    materials.forEach((material) => material.dispose());
    geometries.forEach((geometry) => geometry.dispose());
}

// Each runtime owns its parsed assets, so a discarded React mount cannot dispose
// the resources belonging to the next mount. Instances share these templates.
export async function loadRacingAssets() {
    const loader = new GLTFLoader();
    const base = `${(process.env.PUBLIC_URL || "").replace(/\/$/, "")}/models/kenney-racing/`;
    const results = await Promise.allSettled(ASSET_NAMES.map(async (name) => {
        const gltf = await loader.loadAsync(`${base}${name}.glb`);
        gltf.scene.traverse((object) => {
            if (!object.isMesh) return;
            object.castShadow = true;
            object.receiveShadow = true;
        });
        return [name, gltf.scene];
    }));
    const loaded = results.filter((result) => result.status === "fulfilled").map((result) => result.value);
    const failed = results.find((result) => result.status === "rejected");
    if (failed) {
        disposeScenes(loaded.map(([, scene]) => scene));
        throw new Error(`Could not load the Kenney racing models: ${failed.reason?.message || failed.reason}`);
    }
    const templates = new Map(loaded);
    let disposed = false;
    return {
        count: templates.size,
        clone(name) {
            if (disposed) throw new Error("The racing model library has already been disposed.");
            const template = templates.get(name);
            if (!template) throw new Error(`Unknown racing model: ${name}`);
            const group = new THREE.Group();
            group.name = `kenney-${name}`;
            group.add(template.clone(true));
            return group;
        },
        dispose() {
            if (disposed) return;
            disposed = true;
            disposeScenes([...templates.values()]);
            templates.clear();
        },
    };
}

function detachedWheel(source, scale, recolor) {
    source.updateWorldMatrix(true, true);
    const inverse = new THREE.Matrix4().copy(source.matrixWorld).invert();
    const parts = [];
    const bounds = new THREE.Box3();
    source.traverse((object) => {
        if (!object.isMesh || !object.geometry) return;
        const matrix = new THREE.Matrix4().multiplyMatrices(inverse, object.matrixWorld);
        const geometry = object.geometry.clone().applyMatrix4(matrix);
        geometry.computeBoundingBox();
        bounds.union(geometry.boundingBox);
        parts.push({ geometry, material: object.material });
    });
    const center = bounds.getCenter(new THREE.Vector3());
    const normalized = new THREE.Matrix4().makeRotationY(Math.PI)
        .multiply(new THREE.Matrix4().makeScale(scale, scale, scale))
        .multiply(new THREE.Matrix4().makeTranslation(-center.x, -center.y, -center.z));
    const group = new THREE.Group();
    group.name = source.name;
    parts.forEach(({ geometry, material }) => {
        geometry.applyMatrix4(normalized);
        const paint = Array.isArray(material) ? material.map(recolor) : recolor(material);
        const mesh = new THREE.Mesh(geometry, paint);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        group.add(mesh);
    });
    return group;
}

export function createAssetCar(scene, assets, color = "#e67754", number = "01") {
    const source = assets.clone("raceCarWhite");
    const sourceBody = source.getObjectByName("body");
    const wheelNames = ["wheelFrontLeft", "wheelFrontRight", "wheelBackLeft", "wheelBackRight"];
    const sourceWheels = wheelNames.map((name) => source.getObjectByName(name));
    if (!sourceBody || sourceWheels.some((wheel) => !wheel)) throw new Error("The racing car model is missing its body or wheels.");

    const scale = 2.55;
    const axleMiddle = (sourceWheels[0].position.z + sourceWheels[2].position.z) / 2;
    const body = new THREE.Group();
    body.name = `racing-car-${number}`;
    body.userData.number = number;
    const model = new THREE.Group();
    model.rotation.y = Math.PI;
    model.scale.setScalar(scale);
    // Ignore the export root's placement. The physical chassis sits above the
    // axle centres, while the independently driven wheel groups stay at origin.
    model.position.y = -sourceWheels[0].position.y * scale - .18;
    const shell = sourceBody.clone(true);
    shell.position.z -= axleMiddle;
    const paints = new Map();
    const recolor = (material, wheel = false) => {
        const palette = { carTire: "#27362f", glass: "#3d6463", grey: wheel ? "#d3d0bc" : color };
        if (!palette[material.name]) return material;
        const key = `${material.uuid}:${wheel ? "wheel" : "body"}`;
        if (!paints.has(key)) {
            const paint = material.clone();
            paint.color.set(palette[material.name]);
            paints.set(key, paint);
        }
        return paints.get(key);
    };
    shell.traverse((object) => {
        if (!object.isMesh || !object.material) return;
        object.material = Array.isArray(object.material) ? object.material.map((material) => recolor(material)) : recolor(object.material);
    });
    model.add(shell);
    body.add(model);
    const cream = new THREE.MeshStandardMaterial({ color: "#efddb2", roughness: .85, flatShading: true });
    const helmet = new THREE.Mesh(new THREE.SphereGeometry(.18, 8, 5), cream);
    helmet.scale.set(1, .96, 1);
    helmet.position.set(0, .46, -.17);
    helmet.castShadow = true;
    body.add(helmet);
    const visor = new THREE.Mesh(new THREE.BoxGeometry(.25, .075, .045), new THREE.MeshStandardMaterial({ color: "#3d6463", roughness: .55 }));
    visor.position.set(0, .48, -.325);
    body.add(visor);
    if (typeof document !== "undefined") {
        const canvas = document.createElement("canvas");
        canvas.width = 128;
        canvas.height = 128;
        const context = canvas.getContext("2d");
        context.fillStyle = "#efddb2";
        context.fillRect(0, 0, 128, 128);
        context.fillStyle = "#314c41";
        context.font = "700 64px Arial, sans-serif";
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.fillText(String(number), 64, 68);
        const map = new THREE.CanvasTexture(canvas);
        map.colorSpace = THREE.SRGBColorSpace;
        const decal = new THREE.Mesh(new THREE.CircleGeometry(.18, 20), new THREE.MeshStandardMaterial({ map, roughness: .85 }));
        decal.rotation.x = -Math.PI / 2;
        decal.position.set(0, .255, -.91);
        body.add(decal);
    }
    const brakeMaterial = new THREE.MeshStandardMaterial({ color: "#a74737", emissive: "#ef563d", emissiveIntensity: .05, roughness: .55 });
    const brake = new THREE.Mesh(new THREE.BoxGeometry(.17, .075, .035), brakeMaterial);
    brake.position.set(0, .1, 1.58);
    body.add(brake);
    scene.add(body);
    const wheels = sourceWheels.map((wheel) => {
        const group = detachedWheel(wheel, scale, (material) => recolor(material, true));
        scene.add(group);
        return group;
    });
    return { body, wheels, brakeMaterial };
}
