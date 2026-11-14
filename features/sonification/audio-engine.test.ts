import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { SonificationEngine } from "./audio-engine";
import { getEcosystem } from "../ecosystems/catalog";

class FakeAudioParam {
  cancelScheduledValues = vi.fn();
  setTargetAtTime = vi.fn();
  setValueAtTime = vi.fn();
}

class FakeAudioNode {
  connect = vi.fn();
}

class FakeGainNode extends FakeAudioNode {
  gain = new FakeAudioParam();
}

class FakeOscillatorNode extends FakeAudioNode {
  frequency = new FakeAudioParam();
  type = "";
  start = vi.fn();
  stop = vi.fn();
}

class FakeBufferSourceNode extends FakeAudioNode {
  buffer: AudioBuffer | null = null;
  loop = false;
  onended: (() => void) | null = null;
  start = vi.fn();
  stop = vi.fn();
}

class FakeBiquadFilterNode extends FakeAudioNode {
  frequency = new FakeAudioParam();
  type = "";
}

class FakeAudioContext {
  static instances: FakeAudioContext[] = [];

  currentTime = 0;
  sampleRate = 8000;
  destination = new FakeAudioNode();
  gains: FakeGainNode[] = [];
  sources: FakeBufferSourceNode[] = [];
  decodeAudioData = vi.fn(
    async () => ({}) as unknown as AudioBuffer,
  );
  resume = vi.fn(async () => undefined);
  close = vi.fn(async () => undefined);

  constructor() {
    FakeAudioContext.instances.push(this);
  }

  createGain(): GainNode {
    const node = new FakeGainNode();
    this.gains.push(node);
    return node as unknown as GainNode;
  }

  createOscillator(): OscillatorNode {
    return new FakeOscillatorNode() as unknown as OscillatorNode;
  }

  createBiquadFilter(): BiquadFilterNode {
    return new FakeBiquadFilterNode() as unknown as BiquadFilterNode;
  }

  createBufferSource(): AudioBufferSourceNode {
    const node = new FakeBufferSourceNode();
    this.sources.push(node);
    return node as unknown as AudioBufferSourceNode;
  }

  createBuffer(
    _numberOfChannels: number,
    length: number,
    sampleRate: number,
  ): AudioBuffer {
    return {
      getChannelData: () => new Float32Array(length),
      sampleRate,
    } as unknown as AudioBuffer;
  }
}

describe("SonificationEngine audio samples", () => {
  beforeEach(() => {
    FakeAudioContext.instances = [];
    vi.stubGlobal("AudioContext", FakeAudioContext);
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({
        ok: true,
        arrayBuffer: async () => new ArrayBuffer(8),
      })),
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("loops a gesture recording and restores the synthesized bed when released", async () => {
    const forest = getEcosystem("forest");
    if (!forest) {
      throw new Error("Forest ecosystem is missing.");
    }

    const engine = new SonificationEngine();
    await engine.start(forest.variants[0]);
    await engine.setGesture("rightArm", forest.gestures.rightArm);

    const context = FakeAudioContext.instances[0];
    const sample = context.sources[1];
    expect(fetch).toHaveBeenCalledWith(forest.gestures.rightArm.audioUrl);
    expect(context.decodeAudioData).toHaveBeenCalledOnce();
    expect(sample.loop).toBe(true);
    expect(sample.start).toHaveBeenCalledOnce();
    expect(context.gains[1].gain.setTargetAtTime).toHaveBeenLastCalledWith(
      0,
      0,
      0.12,
    );

    await engine.setGesture(null);
    expect(sample.stop).toHaveBeenCalledOnce();
    expect(context.gains[1].gain.setTargetAtTime).toHaveBeenLastCalledWith(
      1,
      0,
      0.12,
    );
  });

  it("reports a missing sound file and keeps the synthesized sound available", async () => {
    const forest = getEcosystem("forest");
    if (!forest) {
      throw new Error("Forest ecosystem is missing.");
    }

    vi.mocked(fetch).mockResolvedValue({
      ok: false,
      status: 404,
    } as Response);

    const engine = new SonificationEngine();
    await engine.start(forest.variants[0]);

    await expect(
      engine.setGesture("rightArm", forest.gestures.rightArm),
    ).rejects.toThrow("HTTP 404");

    const context = FakeAudioContext.instances[0];
    expect(context.gains[1].gain.setTargetAtTime).toHaveBeenLastCalledWith(
      1,
      0,
      0.12,
    );
  });
});
