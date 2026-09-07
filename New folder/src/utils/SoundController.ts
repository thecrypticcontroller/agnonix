class SoundController {
  private ctx: AudioContext | null = null;
  private enabled: boolean = false;
  private ambientOsc: OscillatorNode | null = null;
  private ambientGain: GainNode | null = null;

  public init() {
    if (this.ctx) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    } catch {
      console.warn("Web Audio API not supported");
    }
  }

  public toggle(): boolean {
    this.enabled = !this.enabled;
    if (this.enabled) {
      this.init();
      if (this.ctx && this.ctx.state === "suspended") {
        this.ctx.resume();
      }
      this.startAmbient();
      this.playTick();
    } else {
      this.stopAmbient();
    }
    return this.enabled;
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  public playTick() {
    if (!this.enabled || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(880, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(440, this.ctx.currentTime + 0.04);
      gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.04);
    } catch {
      // Audio error suppressed
    }
  }

  public playAnomalyPulse() {
    if (!this.enabled || !this.ctx) return;
    try {
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc1.type = "sawtooth";
      osc2.type = "triangle";
      
      osc1.frequency.setValueAtTime(140, this.ctx.currentTime);
      osc1.frequency.exponentialRampToValueAtTime(280, this.ctx.currentTime + 0.3);
      
      osc2.frequency.setValueAtTime(143, this.ctx.currentTime);
      osc2.frequency.exponentialRampToValueAtTime(285, this.ctx.currentTime + 0.3);

      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.35);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.ctx.destination);

      osc1.start();
      osc2.start();
      osc1.stop(this.ctx.currentTime + 0.35);
      osc2.stop(this.ctx.currentTime + 0.35);
    } catch {
      // Audio error suppressed
    }
  }

  public playSweep() {
    if (!this.enabled || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(220, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(660, this.ctx.currentTime + 0.2);
      gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.2);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.2);
    } catch {
      // Audio error suppressed
    }
  }

  private startAmbient() {
    if (!this.ctx) return;
    try {
      this.ambientOsc = this.ctx.createOscillator();
      this.ambientGain = this.ctx.createGain();
      this.ambientOsc.type = "sine";
      this.ambientOsc.frequency.setValueAtTime(55, this.ctx.currentTime); // Low 55Hz drone
      this.ambientGain.gain.setValueAtTime(0.015, this.ctx.currentTime);
      this.ambientOsc.connect(this.ambientGain);
      this.ambientGain.connect(this.ctx.destination);
      this.ambientOsc.start();
    } catch {
      // Audio error suppressed
    }
  }

  private stopAmbient() {
    if (this.ambientOsc) {
      try {
        this.ambientOsc.stop();
        this.ambientOsc.disconnect();
      } catch {
        // Audio error suppressed
      }
      this.ambientOsc = null;
    }
  }
}

export const sound = new SoundController();
