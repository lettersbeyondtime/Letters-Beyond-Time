import { SoundOption } from '../types';

class SoundEngine {
  private ctx: AudioContext | null = null;
  private currentOption: SoundOption = 'none';
  private masterGain: GainNode | null = null;
  private activeNodes: (AudioNode | number)[] = [];
  private intervalIds: number[] = [];
  private currentVolume = 0.3;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setVolume(volume: number) {
    this.currentVolume = Math.max(0, Math.min(1, volume));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.currentVolume, this.ctx.currentTime, 0.1);
    }
  }

  public getCurrentSound(): SoundOption {
    return this.currentOption;
  }

  public stopSound() {
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.2);
    }
    setTimeout(() => {
      this.cleanup();
      this.currentOption = 'none';
    }, 250);
  }

  private cleanup() {
    this.intervalIds.forEach((id) => clearInterval(id));
    this.intervalIds = [];

    this.activeNodes.forEach((node) => {
      if (typeof node !== 'number') {
        try {
          if ('stop' in node && typeof (node as AudioScheduledSourceNode).stop === 'function') {
            (node as AudioScheduledSourceNode).stop();
          }
          node.disconnect();
        } catch {
          // ignore cleanup errors
        }
      }
    });
    this.activeNodes = [];
    this.masterGain = null;
  }

  public playSound(option: SoundOption, volume = 0.3) {
    this.initContext();
    if (!this.ctx) return;

    if (this.currentOption === option) return;

    this.stopSound();

    setTimeout(() => {
      if (!this.ctx) return;
      this.currentOption = option;
      this.currentVolume = volume;

      if (option === 'none') return;

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0;
      this.masterGain.connect(this.ctx.destination);
      this.masterGain.gain.setTargetAtTime(this.currentVolume, this.ctx.currentTime, 0.3);

      switch (option) {
        case 'rain':
          this.createRainSound();
          break;
        case 'fireplace':
          this.createFireplaceSound();
          break;
        case 'piano':
          this.createPianoAmbientSound();
          break;
        case 'ocean':
          this.createOceanSound();
          break;
        case 'birds':
          this.createBirdsSound();
          break;
        case 'cafe':
          this.createCafeSound();
          break;
        case 'wind':
          this.createWindSound();
          break;
        case 'whitenoise':
          this.createWhiteNoiseSound();
          break;
      }
    }, 300);
  }

  private createNoiseBuffer(duration = 2): AudioBuffer {
    if (!this.ctx) throw new Error('No audio context');
    const bufferSize = this.ctx.sampleRate * duration;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      data[i] = (lastOut + 0.02 * white) / 1.02; // Brown noise approximation
      lastOut = data[i];
      data[i] *= 3.5; // Gain adjustment
    }
    return buffer;
  }

  private createRainSound() {
    if (!this.ctx || !this.masterGain) return;
    const noiseBuffer = this.createNoiseBuffer(3);

    const noiseSource = this.ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    noiseSource.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 1000;

    noiseSource.connect(filter);
    filter.connect(this.masterGain);
    noiseSource.start();

    this.activeNodes.push(noiseSource, filter);

    // Random raindrops
    const interval = window.setInterval(() => {
      if (!this.ctx || !this.masterGain || this.currentOption !== 'rain') return;
      const osc = this.ctx.createOscillator();
      const dropGain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(800 + Math.random() * 600, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, this.ctx.currentTime + 0.05);

      dropGain.gain.setValueAtTime(0.02 + Math.random() * 0.03, this.ctx.currentTime);
      dropGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.05);

      osc.connect(dropGain);
      dropGain.connect(this.masterGain);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.06);
    }, 120);

    this.intervalIds.push(interval);
  }

  private createFireplaceSound() {
    if (!this.ctx || !this.masterGain) return;
    const noiseBuffer = this.createNoiseBuffer(3);

    const noiseSource = this.ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    noiseSource.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 400;
    filter.Q.value = 1.2;

    noiseSource.connect(filter);
    filter.connect(this.masterGain);
    noiseSource.start();

    this.activeNodes.push(noiseSource, filter);

    // Crackle pops
    const interval = window.setInterval(() => {
      if (!this.ctx || !this.masterGain || this.currentOption !== 'fireplace') return;
      if (Math.random() < 0.6) {
        const popSource = this.ctx.createBufferSource();
        popSource.buffer = this.createNoiseBuffer(0.1);
        const popFilter = this.ctx.createBiquadFilter();
        popFilter.type = 'highpass';
        popFilter.frequency.value = 2500;

        const popGain = this.ctx.createGain();
        popGain.gain.setValueAtTime(0.08 + Math.random() * 0.1, this.ctx.currentTime);
        popGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.03);

        popSource.connect(popFilter);
        popFilter.connect(popGain);
        popGain.connect(this.masterGain);

        popSource.start();
      }
    }, 100);

    this.intervalIds.push(interval);
  }

  private createOceanSound() {
    if (!this.ctx || !this.masterGain) return;
    const noiseBuffer = this.createNoiseBuffer(4);

    const noiseSource = this.ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    noiseSource.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 350;

    // LFO for waves
    const lfo = this.ctx.createOscillator();
    lfo.frequency.value = 0.12; // wave cycle ~8 seconds
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.value = 250;

    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);

    noiseSource.connect(filter);
    filter.connect(this.masterGain);

    noiseSource.start();
    lfo.start();

    this.activeNodes.push(noiseSource, filter, lfo, lfoGain);
  }

  private createPianoAmbientSound() {
    if (!this.ctx || !this.masterGain) return;

    const chordProgressions = [
      [261.63, 329.63, 392.00, 493.88], // Cmaj7
      [220.00, 261.63, 329.63, 392.00], // Am7
      [174.61, 220.00, 261.63, 329.63], // Fmaj7
      [196.00, 246.94, 293.66, 349.23], // G7
    ];

    let step = 0;

    const playChord = () => {
      if (!this.ctx || !this.masterGain || this.currentOption !== 'piano') return;
      const notes = chordProgressions[step % chordProgressions.length];
      step++;

      notes.forEach((freq, idx) => {
        if (!this.ctx || !this.masterGain) return;
        const osc = this.ctx.createOscillator();
        const noteGain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        const startTime = this.ctx.currentTime + idx * 0.15;
        noteGain.gain.setValueAtTime(0.0001, startTime);
        noteGain.gain.linearRampToValueAtTime(0.06, startTime + 0.2);
        noteGain.gain.exponentialRampToValueAtTime(0.0001, startTime + 3.5);

        osc.connect(noteGain);
        noteGain.connect(this.masterGain);

        osc.start(startTime);
        osc.stop(startTime + 3.6);
      });
    };

    playChord();
    const interval = window.setInterval(playChord, 4000);
    this.intervalIds.push(interval);
  }

  private createBirdsSound() {
    if (!this.ctx || !this.masterGain) return;

    // Wind background
    this.createWindSound();

    // Occasional bird chirps
    const interval = window.setInterval(() => {
      if (!this.ctx || !this.masterGain || this.currentOption !== 'birds') return;
      if (Math.random() < 0.5) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        const baseFreq = 2200 + Math.random() * 800;
        osc.type = 'sine';
        osc.frequency.setValueAtTime(baseFreq, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(baseFreq + 400, this.ctx.currentTime + 0.08);
        osc.frequency.exponentialRampToValueAtTime(baseFreq - 200, this.ctx.currentTime + 0.15);

        gain.gain.setValueAtTime(0.03, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.16);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.17);
      }
    }, 2000);

    this.intervalIds.push(interval);
  }

  private createCafeSound() {
    if (!this.ctx || !this.masterGain) return;
    const noiseBuffer = this.createNoiseBuffer(3);

    const noiseSource = this.ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    noiseSource.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 600;
    filter.Q.value = 0.8;

    noiseSource.connect(filter);
    filter.connect(this.masterGain);
    noiseSource.start();

    this.activeNodes.push(noiseSource, filter);

    // Cup clinks
    const interval = window.setInterval(() => {
      if (!this.ctx || !this.masterGain || this.currentOption !== 'cafe') return;
      if (Math.random() < 0.2) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(3200 + Math.random() * 800, this.ctx.currentTime);

        gain.gain.setValueAtTime(0.02, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.1);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.12);
      }
    }, 3000);

    this.intervalIds.push(interval);
  }

  private createWindSound() {
    if (!this.ctx || !this.masterGain) return;
    const noiseBuffer = this.createNoiseBuffer(4);

    const noiseSource = this.ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    noiseSource.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 300;
    filter.Q.value = 3.0;

    const lfo = this.ctx.createOscillator();
    lfo.frequency.value = 0.2;
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.value = 200;

    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);

    noiseSource.connect(filter);
    filter.connect(this.masterGain);

    noiseSource.start();
    lfo.start();

    this.activeNodes.push(noiseSource, filter, lfo, lfoGain);
  }

  private createWhiteNoiseSound() {
    if (!this.ctx || !this.masterGain) return;
    const noiseBuffer = this.createNoiseBuffer(2);

    const noiseSource = this.ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    noiseSource.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 1200;

    noiseSource.connect(filter);
    filter.connect(this.masterGain);
    noiseSource.start();

    this.activeNodes.push(noiseSource, filter);
  }
}

export const soundEngine = new SoundEngine();
