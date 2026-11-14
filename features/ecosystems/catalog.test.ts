// Runtime validation coverage for ecosystem routes and configurable gestures.
import { describe, expect, it } from "vitest";
import {
  ecosystems,
  getEcosystem,
  getVariant,
} from "./catalog";
import {
  getRecognizedGesture,
  GestureStabilizer,
} from "../pose-detection/gesture-mapping";

describe("ecosystem catalog", () => {
  it("defines the seven independently addressable landscapes", () => {
    expect(ecosystems.map(({ slug }) => slug)).toEqual([
      "forest",
      "ocean",
      "atmosphere",
      "desert",
      "jungle",
      "savanna",
      "polar",
    ]);

    for (const ecosystem of ecosystems) {
      expect(ecosystem.variants.length).toBeGreaterThanOrEqual(3);
      expect(getEcosystem(ecosystem.slug)).toBe(ecosystem);
    }
  });

  it("selects only configured environmental variants", () => {
    const forest = getEcosystem("forest");
    if (!forest) {
      throw new Error("Forest ecosystem is missing.");
    }

    expect(getVariant(forest, "day").baseFrequencyHz).not.toBe(
      getVariant(forest, "night").baseFrequencyHz,
    );
    expect(() => getVariant(forest, "unknown")).toThrow(RangeError);
  });
});

describe("pose gesture mapping", () => {
  const verifiedTestMapping = {
    "exported-label-a": "rightArm",
    "exported-label-b": "leftArm",
    "exported-label-c": "bothArms",
  } as const;

  it("uses only explicit class mappings and the configured confidence threshold", () => {
    expect(
      getRecognizedGesture(
        [{ className: "exported-label-a", probability: 0.9 }],
        verifiedTestMapping,
        0.78,
      ),
    ).toBe("rightArm");
    expect(
      getRecognizedGesture(
        [{ className: "unmapped-label", probability: 0.99 }],
        verifiedTestMapping,
        0.78,
      ),
    ).toBeNull();
    expect(
      getRecognizedGesture(
        [{ className: "exported-label-a", probability: 0.7 }],
        verifiedTestMapping,
        0.78,
      ),
    ).toBeNull();
  });

  it("waits for a stable prediction and enforces a cooldown", () => {
    const stabilizer = new GestureStabilizer({
      confidenceThreshold: 0.8,
      stableForMs: 200,
      cooldownMs: 500,
    });

    expect(stabilizer.observe("rightArm", 0.95, 0)).toBeNull();
    expect(stabilizer.observe("rightArm", 0.95, 199)).toBeNull();
    expect(stabilizer.observe("rightArm", 0.95, 200)).toBe("rightArm");
    expect(stabilizer.observe("rightArm", 0.95, 250)).toBe("rightArm");
    expect(stabilizer.observe("leftArm", 0.95, 300)).toBeNull();
    expect(stabilizer.observe("leftArm", 0.95, 500)).toBeNull();
    expect(stabilizer.observe("leftArm", 0.95, 700)).toBe("leftArm");
    expect(stabilizer.observe(null, 0, 710)).toBeNull();
  });
});
