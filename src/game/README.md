# Formula portfolio circuit

A low-poly Formula-style circuit with a player-controlled car, three AI competitors, and four portfolio garages in the pit lane. The document resume remains a separate route.

- Circuit: `/portfolio-site/play`
- Resume: `/portfolio-site/resume`
- Local server: `npm ci`, then `npm start`
- Production build: `npm run build`
- Physics, circuit and race checks: `npm test -- --watchAll=false --runInBand src/game/CarPhysics.test.js src/game/Circuit.test.js src/game/RaceSession.test.js`

## Driving and projects

W / Up accelerates. S / Down brakes, then reverses. A / D or Left / Right steer; Space brakes; Shift boosts. R recovers the player car onto the circuit near its current track position. The on-screen controls provide touch steering, pedals and braking.

Free driving begins in the pit lane. The four garages contain Re:adapt, KarKartRider, INVERSUS and Dev workshop. Enter a garage's marked project bay and slow below 7 km/h; E, or the nearby project button, opens its details. Project panels pause the simulation. Escape closes the panel. Entering a bay alone never opens it automatically.

Starting a race resets all four cars to the grid. A four-second countdown holds the vehicles before a three-lap race. The race session tracks forward circuit progress, lap times and running order. Reverse travel removes progress; leaving the accepted course or making a discontinuous position jump invalidates the current lap's progress. Returning to the pits exits the race and restores free driving.

## Physics and rendering

`cannon-es` runs four rigid chassis with `RaycastVehicle` suspension in a fixed 1/60-second simulation step. Player and AI cars share the same world, vehicle controls, tire contact, rigid barriers and vehicle-to-vehicle collisions. AI drivers follow look-ahead points on the shared circuit, reduce target speed for corners, and choose lateral offsets around other cars. They are rule-based drivers, rather than trained machine-learning agents.

Acceleration, steering, braking and road-dependent grip act through the physics simulation. Grass reduces grip and adds drag; the pit lane has a lower speed limit. Simplified box chassis provide car collision shapes; the visible Formula bodywork, tires, painted kerbs and scenery are visual detail rather than a full mesh collision model. Barrier and garage wall meshes use the same descriptors as their rigid bodies.

The track is an original closed spline sampled into shared centerline points. Rendering uses those points for the asphalt ribbon, kerbs and pit entry/exit; physics and lap tracking use the same samples for projection and progress. Cars copy real chassis quaternions and wheel suspension transforms every frame.

## Source

- `GamePortfolio.js`: minimal interface, race commands, touch input and nearby project prompt.
- `GameWorld.js`: Three.js runtime, input, following camera, vehicle synchronization, telemetry and WebGL fallback.
- `Circuit.js`: shared circuit samples, track projection, pit lane, project zones and barrier descriptors.
- `CircuitVisuals.js`: Formula car models, track meshes, start lights, project garages, spectators and scenery.
- `CarPhysics.js`: shared rigid world, four vehicles, AI driving and recovery.
- `RaceSession.js`: countdown, lap validation, order, timing and finish state.
- `ProjectPanel.js`: project reader using existing resume data.
- `game.css`: driving overlay and project reader layout.

The game route lazy-loads the Three.js and Cannon dependency graph. Scene geometry is generated in code; garage posters use existing local project screenshots. Static scenery meshes sharing an untextured material are merged to reduce draw calls, while cars, flags and start lamps remain separate. There is no account or backend. Hidden tabs pause the render loop; reduced-motion settings stop decorative flag animation. WebGL failure leaves ordinary project buttons available.

## Dependencies and references

- [Three.js](https://github.com/mrdoob/three.js), `0.186.1`, MIT.
- [cannon-es](https://github.com/pmndrs/cannon-es), `0.20.0`, MIT.
- [Official RaycastVehicle example](https://github.com/pmndrs/cannon-es/blob/v0.20.0/examples/raycast_vehicle.html) and [vehicle implementation](https://github.com/pmndrs/cannon-es/blob/v0.20.0/src/objects/RaycastVehicle.ts).
