import { describe, expect, it } from "vitest";
import {
  getGestureAnnouncement,
  getLandscapeFromVoiceCommand,
  getLandscapeVoicePrompt,
} from "./voice-commands";

describe("voice commands", () => {
  it.each([
    ["Forest", "forest"],
    ["quiero ir al bosque", "forest"],
    ["ocean", "ocean"],
    ["el océano", "ocean"],
    ["atmosphere", "atmosphere"],
    ["atmósfera", "atmosphere"],
    ["desierto", "desert"],
    ["jungle", "jungle"],
    ["sabana", "savanna"],
    ["polar regions", "polar"],
    ["regiones polares", "polar"],
  ] as const)("maps %s to %s", (transcript, expected) => {
    expect(getLandscapeFromVoiceCommand(transcript)).toBe(expected);
  });

  it("does not navigate on an unrecognized phrase", () => {
    expect(getLandscapeFromVoiceCommand("reproducir música")).toBeNull();
  });

  it("reads every landscape and announces each recognized movement in Spanish", () => {
    const prompt = getLandscapeVoicePrompt();

    expect(prompt).toContain("forest");
    expect(prompt).toContain("ocean");
    expect(prompt).toContain("atmosphere");
    expect(prompt).toContain("desert");
    expect(prompt).toContain("jungle");
    expect(prompt).toContain("savanna");
    expect(prompt).toContain("polar regions");
    expect(getGestureAnnouncement("rightArm")).toBe(
      "Se detectó brazo derecho.",
    );
    expect(getGestureAnnouncement("leftArm")).toBe(
      "Se detectó brazo izquierdo.",
    );
    expect(getGestureAnnouncement("bothArms")).toBe(
      "Se detectaron ambos brazos.",
    );
  });
});
