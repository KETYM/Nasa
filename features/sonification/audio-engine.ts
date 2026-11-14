import type {
  MotionGesture,
  SoundVariant,
  GestureSound,
} from "@/features/ecosystems/catalog";

type ActiveSound = {
  oscillator: OscillatorNode;
  overtone: OscillatorNode;
  filter: BiquadFilterNode;
  textureGain: GainNode;
  textureSource: AudioBufferSourceNode;
};

export class SonificationEngine {
  private context: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private activeSound: ActiveSound | null = null;
  private variant: SoundVariant | null = null;
  private gestureSound: GestureSound | null = null;
  private volume = 0.35;

  async start(variant: SoundVariant): Promise<void> {
    await this.stop();

    const context = new AudioContext();
    const masterGain = context.createGain();
    const oscillator = context.createOscillator();
    const overtone = context.createOscillator();
    const filter = context.createBiquadFilter();
    const textureGain = context.createGain();
    const textureSource = context.createBufferSource();

    const noiseBuffer = context.createBuffer(
      1,
      context.sampleRate * 2,
      context.sampleRate,
    );
    const noiseChannel = noiseBuffer.getChannelData(0);
    for (let index = 0; index < noiseChannel.length; index += 1) {
      noiseChannel[index] = Math.random() * 2 - 1;
    }

    masterGain.gain.setValueAtTime(0, context.currentTime);
    oscillator.type = "sine";
    overtone.type = "triangle";
    filter.type = "lowpass";
    textureSource.buffer = noiseBuffer;
    textureSource.loop = true;

    oscillator.connect(masterGain);
    overtone.connect(masterGain);
    textureSource.connect(filter);
    filter.connect(textureGain);
    textureGain.connect(masterGain);
    masterGain.connect(context.destination);

    oscillator.start();
    overtone.start();
    textureSource.start();

    this.context = context;
    this.masterGain = masterGain;
    this.activeSound = {
      oscillator,
      overtone,
      filter,
      textureGain,
      textureSource,
    };
    this.variant = variant;
    this.gestureSound = null;

    try {
      await context.resume();
    } catch (error) {
      await this.stop();
      throw error;
    }

    this.applySound(null);
    masterGain.gain.setTargetAtTime(this.volume, context.currentTime, 0.3);
  }

  updateVariant(variant: SoundVariant): void {
    this.variant = variant;
    this.applySound(this.gestureSound);
  }

  setGesture(gesture: MotionGesture | null, sound?: GestureSound): void {
    this.gestureSound = gesture === null ? null : sound ?? null;
    this.applySound(this.gestureSound);
  }

  setVolume(volume: number): void {
    this.volume = Math.min(1, Math.max(0, volume));
    if (this.context && this.masterGain) {
      this.masterGain.gain.setTargetAtTime(
        this.volume,
        this.context.currentTime,
        0.12,
      );
    }
  }

  async stop(): Promise<void> {
    const context = this.context;
    const masterGain = this.masterGain;
    const activeSound = this.activeSound;

    this.context = null;
    this.masterGain = null;
    this.activeSound = null;
    this.variant = null;
    this.gestureSound = null;

    if (!context || !masterGain || !activeSound) {
      return;
    }

    const stopAt = context.currentTime + 0.4;
    masterGain.gain.setTargetAtTime(0, context.currentTime, 0.08);
    activeSound.oscillator.stop(stopAt);
    activeSound.overtone.stop(stopAt);
    activeSound.textureSource.stop(stopAt);

    await new Promise<void>((resolve) => {
      window.setTimeout(resolve, 450);
    });
    await context.close();
  }

  private applySound(sound: GestureSound | null): void {
    if (
      !this.context ||
      !this.activeSound ||
      !this.variant
    ) {
      return;
    }

    const now = this.context.currentTime;
    const frequencyMultiplier = sound?.frequencyMultiplier ?? 1;
    const brightnessMultiplier = sound?.brightnessMultiplier ?? 1;
    const textureLevel = sound?.textureLevel ?? this.variant.textureLevel;
    const baseFrequency = this.variant.baseFrequencyHz * frequencyMultiplier;

    this.activeSound.oscillator.frequency.setTargetAtTime(
      baseFrequency,
      now,
      0.18,
    );
    this.activeSound.overtone.frequency.setTargetAtTime(
      baseFrequency * 1.5,
      now,
      0.22,
    );
    this.activeSound.filter.frequency.setTargetAtTime(
      Math.min(this.variant.brightnessHz * brightnessMultiplier, 9000),
      now,
      0.2,
    );
    this.activeSound.textureGain.gain.setTargetAtTime(
      Math.min(textureLevel * 0.16, 0.22),
      now,
      0.25,
    );
  }
}
