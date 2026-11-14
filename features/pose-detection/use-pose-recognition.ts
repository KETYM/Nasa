"use client";

import { useEffect, useState } from "react";
import type { RefObject } from "react";
import type { CustomPoseNet } from "@teachablemachine/pose";
import type { MotionGesture } from "../ecosystems/catalog";
import {
  getRecognizedGesture,
  GestureStabilizer,
  type PoseGestureMapping,
} from "./gesture-mapping";

const MODEL_URL = "/models/earth-pose/model.json";
const METADATA_URL = "/models/earth-pose/metadata.json";
export const poseRecognitionConfig = {
  confidenceThreshold: 0.78,
  stableForMs: 220,
  cooldownMs: 650,
  predictionIntervalMs: 100,
  inputSize: 200,
} as const;

export const poseClassMapping: PoseGestureMapping = {
  "Brazo derecho": "rightArm",
  "brazo izquierdo": "leftArm",
  "Ambos brazos": "bothArms",
};

export type PoseRecognitionStatus =
  | "idle"
  | "loading"
  | "ready"
  | "error";

function disposeModel(model: CustomPoseNet): void {
  model.model.dispose();
  model.dispose();
}

export function usePoseRecognition(
  videoRef: RefObject<HTMLVideoElement | null>,
  enabled: boolean,
) {
  const [status, setStatus] = useState<PoseRecognitionStatus>("idle");
  const [gesture, setGesture] = useState<MotionGesture | null>(null);
  const [className, setClassName] = useState<string | null>(null);
  const [confidence, setConfidence] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    let cancelled = false;
    let timeoutId: number | undefined;
    let model: CustomPoseNet | null = null;
    let lastEmittedGesture: MotionGesture | null = null;
    const stabilizer = new GestureStabilizer({
      confidenceThreshold: poseRecognitionConfig.confidenceThreshold,
      stableForMs: poseRecognitionConfig.stableForMs,
      cooldownMs: poseRecognitionConfig.cooldownMs,
    });
    const inferenceCanvas = document.createElement("canvas");
    inferenceCanvas.width = poseRecognitionConfig.inputSize;
    inferenceCanvas.height = poseRecognitionConfig.inputSize;
    const inferenceContext = inferenceCanvas.getContext("2d");

    const schedulePrediction = () => {
      timeoutId = window.setTimeout(() => {
        void predict();
      }, poseRecognitionConfig.predictionIntervalMs);
    };

    const predict = async () => {
      const currentModel = model;
      const video = videoRef.current;
      if (cancelled || !currentModel) {
        return;
      }

      if (!video || video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) {
        schedulePrediction();
        return;
      }

      try {
        if (!inferenceContext) {
          throw new Error("Could not initialize the local inference canvas.");
        }

        const cropSize = Math.min(video.videoWidth, video.videoHeight);
        const cropX = (video.videoWidth - cropSize) / 2;
        const cropY = (video.videoHeight - cropSize) / 2;
        inferenceContext.save();
        inferenceContext.setTransform(
          -1,
          0,
          0,
          1,
          poseRecognitionConfig.inputSize,
          0,
        );
        inferenceContext.drawImage(
          video,
          cropX,
          cropY,
          cropSize,
          cropSize,
          0,
          0,
          poseRecognitionConfig.inputSize,
          poseRecognitionConfig.inputSize,
        );
        inferenceContext.restore();

        const { posenetOutput } =
          await currentModel.estimatePose(inferenceCanvas);
        const predictions = await currentModel.predict(posenetOutput);
        if (cancelled) {
          return;
        }

        const strongestPrediction = predictions.reduce<
          (typeof predictions)[number] | null
        >(
          (strongest, prediction) =>
            strongest === null ||
            prediction.probability > strongest.probability
              ? prediction
              : strongest,
          null,
        );
        const recognizedGesture = getRecognizedGesture(
          predictions,
          poseClassMapping,
          poseRecognitionConfig.confidenceThreshold,
        );
        const nextGesture = stabilizer.observe(
          recognizedGesture,
          strongestPrediction?.probability ?? 0,
          performance.now(),
        );

        setClassName(
          strongestPrediction &&
            strongestPrediction.probability >=
              poseRecognitionConfig.confidenceThreshold
            ? strongestPrediction.className
            : null,
        );
        setConfidence(strongestPrediction?.probability ?? 0);

        if (nextGesture !== lastEmittedGesture) {
          lastEmittedGesture = nextGesture;
          setGesture(nextGesture);
        }

        schedulePrediction();
      } catch {
        if (!cancelled) {
          if (model) {
            disposeModel(model);
            model = null;
          }
          setStatus("error");
          setError(
            "Movement recognition stopped because the pose model could not process a camera frame.",
          );
        }
      }
    };

    const loadModel = async () => {
      try {
        const teachablePose = await import("@teachablemachine/pose");
        if (cancelled) {
          return;
        }
        setStatus("loading");
        setGesture(null);
        setClassName(null);
        setConfidence(0);
        setError(null);
        const loadedModel = await teachablePose.load(MODEL_URL, METADATA_URL);
        if (cancelled) {
          disposeModel(loadedModel);
          return;
        }

        const labels = loadedModel.getClassLabels();
        const expectedLabels = Object.keys(poseClassMapping);
        if (
          labels.length !== expectedLabels.length ||
          expectedLabels.some((label) => !labels.includes(label))
        ) {
          disposeModel(loadedModel);
          throw new Error(
            "The pose model labels do not match the configured gesture mapping.",
          );
        }

        model = loadedModel;
        setStatus("ready");
        schedulePrediction();
      } catch (loadError) {
        if (!cancelled) {
          setStatus("error");
          setError(
            loadError instanceof Error
              ? `Could not load the local pose model: ${loadError.message}`
              : "Could not load the local pose model.",
          );
        }
      }
    };

    void loadModel();

    return () => {
      cancelled = true;
      if (timeoutId !== undefined) {
        window.clearTimeout(timeoutId);
      }
      stabilizer.reset();
      if (model) {
        disposeModel(model);
        model = null;
      }
    };
  }, [enabled, videoRef]);

  return {
    className: enabled ? className : null,
    confidence: enabled ? confidence : 0,
    error: enabled ? error : null,
    gesture: enabled ? gesture : null,
    status: enabled && status === "idle" ? "loading" : enabled ? status : "idle",
  };
}
