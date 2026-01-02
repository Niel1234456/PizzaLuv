// Simple audio synthesizer using Web Audio API
// This avoids the need for external asset files while providing rich interaction feedback

const audioContext = typeof window !== 'undefined' ? new (window.AudioContext || (window as any).webkitAudioContext)() : null;

const playTone = (freq: number, type: OscillatorType, duration: number, volume: number = 0.1) => {
  if (!audioContext) return;
  
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);
  
  gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.start();
  oscillator.stop(audioContext.currentTime + duration);
};

export const soundEffects = {
  select: () => playTone(600, 'sine', 0.1, 0.05),
  toggleOn: () => {
    if (!audioContext) return;
    const now = audioContext.currentTime;
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    
    osc.frequency.setValueAtTime(300, now);
    osc.frequency.exponentialRampToValueAtTime(600, now + 0.15);
    
    gain.gain.setValueAtTime(0.05, now);
    gain.gain.linearRampToValueAtTime(0, now + 0.15);
    
    osc.connect(gain);
    gain.connect(audioContext.destination);
    osc.start();
    osc.stop(now + 0.15);
  },
  toggleMode: () => playTone(800, 'sine', 0.1, 0.03),
  toggleOff: () => {
    if (!audioContext) return;
    const now = audioContext.currentTime;
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.exponentialRampToValueAtTime(300, now + 0.15);
    
    gain.gain.setValueAtTime(0.05, now);
    gain.gain.linearRampToValueAtTime(0, now + 0.15);
    
    osc.connect(gain);
    gain.connect(audioContext.destination);
    osc.start();
    osc.stop(now + 0.15);
  },
  confirm: () => {
    if (!audioContext) return;
    const now = audioContext.currentTime;
    
    // Chord
    [440, 554, 659].forEach((freq, i) => {
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.05, now + i * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1);
        osc.connect(gain);
        gain.connect(audioContext.destination);
        osc.start(now + i * 0.05);
        osc.stop(now + 1);
    });
  }
};