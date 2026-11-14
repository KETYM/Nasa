"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  getVariant,
  type Ecosystem,
} from "@/features/ecosystems/catalog";
import { useCamera } from "@/features/camera/use-camera";
import { usePoseRecognition } from "@/features/pose-detection/use-pose-recognition";
import { SonificationEngine } from "@/features/sonification/audio-engine";

type EcosystemExperienceProps = {
  ecosystem: Ecosystem;
};

function getAudioErrorMessage(error: unknown): string {
  if (error instanceof Error && error.name === "NotSupportedError") {
    return "This browser does not support Web Audio. Try a current version of Chrome, Firefox or Safari.";
  }

  if (error instanceof Error && error.message.startsWith("Failed to load sound")) {
    return `A landscape sound could not be loaded: ${error.message}`;
  }

  return "Audio could not start. Check your browser audio settings and try again.";
}

export function EcosystemExperience({
  ecosystem,
}: EcosystemExperienceProps) {
  const {
    error: cameraError,
    startCamera,
    status: cameraStatus,
    stopCamera,
    videoRef,
  } = useCamera();
  const {
    className: detectedClass,
    confidence,
    error: recognitionError,
    gesture: detectedGesture,
    status: recognitionStatus,
  } = usePoseRecognition(videoRef, cameraStatus === "active");
  const router = useRouter();
  const [engine] = useState(() => new SonificationEngine());
  const [variantId, setVariantId] = useState(ecosystem.variants[0].id);
  const [audioActive, setAudioActive] = useState(false);
  const [audioStarting, setAudioStarting] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);
  const [volume, setVolume] = useState(0.35);

  const selectedVariant = useMemo(
    () => getVariant(ecosystem, variantId),
    [ecosystem, variantId],
  );
  const usesGestureRecordings = Object.values(ecosystem.gestures).some(
    (sound) => sound.audioUrl,
  );

  useEffect(() => {
    if (audioActive) {
      engine.updateVariant(selectedVariant);
    }
  }, [audioActive, engine, selectedVariant]);

  useEffect(() => {
    const gestureSound =
      audioActive && detectedGesture
        ? ecosystem.gestures[detectedGesture]
        : undefined;
    void engine
      .setGesture(audioActive ? detectedGesture : null, gestureSound)
      .then(() => setAudioError(null))
      .catch((error: unknown) => setAudioError(getAudioErrorMessage(error)));
  }, [audioActive, detectedGesture, ecosystem.gestures, engine]);

  useEffect(() => {
    engine.setVolume(volume);
  }, [engine, volume]);

  useEffect(
    () => () => {
      void engine.stop();
    },
    [engine],
  );

  const startAudio = useCallback(async () => {
    if (audioStarting) {
      return;
    }

    setAudioStarting(true);
    setAudioError(null);
    try {
      await engine.start(selectedVariant);
      setAudioActive(true);
    } catch (error) {
      setAudioActive(false);
      setAudioError(getAudioErrorMessage(error));
    } finally {
      setAudioStarting(false);
    }
  }, [audioStarting, engine, selectedVariant]);

  const stopAudio = useCallback(async () => {
    await engine.stop();
    setAudioActive(false);
  }, [engine]);

  const endExperience = useCallback(async () => {
    stopCamera();
    await stopAudio();
    router.push("/#ecosystems");
  }, [router, stopCamera, stopAudio]);

  return (
    <main className="min-h-screen bg-[#04171d] text-stone-100">
      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#03161d]/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <Link
            href="/#ecosystems"
            className="text-xs font-medium uppercase tracking-[0.3em] text-[#f0e8d8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d9b36c]"
          >
            EARTH JUKEBOX
          </Link>
          <button
            type="button"
            onClick={() => void endExperience()}
            className="rounded-full border border-white/15 px-4 py-2 text-xs font-medium uppercase tracking-[0.16em] text-slate-100 transition hover:border-white/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d9b36c]"
          >
            Back to landscapes
          </button>
        </div>
      </header>

      <section className="relative isolate overflow-hidden border-b border-white/10">
        <Image
          src={ecosystem.image}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(90deg, ${selectedVariant.visualTint}, rgba(3, 18, 25, 0.9) 72%), linear-gradient(0deg, rgba(3, 18, 25, 0.86), transparent 70%)`,
          }}
        />
        <div className="relative mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
          <p className="text-[0.65rem] font-medium uppercase tracking-[0.35em] text-[#e2c889]">
            A listening room for Earth
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-[#f8f1e6] sm:text-6xl">
            {ecosystem.name}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-100/85 sm:text-lg">
            {ecosystem.description}
          </p>
          <p className="mt-5 text-sm text-slate-100/75">
            Listening to:{" "}
            <span className="font-medium text-[#f2ddb0]">
              {selectedVariant.name}
            </span>
          </p>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-8 px-5 py-10 sm:px-8 lg:grid-cols-[1.25fr_0.75fr] lg:py-14">
        <section aria-labelledby="camera-heading">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[0.65rem] font-medium uppercase tracking-[0.3em] text-[#d3b373]">
                Your movement, kept local
              </p>
              <h2
                id="camera-heading"
                className="mt-2 text-2xl font-semibold text-[#f8f1e6]"
              >
                Meet the landscape
              </h2>
            </div>
            <span
              className="rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs text-slate-100/80"
              aria-live="polite"
            >
              Camera:{" "}
              {cameraStatus === "active"
                ? "on"
                : cameraStatus === "requesting"
                  ? "waiting for permission"
                  : cameraStatus === "error"
                    ? "unavailable"
                    : "off"}
            </span>
          </div>

          <div className="relative aspect-video overflow-hidden rounded-[1.7rem] border border-white/10 bg-[#081e27] shadow-[0_30px_70px_rgba(2,17,25,0.5)]">
            <Image
              src={ecosystem.image}
              alt=""
              fill
              sizes="(max-width: 1024px) 100vw, 65vw"
              className="object-cover opacity-35"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-[#082331]/50 via-[#04171d]/35 to-[#03141a]/80" />
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              aria-label="Live camera preview. Video stays on this device and is not recorded or uploaded."
              className={`absolute inset-0 h-full w-full -scale-x-100 object-cover ${
                cameraStatus === "active" ? "opacity-100" : "opacity-0"
              }`}
            />
            {cameraStatus !== "active" && (
              <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
                <span
                  aria-hidden="true"
                  className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-white/20 bg-white/5 text-2xl text-[#e2c889]"
                >
                  ◌
                </span>
                <p className="max-w-sm text-sm leading-6 text-slate-100/85">
                  {cameraStatus === "requesting"
                    ? "Waiting for camera permission…"
                    : "When you are ready, allow camera access to see yourself in this landscape."}
                </p>
              </div>
            )}
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            {cameraStatus === "active" ? (
              <button
                type="button"
                onClick={stopCamera}
                className="rounded-full border border-white/20 px-5 py-3 text-sm font-medium text-slate-100 transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d9b36c]"
              >
                Turn camera off
              </button>
            ) : (
              <button
                type="button"
                onClick={() => void startCamera()}
                disabled={cameraStatus === "requesting"}
                className="rounded-full bg-[#d8b26d] px-5 py-3 text-sm font-semibold text-[#061d28] transition hover:bg-[#e2c889] disabled:cursor-wait disabled:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f1d9aa] focus-visible:ring-offset-2 focus-visible:ring-offset-[#04171d]"
              >
                {cameraStatus === "requesting"
                  ? "Waiting for permission…"
                  : "Turn camera on"}
              </button>
            )}
            <p className="self-center text-xs leading-5 text-slate-300/70">
              Camera frames stay in this browser. Nothing is saved or sent.
            </p>
          </div>

          {cameraError && (
            <p
              role="alert"
              className="mt-3 rounded-xl border border-rose-200/20 bg-rose-950/30 px-4 py-3 text-sm text-rose-100"
            >
              {cameraError}
            </p>
          )}
        </section>

        <aside className="space-y-6">
          <section
            aria-labelledby="recognition-heading"
            className="rounded-[1.7rem] border border-white/10 bg-[#081e27]/85 p-6 shadow-[0_24px_60px_rgba(3,17,25,0.35)]"
          >
            <p className="text-[0.62rem] font-medium uppercase tracking-[0.3em] text-[#d3b373]">
              Movement
            </p>
            <h2
              id="recognition-heading"
              className="mt-2 text-xl font-semibold text-[#f8f1e6]"
            >
              Let your body lead
            </h2>
            <div className="mt-4 flex items-center gap-3 rounded-2xl border border-amber-200/20 bg-amber-100/5 px-4 py-3">
              <span
                aria-hidden="true"
                className="h-2.5 w-2.5 rounded-full bg-[#d8b26d]"
              />
              <p className="text-sm font-medium text-[#f4dfb1]">
                {recognitionStatus === "loading"
                  ? "Loading movement recognition"
                  : recognitionStatus === "ready"
                    ? detectedGesture
                      ? `Gesture detected: ${detectedClass}`
                      : "Ready for movement"
                    : recognitionStatus === "error"
                      ? "Movement recognition unavailable"
                      : "Turn on the camera to begin"}
              </p>
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-200/75">
              {recognitionStatus === "ready"
                ? detectedGesture
                  ? `The model recognized ${detectedClass} at ${Math.round(
                      confidence * 100,
                    )}% confidence. ${
                      audioActive
                        ? "Its landscape sound is active."
                        : "Begin listening to hear this gesture."
                    }`
                  : "Raise your right arm, left arm, or both arms and hold the gesture briefly."
                : "The local Teachable Machine model recognizes right arm, left arm, and both arms. Camera frames are processed in this browser only."}
            </p>
            <p
              className="mt-3 text-xs leading-5 text-slate-300/75"
              aria-live="polite"
            >
              Recognition:{" "}
              {recognitionStatus === "loading"
                ? "loading model"
                : recognitionStatus === "ready"
                  ? "active"
                  : recognitionStatus === "error"
                    ? "error"
                    : "inactive"}
              {detectedClass && !detectedGesture
                ? ` — hold ${detectedClass} steady to confirm`
                : ""}
            </p>
            {recognitionError && (
              <p
                role="alert"
                className="mt-3 rounded-xl border border-rose-200/20 bg-rose-950/30 px-4 py-3 text-sm text-rose-100"
              >
                {recognitionError}
              </p>
            )}
          </section>

          <section
            aria-labelledby="variant-heading"
            className="rounded-[1.7rem] border border-white/10 bg-[#081e27]/85 p-6 shadow-[0_24px_60px_rgba(3,17,25,0.35)]"
          >
            <label
              htmlFor="environment-variant"
              id="variant-heading"
              className="text-[0.62rem] font-medium uppercase tracking-[0.3em] text-[#d3b373]"
            >
              Choose a variation
            </label>
            <select
              id="environment-variant"
              value={selectedVariant.id}
              onChange={(event) => setVariantId(event.target.value)}
              className="mt-3 w-full rounded-xl border border-white/15 bg-[#061820] px-4 py-3 text-sm text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d9b36c]"
            >
              {ecosystem.variants.map((variant) => (
                <option key={variant.id} value={variant.id}>
                  {variant.name}
                </option>
              ))}
            </select>
            <p className="mt-3 text-sm leading-6 text-slate-200/70">
              {selectedVariant.description}
            </p>
          </section>

          <section
            aria-labelledby="sound-heading"
            className="rounded-[1.7rem] border border-white/10 bg-[#081e27]/85 p-6 shadow-[0_24px_60px_rgba(3,17,25,0.35)]"
          >
            <p className="text-[0.62rem] font-medium uppercase tracking-[0.3em] text-[#d3b373]">
              Landscape soundscape
            </p>
            <h2
              id="sound-heading"
              className="mt-2 text-xl font-semibold text-[#f8f1e6]"
            >
              Listen to this landscape
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-200/75">
              {usesGestureRecordings
                ? "Recognized gestures play the supplied birds, rain and crickets recordings. These are creative sound assets, not NASA recordings or measurements."
                : "A quiet, procedural Web Audio texture changes with the selected ecosystem and variation. It is an artistic synthesis, not NASA data."}
            </p>

            <div
              className="mt-5 flex h-10 items-center gap-1.5"
              role="img"
              aria-label={
                audioActive
                  ? "Sound is active"
                  : "Sound is currently off"
              }
            >
              {Array.from({ length: 20 }, (_, index) => (
                <span
                  key={index}
                  className={`sound-bar h-3 flex-1 rounded-full bg-[#9fd3c1] ${
                    audioActive ? "sound-bar-active" : ""
                  }`}
                  style={{ animationDelay: `${index * 45}ms` }}
                />
              ))}
            </div>

            <div className="mt-4 flex flex-wrap gap-3">
              {audioActive ? (
                <button
                  type="button"
                  onClick={() => void stopAudio()}
                  className="rounded-full border border-white/20 px-5 py-3 text-sm font-medium text-slate-100 transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d9b36c]"
                >
                  Stop sound
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => void startAudio()}
                  disabled={audioStarting}
                  className="rounded-full bg-[#d8b26d] px-5 py-3 text-sm font-semibold text-[#061d28] transition hover:bg-[#e2c889] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f1d9aa] focus-visible:ring-offset-2 focus-visible:ring-offset-[#081e27]"
                >
                  {audioStarting ? "Tuning the sound…" : "Begin listening"}
                </button>
              )}
            </div>

            <label
              htmlFor="sound-volume"
              className="mt-5 flex items-center justify-between gap-4 text-sm text-slate-200/80"
            >
              Volume
              <input
                id="sound-volume"
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={(event) => setVolume(Number(event.target.value))}
                className="w-36 accent-[#d8b26d]"
              />
            </label>

            {audioError && (
              <p
                role="alert"
                className="mt-3 rounded-xl border border-rose-200/20 bg-rose-950/30 px-4 py-3 text-sm text-rose-100"
              >
                {audioError}
              </p>
            )}
          </section>

          <section
            aria-labelledby="gesture-ideas-heading"
            className="rounded-[1.7rem] border border-white/10 bg-[#081e27]/55 p-6"
          >
            <h2
              id="gesture-ideas-heading"
              className="text-[0.62rem] font-medium uppercase tracking-[0.3em] text-[#d3b373]"
            >
              Proposed movement palette
            </h2>
            <ul className="mt-4 space-y-3">
              {Object.values(ecosystem.gestures).map((sound) => (
                <li
                  key={sound.label}
                  className="border-l border-[#d8b26d]/50 pl-3"
                >
                  <p className="text-sm font-medium text-slate-100">
                    {sound.label}
                  </p>
                  <p className="mt-1 text-xs leading-5 text-slate-300/70">
                    {sound.description}
                  </p>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs leading-5 text-slate-300/60">
              The model classifies these three gestures locally. Their sound
              associations are creative settings, not scientific measurements.
            </p>
          </section>
        </aside>
      </div>
    </main>
  );
}
