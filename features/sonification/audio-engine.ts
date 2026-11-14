import type {
  MotionGesture,
  SoundVariant,
  GestureSound,
} from "@/features/ecosystems/catalog";

type ActiveSound = {
  oscillator: OscillatorNode;
  overtone: OscillatorNode;
  filter: BiquadFilterNode;
  synthGain: GainNode;
  textureGain: GainNode;
  textureSource: AudioBufferSourceNode;
};

type ActiveSample = {
  gain: GainNode;
  source: AudioBufferSourceNode;
};

export class SonificationEngine {
  private context: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private activeSound: ActiveSound | null = null;
  private activeSample: ActiveSample | null = null;
  private variant: SoundVariant | null = null;
  private gestureSound: GestureSound | null = null;
  private sampleSelected = false;
  private gestureRequestId = 0;
  private readonly audioBufferCache = new WeakMap<
    AudioContext,
    Map<string, Promise<AudioBuffer>>
  >();
  private volume = 0.35;

  async start(variant: SoundVariant): Promise<void> {
    await this.stop();

    const context = new AudioContext();
    const masterGain = context.createGain();
    const oscillator = context.createOscillator();
    const overtone = context.createOscillator();
    const filter = context.createBiquadFilter();
    const synthGain = context.createGain();
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

    oscillator.connect(synthGain);
    overtone.connect(synthGain);
    textureSource.connect(filter);
    filter.connect(textureGain);
    textureGain.connect(synthGain);
    synthGain.connect(masterGain);
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
      synthGain,
      textureGain,
      textureSource,
    };
    this.variant = variant;
    this.gestureSound = null;
    this.sampleSelected = false;

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

  async setGesture(
    gesture: MotionGesture | null,
    sound?: GestureSound,
  ): Promise<void> {
    const context = this.context;
    const masterGain = this.masterGain;
    if (!context || !masterGain || !this.activeSound) {
      return;
    }

    const nextSound = gesture === null ? null : sound ?? null;
    if (
      this.sampleSelected &&
      this.gestureSound?.audioUrl === nextSound?.audioUrl
    ) {
      return;
    }

    this.gestureSound = nextSound;
    const requestId = ++this.gestureRequestId;

    if (!nextSound?.audioUrl) {
      this.sampleSelected = false;
      this.applySound(nextSound);
      this.fadeOutActiveSample(context);
      return;
    }

    try {
      const buffer = await this.loadAudioBuffer(context, nextSound.audioUrl);
      if (
        requestId !== this.gestureRequestId ||
        this.context !== context ||
        this.gestureSound?.audioUrl !== nextSound.audioUrl
      ) {
        return;
      }

      this.fadeOutActiveSample(context);
      this.sampleSelected = true;
      this.applySound(nextSound);

      const source = context.createBufferSource();
      const gain = context.createGain();
      source.buffer = buffer;
      source.loop = true;
      gain.gain.setValueAtTime(0, context.currentTime);
      source.connect(gain);
      gain.connect(masterGain);
      source.start();
      gain.gain.setTargetAtTime(1, context.currentTime, 0.12);
      this.activeSample = { gain, source };
      source.onended = () => {
        if (this.activeSample?.source === source) {
          this.activeSample = null;
        }
      };
    } catch (error) {
      if (requestId !== this.gestureRequestId || this.context !== context) {
        return;
      }

      this.fadeOutActiveSample(context);
      this.sampleSelected = false;
      this.applySound(this.gestureSound);
      throw error;
    }
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
    const activeSample = this.activeSample;

    this.context = null;
    this.masterGain = null;
    this.activeSound = null;
    this.activeSample = null;
    this.variant = null;
    this.gestureSound = null;
    this.sampleSelected = false;
    this.gestureRequestId += 1;

    if (!context || !masterGain || !activeSound) {
      return;
    }

    const stopAt = context.currentTime + 0.4;
    masterGain.gain.setTargetAtTime(0, context.currentTime, 0.08);
    activeSound.oscillator.stop(stopAt);
    activeSound.overtone.stop(stopAt);
    activeSound.textureSource.stop(stopAt);
    activeSample?.source.stop(stopAt);

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

    this.activeSound.synthGain.gain.setTargetAtTime(
      this.sampleSelected ? 0 : 1,
      now,
      0.12,
    );
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

  private fadeOutActiveSample(context: AudioContext): void {
    const activeSample = this.activeSample;
    if (!activeSample) {
      return;
    }

    this.activeSample = null;
    activeSample.gain.gain.cancelScheduledValues(context.currentTime);
    activeSample.gain.gain.setTargetAtTime(
      0,
      context.currentTime,
      0.08,
    );
    activeSample.source.stop(context.currentTime + 0.4);
  }

  private loadAudioBuffer(
    context: AudioContext,
    audioUrl: string,
  ): Promise<AudioBuffer> {
    let contextCache = this.audioBufferCache.get(context);
    if (!contextCache) {
      contextCache = new Map<string, Promise<AudioBuffer>>();
      this.audioBufferCache.set(context, contextCache);
    }

    let bufferPromise = contextCache.get(audioUrl);
    if (!bufferPromise) {
      bufferPromise = fetch(audioUrl)
        .then((response) => {
          if (!response.ok) {
            throw new Error(
              `Failed to load sound "${audioUrl}" (HTTP ${response.status}).`,
            );
          }
          return response.arrayBuffer();
        })
        .then((data) => context.decodeAudioData(data));
      contextCache.set(audioUrl, bufferPromise);
      void bufferPromise.catch(() => contextCache.delete(audioUrl));
    }

    return bufferPromise;
  }
}
