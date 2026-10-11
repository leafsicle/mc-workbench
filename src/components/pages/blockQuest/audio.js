let audio = null
let muted = false
let noiseBuffer = null

export const setMuted = (value) => {
  muted = value
}

const getAudio = () => {
  if (muted || typeof window === "undefined") return null
  if (!audio) {
    const AudioCtx = window.AudioContext || window.webkitAudioContext
    if (!AudioCtx) return null
    audio = new AudioCtx()
  }
  if (audio.state === "suspended") audio.resume()
  return audio
}

const tone = ({ freq, to = freq, dur, type = "square", vol = 0.1, delay = 0 }) => {
  const ac = getAudio()
  if (!ac) return
  const start = ac.currentTime + delay
  const osc = ac.createOscillator()
  const gain = ac.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(freq, start)
  osc.frequency.exponentialRampToValueAtTime(Math.max(20, to), start + dur)
  gain.gain.setValueAtTime(vol, start)
  gain.gain.exponentialRampToValueAtTime(0.0001, start + dur)
  osc.connect(gain).connect(ac.destination)
  osc.start(start)
  osc.stop(start + dur + 0.02)
}

const noise = ({
  dur,
  vol = 0.2,
  filter = 1200,
  filterTo = filter,
  type = "lowpass",
  rise = 0
}) => {
  const ac = getAudio()
  if (!ac) return
  if (!noiseBuffer) {
    noiseBuffer = ac.createBuffer(1, ac.sampleRate * 2, ac.sampleRate)
    const data = noiseBuffer.getChannelData(0)
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1
  }
  const start = ac.currentTime
  const src = ac.createBufferSource()
  src.buffer = noiseBuffer
  const biquad = ac.createBiquadFilter()
  biquad.type = type
  biquad.frequency.setValueAtTime(filter, start)
  biquad.frequency.exponentialRampToValueAtTime(Math.max(40, filterTo), start + dur)
  const gain = ac.createGain()
  if (rise) {
    gain.gain.setValueAtTime(0.0001, start)
    gain.gain.exponentialRampToValueAtTime(vol, start + rise)
  } else {
    gain.gain.setValueAtTime(vol, start)
  }
  gain.gain.exponentialRampToValueAtTime(0.0001, start + dur)
  src.connect(biquad).connect(gain).connect(ac.destination)
  src.start(start)
  src.stop(start + dur + 0.02)
}

export const sfx = {
  unlock: () => getAudio(),
  jump: () => tone({ freq: 260, to: 520, dur: 0.12, vol: 0.06 }),
  swing: () => noise({ dur: 0.12, vol: 0.12, filter: 2500, filterTo: 600, type: "bandpass" }),
  hit: () => tone({ freq: 180, to: 90, dur: 0.12, type: "sawtooth", vol: 0.1 }),
  clink: () => tone({ freq: 1400, to: 900, dur: 0.08, type: "triangle", vol: 0.1 }),
  stomp: () => tone({ freq: 220, to: 60, dur: 0.15, type: "square", vol: 0.1 }),
  poof: () => noise({ dur: 0.25, vol: 0.18, filter: 900, filterTo: 200 }),
  hurt: () => {
    tone({ freq: 330, to: 140, dur: 0.22, type: "sawtooth", vol: 0.1 })
    tone({ freq: 260, to: 110, dur: 0.22, type: "square", vol: 0.04 })
  },
  diamond: () => {
    tone({ freq: 988, dur: 0.09, type: "triangle", vol: 0.12 })
    tone({ freq: 1319, dur: 0.18, type: "triangle", vol: 0.12, delay: 0.08 })
  },
  eat: () => {
    for (let i = 0; i < 3; i++) noise({ dur: 0.06, vol: 0.12, filter: 1500 + i * 300 })
    tone({ freq: 660, to: 990, dur: 0.25, type: "triangle", vol: 0.08 })
  },
  breakBlock: () => noise({ dur: 0.18, vol: 0.2, filter: 1600, filterTo: 300 }),
  hiss: () =>
    noise({ dur: 1.4, vol: 0.12, filter: 4000, filterTo: 6000, type: "highpass", rise: 1 }),
  explode: () => {
    noise({ dur: 0.9, vol: 0.5, filter: 1200, filterTo: 60 })
    tone({ freq: 90, to: 30, dur: 0.6, type: "sine", vol: 0.35 })
  },
  bow: () => tone({ freq: 500, to: 180, dur: 0.1, type: "triangle", vol: 0.08 }),
  bed: () => {
    tone({ freq: 523, dur: 0.12, type: "triangle", vol: 0.1 })
    tone({ freq: 784, dur: 0.2, type: "triangle", vol: 0.1, delay: 0.1 })
  },
  portal: () => {
    ;[392, 523, 659, 784, 1047].forEach((freq, i) =>
      tone({ freq, dur: 0.18, type: "triangle", vol: 0.1, delay: i * 0.09 })
    )
  },
  firework: () => noise({ dur: 0.5, vol: 0.15, filter: 3000, filterTo: 200 })
}
