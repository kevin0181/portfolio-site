# Drive around

A full-screen driving playground for Young Bin You's portfolio. Drive between four project areas; stop nearby and press E to open a project. The document resume remains available separately.

- Game: `/portfolio-site/play`
- Resume: `/portfolio-site/resume`
- Local server: `npm ci`, then `npm start`
- Production check: `npm run build`
- Physics regressions: `npm test -- --watchAll=false --runInBand src/game/CarPhysics.test.js`

## Controls

WASD or arrows accelerate, brake/reverse and steer. Space is the handbrake; Shift boosts. R restores the car to its starting position. E opens a nearby project while the car is moving slower than 7 km/h. Escape closes the project. Touch devices have steering, pedal and handbrake buttons.

The map contains rigid ramps, barriers, signs, pushable crates, barrels and balls. Car suspension and collisions use a fixed-step Cannon RaycastVehicle simulation. Opening a project pauses the simulation. There is no click-to-teleport or automatic project opening.

## Source

- `GamePortfolio.js`: minimal overlay, touch input, nearby project prompt.
- `GameWorld.js`: Three.js rendering, camera, input, physics synchronization and fallback.
- `CarPhysics.js`: vehicle and world simulation; shared descriptors keep visible ramps and collision geometry aligned.
- `ProjectPanel.js`: readable project files using the original resume data.
- `game.css`: minimal driving overlay and project reader.

Three.js and Cannon are lazy-loaded on the game route. The scene is generated in code; screenshots are existing portfolio assets. The site has no account or backend. If WebGL fails, ordinary project buttons remain available.

## Dependencies and references

- [Three.js](https://github.com/mrdoob/three.js), `0.186.1`, MIT.
- [cannon-es](https://github.com/pmndrs/cannon-es), `0.20.0`, MIT.
- [Official RaycastVehicle example](https://github.com/pmndrs/cannon-es/blob/v0.20.0/examples/raycast_vehicle.html) and [vehicle source](https://github.com/pmndrs/cannon-es/blob/v0.20.0/src/objects/RaycastVehicle.ts).

The map and visual assets are original procedural implementations.
