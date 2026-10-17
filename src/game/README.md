# Playable portfolio

A small isometric game world for Young Bin You's portfolio. The 3D island and its objects are generated in code; project screenshots come from the existing portfolio.

- Game route: `/portfolio-site/play`
- Document resume: `/portfolio-site/resume`
- Start locally: `npm ci` then `npm start`
- Production check: `npm run build`

## Controls

WASD or arrow keys move the explorer; Shift runs, E opens the nearest project, and R returns to spawn. Click or tap terrain to walk there. Selecting a landmark or destination card walks to it and opens its project file. Touch devices also have directional buttons. Escape closes a file. Sound is opt-in; the sun button reduces decorative motion. The operating system's reduced-motion preference is respected.

Project discovery is stored only in this browser under the `youngbin-world-explored-v1` localStorage key. There is no account, tracking service, or backend. If WebGL cannot start or its context is lost, standard project buttons remain available.

## Source organization

- `GamePortfolio.js`: shell, controls, exploration progress, optional interaction sound.
- `GameWorld.js`: Three.js scene, movement, picking, camera, cleanup, fallback.
- `ProjectPanel.js`: accessible project/profile files using the existing resume data.
- `game.css`: responsive world UI and project files.

Three.js is lazy-loaded on the game route; the document resume remains available separately.

## References

Runtime: [Three.js](https://github.com/mrdoob/three.js), pinned to `0.186.1`, MIT licensed.

Implementation references: [official Three.js game example](https://github.com/mrdoob/three.js/blob/r186/examples/games_fps.html), [official resource cleanup guide](https://threejs.org/manual/pages/cleanup.html). [Bruno Simon's portfolio](https://github.com/brunosimon/folio-2019) was a reference for exploratory portfolio navigation. This scene and interface are original implementations; no source or assets were copied from that portfolio.
