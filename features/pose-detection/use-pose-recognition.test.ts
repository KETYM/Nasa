import { describe, expect, it } from "vitest";
import { getRecognizedGesture } from "./gesture-mapping";
import { poseClassMapping } from "./use-pose-recognition";

describe("Teachable Machine class mapping", () => {
  it.each([
    ["Brazo derecho", "rightArm"],
    ["brazo izquierdo", "leftArm"],
    ["Ambos brazos", "bothArms"],
  ] as const)("maps the exported class %s", (className, gesture) => {
    expect(
      getRecognizedGesture(
        [{ className, probability: 0.9 }],
        poseClassMapping,
        0.78,
      ),
    ).toBe(gesture);
  });

  it("does not map unknown or low-confidence classes", () => {
    expect(
      getRecognizedGesture(
        [{ className: "Unknown", probability: 0.99 }],
        poseClassMapping,
        0.78,
      ),
    ).toBeNull();
    expect(
      getRecognizedGesture(
        [{ className: "Ambos brazos", probability: 0.77 }],
        poseClassMapping,
        0.78,
      ),
    ).toBeNull();
  });
});
