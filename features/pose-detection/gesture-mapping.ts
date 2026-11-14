import type { MotionGesture } from "@/features/ecosystems/catalog";

export type PosePrediction = {
  className: string;
  probability: number;
};

export type PoseGestureMapping = Readonly<Record<string, MotionGesture>>;

export function getRecognizedGesture(
  predictions: readonly PosePrediction[],
  classMapping: PoseGestureMapping,
  confidenceThreshold: number,
): MotionGesture | null {
  const strongestPrediction = predictions.reduce<PosePrediction | null>(
    (strongest, prediction) =>
      Number.isFinite(prediction.probability) &&
      prediction.probability >= 0 &&
      prediction.probability <= 1 &&
      (strongest === null ||
        prediction.probability > strongest.probability)
        ? prediction
        : strongest,
    null,
  );

  if (
    !strongestPrediction ||
    strongestPrediction.probability < confidenceThreshold
  ) {
    return null;
  }

  return classMapping[strongestPrediction.className] ?? null;
}

export type GestureStabilizerOptions = {
  confidenceThreshold: number;
  stableForMs: number;
  cooldownMs: number;
};

const defaultOptions: GestureStabilizerOptions = {
  confidenceThreshold: 0.78,
  stableForMs: 220,
  cooldownMs: 650,
};

export class GestureStabilizer {
  private readonly options: GestureStabilizerOptions;
  private candidate: MotionGesture | null = null;
  private candidateSince = 0;
  private activeGesture: MotionGesture | null = null;
  private lastActivation = Number.NEGATIVE_INFINITY;

  constructor(options: Partial<GestureStabilizerOptions> = {}) {
    this.options = { ...defaultOptions, ...options };
    if (
      !Number.isFinite(this.options.confidenceThreshold) ||
      this.options.confidenceThreshold < 0 ||
      this.options.confidenceThreshold > 1 ||
      !Number.isFinite(this.options.stableForMs) ||
      this.options.stableForMs < 0 ||
      !Number.isFinite(this.options.cooldownMs) ||
      this.options.cooldownMs < 0
    ) {
      throw new RangeError("Gesture stabilizer options are out of range.");
    }
  }

  observe(
    gesture: MotionGesture | null,
    confidence: number,
    now: number,
  ): MotionGesture | null {
    if (
      gesture === null ||
      !Number.isFinite(confidence) ||
      confidence < this.options.confidenceThreshold ||
      confidence > 1
    ) {
      this.candidate = null;
      this.activeGesture = null;
      return null;
    }

    if (gesture !== this.candidate) {
      this.candidate = gesture;
      this.candidateSince = now;
      this.activeGesture = null;
      return null;
    }

    if (now - this.candidateSince < this.options.stableForMs) {
      return this.activeGesture;
    }

    if (now - this.lastActivation < this.options.cooldownMs) {
      return this.activeGesture;
    }

    this.activeGesture = gesture;
    this.lastActivation = now;
    return this.activeGesture;
  }

  reset(): void {
    this.candidate = null;
    this.activeGesture = null;
    this.lastActivation = Number.NEGATIVE_INFINITY;
  }
}
