import {
  ecosystems,
  type EcosystemSlug,
  type MotionGesture,
} from "../ecosystems/catalog";

const landscapeNames: Record<EcosystemSlug, string> = {
  forest: "bosque",
  ocean: "océano",
  atmosphere: "atmósfera",
  desert: "desierto",
  jungle: "selva",
  savanna: "sabana",
  polar: "regiones polares",
};

const landscapeAliases: Record<EcosystemSlug, readonly string[]> = {
  forest: ["forest", "bosque"],
  ocean: ["ocean", "oceano", "mar"],
  atmosphere: ["atmosphere", "atmosfera"],
  desert: ["desert", "desierto"],
  jungle: ["jungle", "jungla", "selva"],
  savanna: ["savanna", "sabana"],
  polar: [
    "polar",
    "polar region",
    "polar regions",
    "region polar",
    "regiones polares",
  ],
};

function normalizeTranscript(transcript: string): string {
  return transcript
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

export function getLandscapeFromVoiceCommand(
  transcript: string,
): EcosystemSlug | null {
  const normalizedTranscript = ` ${normalizeTranscript(transcript)} `;
  const ecosystem = ecosystems.find(({ slug }) =>
    landscapeAliases[slug].some((alias) =>
      normalizedTranscript.includes(` ${normalizeTranscript(alias)} `),
    ),
  );

  return ecosystem?.slug ?? null;
}

export function getLandscapeVoiceName(slug: EcosystemSlug): string {
  return landscapeNames[slug];
}

export function getLandscapeVoicePrompt(): string {
  const options = ecosystems
    .map(
      ({ name, slug }) =>
        `${landscapeNames[slug]} o ${name.toLowerCase()}`,
    )
    .join(", ");

  return `Di el nombre de un paisaje para entrar. Puedes elegir: ${options}.`;
}

export function getGestureAnnouncement(gesture: MotionGesture): string {
  switch (gesture) {
    case "rightArm":
      return "Se detectó brazo derecho.";
    case "leftArm":
      return "Se detectó brazo izquierdo.";
    case "bothArms":
      return "Se detectaron ambos brazos.";
  }
}
