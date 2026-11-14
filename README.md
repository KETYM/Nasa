# Nasa — Earth Jukebox

A cinematic, interactive web experience for exploring seven Earth ecosystems through locally generated sound.

## Run locally

```bash
npm ci
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Stack

- Next.js App Router
- React and TypeScript
- Tailwind CSS

## Experience routes

- `/experience/forest`
- `/experience/ocean`
- `/experience/atmosphere`
- `/experience/desert`
- `/experience/jungle`
- `/experience/savanna`
- `/experience/polar`

Each route uses the same reusable experience, camera, ecosystem configuration and audio engine.

## Camera, model and audio

The camera is requested only after the user activates it. Preview frames remain in the browser and are not recorded or uploaded.

The Teachable Machine Pose export is stored locally in `public/models/earth-pose/` (`model.json`, `metadata.json`, and `weights.bin`). Its metadata labels are `Brazo derecho`, `brazo izquierdo`, and `Ambos brazos`; class-to-sound mapping uses these exact labels. The model runs in the browser with `@teachablemachine/pose` and TensorFlow.js. PoseNet is pinned to 2.2.0 because 2.2.2 pulls an incompatible TensorFlow core major. Camera frames are not recorded or uploaded. Recognition requires camera permission and a browser with WebGL or CPU TensorFlow.js support.

The sound engine creates a quiet procedural Web Audio sketch from configurable ecosystem, variant, and gesture profiles. Begin listening explicitly to enable audio; once enabled, stable recognized gestures modulate the selected ecosystem sound. These sounds are artistic synthesis, not environmental recordings, NASA measurements or scientific sonification.

Photography is served by Unsplash and is not presented as NASA imagery. NASA data and visualizations have not yet been integrated.
