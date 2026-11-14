export type EcosystemSlug =
  | "forest"
  | "ocean"
  | "atmosphere"
  | "desert"
  | "jungle"
  | "savanna"
  | "polar";

export type MotionGesture = "rightArm" | "leftArm" | "bothArms";

export type GestureSound = {
  label: string;
  description: string;
  frequencyMultiplier: number;
  brightnessMultiplier: number;
  textureLevel: number;
};

export type SoundVariant = {
  id: string;
  name: string;
  description: string;
  baseFrequencyHz: number;
  brightnessHz: number;
  textureLevel: number;
  visualTint: string;
};

export type Ecosystem = {
  slug: EcosystemSlug;
  name: string;
  description: string;
  image: string;
  accent: string;
  variants: SoundVariant[];
  gestures: Record<MotionGesture, GestureSound>;
};

const gesture = (
  label: string,
  description: string,
  frequencyMultiplier: number,
  brightnessMultiplier: number,
  textureLevel: number,
): GestureSound => ({
  label,
  description,
  frequencyMultiplier,
  brightnessMultiplier,
  textureLevel,
});

export const ecosystems: Ecosystem[] = [
  {
    slug: "forest",
    name: "Forest",
    description:
      "A breathing canopy of leaves, quiet weather and layered life.",
    image:
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=900&q=80",
    accent: "border-[#9fd3c1]/40 bg-[#9fd3c1]/10 text-[#d8f4e6]",
    variants: [
      {
        id: "day",
        name: "Forest by day",
        description: "Warm light through a living canopy.",
        baseFrequencyHz: 174,
        brightnessHz: 2400,
        textureLevel: 0.12,
        visualTint: "rgba(80, 126, 91, 0.28)",
      },
      {
        id: "night",
        name: "Forest at night",
        description: "A quieter, deeper forest atmosphere.",
        baseFrequencyHz: 110,
        brightnessHz: 1050,
        textureLevel: 0.08,
        visualTint: "rgba(22, 42, 68, 0.42)",
      },
      {
        id: "rain",
        name: "Rainy forest",
        description: "A soft, rain-like synthetic texture.",
        baseFrequencyHz: 147,
        brightnessHz: 3200,
        textureLevel: 0.2,
        visualTint: "rgba(49, 91, 111, 0.38)",
      },
    ],
    gestures: {
      rightArm: gesture(
        "Right arm",
        "A soft, airy canopy tone.",
        1.2,
        1.35,
        0.65,
      ),
      leftArm: gesture(
        "Left arm",
        "A bright, delicate forest texture.",
        1.55,
        1.8,
        0.9,
      ),
      bothArms: gesture(
        "Both arms",
        "A fuller blend of canopy and forest texture.",
        0.9,
        1.7,
        1.35,
      ),
    },
  },
  {
    slug: "ocean",
    name: "Ocean",
    description:
      "A changing blue world shaped by currents, depth and motion.",
    image:
      "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=900&q=80",
    accent: "border-[#7cb9d8]/40 bg-[#7cb9d8]/10 text-[#dff7ff]",
    variants: [
      {
        id: "calm",
        name: "Calm ocean",
        description: "Slow, low tones beneath a quiet surface.",
        baseFrequencyHz: 98,
        brightnessHz: 900,
        textureLevel: 0.1,
        visualTint: "rgba(28, 91, 117, 0.32)",
      },
      {
        id: "rough",
        name: "Restless ocean",
        description: "A broader, brighter synthetic sea texture.",
        baseFrequencyHz: 130,
        brightnessHz: 2500,
        textureLevel: 0.22,
        visualTint: "rgba(25, 73, 113, 0.4)",
      },
      {
        id: "deep",
        name: "Deep ocean",
        description: "A muted, spacious underwater atmosphere.",
        baseFrequencyHz: 73,
        brightnessHz: 620,
        textureLevel: 0.07,
        visualTint: "rgba(8, 28, 65, 0.5)",
      },
    ],
    gestures: {
      rightArm: gesture(
        "Right arm",
        "A low, flowing current tone.",
        0.82,
        0.8,
        0.55,
      ),
      leftArm: gesture(
        "Left arm",
        "A delicate, bubbling synthetic texture.",
        1.4,
        1.5,
        1.05,
      ),
      bothArms: gesture(
        "Both arms",
        "A wider blend of deep tone and surface texture.",
        1.05,
        1.3,
        1.45,
      ),
    },
  },
  {
    slug: "atmosphere",
    name: "Atmosphere",
    description:
      "Clouds, light and moving air gathered into one changing sky.",
    image:
      "https://images.unsplash.com/photo-1534088568595-a066f410bcda?auto=format&fit=crop&w=900&q=80",
    accent: "border-[#b9d8e6]/40 bg-[#b9d8e6]/10 text-[#e9f8ff]",
    variants: [
      {
        id: "clear",
        name: "Clear sky",
        description: "Open, bright tones and a light airy layer.",
        baseFrequencyHz: 196,
        brightnessHz: 2700,
        textureLevel: 0.08,
        visualTint: "rgba(89, 153, 182, 0.24)",
      },
      {
        id: "wind",
        name: "High wind",
        description: "A stronger, wider synthetic air texture.",
        baseFrequencyHz: 147,
        brightnessHz: 1900,
        textureLevel: 0.22,
        visualTint: "rgba(69, 119, 144, 0.38)",
      },
      {
        id: "storm",
        name: "Storm clouds",
        description: "Lower tones with a denser atmospheric layer.",
        baseFrequencyHz: 82,
        brightnessHz: 1450,
        textureLevel: 0.25,
        visualTint: "rgba(39, 49, 76, 0.5)",
      },
    ],
    gestures: {
      rightArm: gesture(
        "Right arm",
        "A gently shifting air tone.",
        1.1,
        1.25,
        0.7,
      ),
      leftArm: gesture(
        "Left arm",
        "A brighter, rain-like synthetic texture.",
        0.9,
        1.8,
        1.15,
      ),
      bothArms: gesture(
        "Both arms",
        "A full blend of air tone and atmospheric texture.",
        0.75,
        1.65,
        1.5,
      ),
    },
  },
  {
    slug: "desert",
    name: "Desert",
    description:
      "A wide, quiet landscape of heat, wind and open horizons.",
    image:
      "https://images.unsplash.com/photo-1509316785289-025f5b846b35?auto=format&fit=crop&w=900&q=80",
    accent: "border-[#d6b778]/40 bg-[#d6b778]/10 text-[#f5e4ba]",
    variants: [
      {
        id: "morning",
        name: "Desert morning",
        description: "A clear, warm tone before the day grows bright.",
        baseFrequencyHz: 165,
        brightnessHz: 1800,
        textureLevel: 0.07,
        visualTint: "rgba(188, 132, 72, 0.28)",
      },
      {
        id: "gusts",
        name: "Passing gusts",
        description: "A brighter, wind-like synthetic texture.",
        baseFrequencyHz: 123,
        brightnessHz: 2800,
        textureLevel: 0.2,
        visualTint: "rgba(162, 103, 56, 0.35)",
      },
      {
        id: "night",
        name: "Desert night",
        description: "A low, open soundscape beneath a cool sky.",
        baseFrequencyHz: 92,
        brightnessHz: 720,
        textureLevel: 0.05,
        visualTint: "rgba(33, 39, 78, 0.45)",
      },
    ],
    gestures: {
      rightArm: gesture(
        "Right arm",
        "A broad, wind-like synthetic tone.",
        1.25,
        1.4,
        0.75,
      ),
      leftArm: gesture(
        "Left arm",
        "A fine-grained, sand-like texture.",
        0.8,
        1.9,
        1.2,
      ),
      bothArms: gesture(
        "Both arms",
        "A wide blend of desert tone and texture.",
        1.05,
        1.6,
        1.45,
      ),
    },
  },
  {
    slug: "jungle",
    name: "Jungle",
    description:
      "A dense green world alive with overlapping layers and movement.",
    image:
      "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=900&q=80",
    accent: "border-[#8fbd83]/40 bg-[#8fbd83]/10 text-[#e0f2d6]",
    variants: [
      {
        id: "day",
        name: "Jungle by day",
        description: "A lively, bright synthetic canopy atmosphere.",
        baseFrequencyHz: 185,
        brightnessHz: 2900,
        textureLevel: 0.16,
        visualTint: "rgba(38, 104, 60, 0.32)",
      },
      {
        id: "rain",
        name: "Jungle rain",
        description: "A denser, rain-like synthetic texture.",
        baseFrequencyHz: 138,
        brightnessHz: 3100,
        textureLevel: 0.24,
        visualTint: "rgba(32, 80, 87, 0.42)",
      },
      {
        id: "night",
        name: "Jungle at night",
        description: "A deeper, softer layered atmosphere.",
        baseFrequencyHz: 104,
        brightnessHz: 1000,
        textureLevel: 0.1,
        visualTint: "rgba(20, 42, 51, 0.48)",
      },
    ],
    gestures: {
      rightArm: gesture(
        "Right arm",
        "A broad, leafy canopy tone.",
        1.2,
        1.25,
        0.75,
      ),
      leftArm: gesture(
        "Left arm",
        "A bright, layered synthetic texture.",
        1.6,
        1.9,
        1.15,
      ),
      bothArms: gesture(
        "Both arms",
        "A dense blend of canopy and layered texture.",
        0.95,
        1.8,
        1.55,
      ),
    },
  },
  {
    slug: "savanna",
    name: "Savanna",
    description:
      "Open grasslands where light, wind and distant life shape the horizon.",
    image:
      "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=900&q=80",
    accent: "border-[#dfc47f]/40 bg-[#dfc47f]/10 text-[#fff1c8]",
    variants: [
      {
        id: "morning",
        name: "Savanna morning",
        description: "A warm, open tone with a light texture.",
        baseFrequencyHz: 156,
        brightnessHz: 2000,
        textureLevel: 0.08,
        visualTint: "rgba(192, 154, 76, 0.3)",
      },
      {
        id: "wind",
        name: "Grassland wind",
        description: "A more pronounced wind-like synthetic layer.",
        baseFrequencyHz: 123,
        brightnessHz: 2300,
        textureLevel: 0.18,
        visualTint: "rgba(143, 127, 62, 0.34)",
      },
      {
        id: "dusk",
        name: "Savanna dusk",
        description: "A deeper, softer horizon at the end of day.",
        baseFrequencyHz: 110,
        brightnessHz: 950,
        textureLevel: 0.09,
        visualTint: "rgba(92, 63, 66, 0.4)",
      },
    ],
    gestures: {
      rightArm: gesture(
        "Right arm",
        "A gentle, open grassland tone.",
        1.15,
        1.3,
        0.7,
      ),
      leftArm: gesture(
        "Left arm",
        "A light, rustling synthetic texture.",
        1.45,
        1.7,
        1.05,
      ),
      bothArms: gesture(
        "Both arms",
        "A broader blend of grassland tone and texture.",
        0.95,
        1.6,
        1.4,
      ),
    },
  },
  {
    slug: "polar",
    name: "Polar regions",
    description:
      "A vast, fragile world of ice, water and extreme seasonal light.",
    image:
      "https://images.unsplash.com/photo-1517299321609-52687d1bc55a?auto=format&fit=crop&w=900&q=80",
    accent: "border-[#a9d8e7]/40 bg-[#a9d8e7]/10 text-[#e5faff]",
    variants: [
      {
        id: "still",
        name: "Polar stillness",
        description: "A quiet, low synthetic tone with little texture.",
        baseFrequencyHz: 82,
        brightnessHz: 780,
        textureLevel: 0.04,
        visualTint: "rgba(100, 158, 177, 0.3)",
      },
      {
        id: "wind",
        name: "Polar wind",
        description: "A wider, airy synthetic layer over a low tone.",
        baseFrequencyHz: 110,
        brightnessHz: 2100,
        textureLevel: 0.18,
        visualTint: "rgba(86, 141, 168, 0.38)",
      },
      {
        id: "night",
        name: "Polar night",
        description: "A deep, cool atmosphere with a muted texture.",
        baseFrequencyHz: 65,
        brightnessHz: 560,
        textureLevel: 0.05,
        visualTint: "rgba(39, 46, 105, 0.48)",
      },
    ],
    gestures: {
      rightArm: gesture(
        "Right arm",
        "A low, glacial synthetic tone.",
        0.82,
        0.85,
        0.5,
      ),
      leftArm: gesture(
        "Left arm",
        "A fine, icy synthetic texture.",
        1.45,
        1.6,
        0.9,
      ),
      bothArms: gesture(
        "Both arms",
        "A wider blend of glacial tone and texture.",
        1.05,
        1.45,
        1.35,
      ),
    },
  },
];

export function getEcosystem(slug: string): Ecosystem | undefined {
  return ecosystems.find((ecosystem) => ecosystem.slug === slug);
}

export function getVariant(
  ecosystem: Ecosystem,
  variantId: string,
): SoundVariant {
  const variant = ecosystem.variants.find(
    (candidate) => candidate.id === variantId,
  );
  if (!variant) {
    throw new RangeError(
      `Unknown variant "${variantId}" for ecosystem "${ecosystem.slug}".`,
    );
  }
  return variant;
}
