// Audio Manager for Interactions and Quiz Mode
// Plays custom audio files from /audio/interactions/ and /audio/quiz/
// with synthesized Web Audio API fallbacks so sound always works out of the box!

type InteractionType = 'click' | 'hold' | 'correct' | 'wrong' | 'restart';

let audioCtx: AudioContext | null = null;

const getAudioContext = (): AudioContext | null => {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
};

// Cache for tested audio file availability
const audioFileStatus: Record<string, boolean | null> = {};

// Synthesized fallback sounds using Web Audio API
const playSynthSound = (type: InteractionType) => {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'click') {
      // Crisp subtle vintage click
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(320, now + 0.04);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
      osc.start(now);
      osc.stop(now + 0.04);
    } else if (type === 'hold') {
      // Rising ethereal sweep for holding cards
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(360, now);
      osc.frequency.exponentialRampToValueAtTime(680, now + 0.35);
      gain.gain.setValueAtTime(0.02, now);
      gain.gain.linearRampToValueAtTime(0.12, now + 0.25);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);
      osc.start(now);
      osc.stop(now + 0.38);
    } else if (type === 'correct') {
      // Cheerful retro two-tone success chord
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.connect(gain2);
      gain2.connect(ctx.destination);

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.setValueAtTime(659.25, now + 0.1); // E5

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(783.99, now + 0.1); // G5
      gain2.gain.setValueAtTime(0.001, now);
      gain2.gain.setValueAtTime(0.12, now + 0.1);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

      osc.start(now);
      osc2.start(now + 0.1);
      osc.stop(now + 0.35);
      osc2.stop(now + 0.4);
    } else if (type === 'wrong') {
      // Soft gentle buzzy error tone
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.linearRampToValueAtTime(140, now + 0.18);
      gain.gain.setValueAtTime(0.09, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
      osc.start(now);
      osc.stop(now + 0.2);
    } else if (type === 'restart') {
      // Retro tape rewind / sweep tone
      osc.type = 'sine';
      osc.frequency.setValueAtTime(720, now);
      osc.frequency.exponentialRampToValueAtTime(280, now + 0.25);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      osc.start(now);
      osc.stop(now + 0.25);
    }
  } catch {
    // Audio Context not ready or blocked
  }
};

/**
 * Plays an interaction sound (e.g. click, hold, correct, wrong, restart).
 * Checks `/audio/interactions/${type}.mp3` first; falls back to Web Audio synth.
 */
export const playInteractionSound = (type: InteractionType = 'click') => {
  if (typeof window === 'undefined') return;

  const audioPath = `/audio/interactions/${type}.mp3`;

  // If already verified missing, go straight to synthesized sound
  if (audioFileStatus[audioPath] === false) {
    playSynthSound(type);
    return;
  }

  try {
    const audio = new Audio(audioPath);
    audio.volume = type === 'click' ? 0.3 : 0.5;

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          audioFileStatus[audioPath] = true;
        })
        .catch(() => {
          audioFileStatus[audioPath] = false;
          playSynthSound(type);
        });
    }
  } catch {
    playSynthSound(type);
  }
};

// ==========================================
// QUIZ MODE BACKGROUND MUSIC
// ==========================================

let quizAudioElement: HTMLAudioElement | null = null;
let quizSynthOscillators: { osc: OscillatorNode; gain: GainNode }[] = [];
let isQuizMusicActive = false;
let isQuizMutedState = false;

// Check stored mute state
if (typeof window !== 'undefined') {
  try {
    isQuizMutedState = localStorage.getItem('ppa_quiz_muted') === 'true';
  } catch {}
}

const quizCandidates = [
  '/audio/quiz/quiz-bgm.mp3',
  '/audio/quiz/music.mp3',
  '/audio/quiz/quiz.mp3',
  '/audio/quiz/theme.mp3',
];

const startSynthQuizAmbient = () => {
  stopSynthQuizAmbient();
  const ctx = getAudioContext();
  if (!ctx || isQuizMutedState) return;

  try {
    // Gentle 2000s retro museum quiz thinking ambient arpeggiator/pad
    const rootNotes = [261.63, 329.63, 392.0, 523.25]; // C major chord notes
    const now = ctx.currentTime;

    rootNotes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      // Low, gentle ambient presence (volume around 0.015 - 0.02)
      gain.gain.setValueAtTime(0.012, now);

      // Subtle slow LFO pulsing
      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.1);
      quizSynthOscillators.push({ osc, gain });
    });
  } catch {}
};

const stopSynthQuizAmbient = () => {
  quizSynthOscillators.forEach(({ osc, gain }) => {
    try {
      gain.gain.linearRampToValueAtTime(0.0001, gain.context.currentTime + 0.2);
      setTimeout(() => osc.stop(), 250);
    } catch {}
  });
  quizSynthOscillators = [];
};

/**
 * Starts Quiz Mode Background Music.
 * Loops continuously until stopped.
 */
export const startQuizMusic = () => {
  if (typeof window === 'undefined') return;
  isQuizMusicActive = true;

  if (isQuizMutedState) return;

  // Try candidate audio files
  let currentCandidateIdx = 0;

  const tryPlayCandidate = () => {
    if (!isQuizMusicActive || currentCandidateIdx >= quizCandidates.length) {
      // If no file found in folder, start gentle ambient synth
      if (isQuizMusicActive && !quizAudioElement) {
        startSynthQuizAmbient();
      }
      return;
    }

    const src = quizCandidates[currentCandidateIdx];
    const audio = new Audio(src);
    audio.loop = true;
    audio.volume = 0.35;

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          // Successfully playing user's custom quiz music!
          quizAudioElement = audio;
          stopSynthQuizAmbient();
        })
        .catch(() => {
          // File not found or failed, try next candidate
          currentCandidateIdx++;
          tryPlayCandidate();
        });
    } else {
      currentCandidateIdx++;
      tryPlayCandidate();
    }
  };

  tryPlayCandidate();
};

/**
 * Stops Quiz Mode Background Music.
 */
export const stopQuizMusic = () => {
  isQuizMusicActive = false;

  if (quizAudioElement) {
    try {
      quizAudioElement.pause();
      quizAudioElement.currentTime = 0;
    } catch {}
    quizAudioElement = null;
  }

  stopSynthQuizAmbient();
};

/**
 * Toggles Mute for Quiz Mode music.
 */
export const toggleQuizMusicMute = (): boolean => {
  isQuizMutedState = !isQuizMutedState;
  try {
    localStorage.setItem('ppa_quiz_muted', String(isQuizMutedState));
  } catch {}

  if (isQuizMutedState) {
    if (quizAudioElement) {
      quizAudioElement.muted = true;
    }
    stopSynthQuizAmbient();
  } else {
    if (quizAudioElement) {
      quizAudioElement.muted = false;
      quizAudioElement.play().catch(() => {});
    } else if (isQuizMusicActive) {
      startQuizMusic();
    }
  }

  return isQuizMutedState;
};

export const getIsQuizMuted = (): boolean => isQuizMutedState;
