# Nasa — Earth Jukebox

A cinematic, interactive web experience for exploring seven Earth ecosystems through local movement recognition and gesture-driven sound.

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

The camera permission is requested automatically when a landscape opens. Preview frames remain in the browser and are not recorded or uploaded; users can turn the camera off at any time.

The Teachable Machine Pose export is stored locally in `public/models/earth-pose/` (`model.json`, `metadata.json`, and `weights.bin`). Its metadata labels are `Brazo derecho`, `brazo izquierdo`, and `Ambos brazos`; class-to-sound mapping uses these exact labels. The model runs in the browser with `@teachablemachine/pose` and TensorFlow.js. PoseNet is pinned to 2.2.0 because 2.2.2 pulls an incompatible TensorFlow core major. Camera frames are not recorded or uploaded. Recognition requires camera permission and a browser with WebGL or CPU TensorFlow.js support.

On the landing page, the voice-selection button reads all seven landscape options and listens for a name in Spanish or English. This uses the browser's Web Speech recognition implementation, which may process speech through its own service; Earth Jukebox does not store microphone audio. After a gesture is recognized, the page announces it in Spanish.

Begin listening explicitly to enable audio, as required by browser autoplay policies. Forest gestures play the supplied birds, rain, and crickets WAV files from `public/audio/forest/`; other landscapes use configurable procedural Web Audio. Forest recordings loop while their gestures are active and fade between gestures. These are creative sound assets, not NASA recordings, measurements, or scientific sonification.

Photography is served by Unsplash and is not presented as NASA imagery. NASA data and visualizations have not yet been integrated.
