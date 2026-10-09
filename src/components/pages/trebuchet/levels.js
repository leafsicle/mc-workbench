import { solveLevel } from "./physics"

export const LEVELS = [
  {
    id: "open-field",
    name: "Open Field",
    brief: "A lonely tent. No walls, no wind, no excuses.",
    worldWidth: 200,
    wind: 0,
    obstacles: [],
    target: { x: 120, w: 12, h: 7, kind: "tent", label: "tent" }
  },
  {
    id: "over-the-wall",
    name: "Over the Wall",
    brief: "The town wall is in the way. Clear it, then drop onto the house.",
    worldWidth: 220,
    wind: 0,
    obstacles: [{ x: 95, w: 6, h: 20, kind: "wall", label: "town wall" }],
    target: { x: 128, w: 14, h: 9, kind: "house", label: "house" }
  },
  {
    id: "long-shot",
    name: "Long Shot",
    brief: "The keep is way out back, and there's a headwind.",
    worldWidth: 320,
    wind: -1.2,
    obstacles: [{ x: 70, w: 6, h: 16, kind: "wall", label: "outer wall" }],
    target: { x: 270, w: 18, h: 16, kind: "keep", label: "keep" }
  },
  {
    id: "courtyard",
    name: "Courtyard",
    brief: "Get over the wall but land short of the guild hall. There's a tailwind.",
    worldWidth: 260,
    wind: 0.9,
    obstacles: [
      { x: 115, w: 6, h: 24, kind: "wall", label: "curtain wall" },
      { x: 168, w: 16, h: 36, kind: "building", label: "guild hall" }
    ],
    target: { x: 140, w: 14, h: 6, kind: "hut", label: "stable" }
  },
  {
    id: "tucked-in",
    name: "Tucked In",
    brief: "The hut hides right behind the bell tower. You need to drop in steeply.",
    worldWidth: 230,
    wind: 0,
    obstacles: [{ x: 140, w: 12, h: 36, kind: "tower", label: "bell tower" }],
    target: { x: 160, w: 14, h: 7, kind: "hut", label: "hut" }
  },
  {
    id: "cathedral-shadow",
    name: "Cathedral Shadow",
    brief:
      "The chapel sits right behind the cathedral. Lob it high and drop it nearly straight down.",
    worldWidth: 290,
    wind: -0.6,
    obstacles: [
      { x: 90, w: 22, h: 22, kind: "building", label: "market hall" },
      { x: 196, w: 16, h: 44, kind: "tower", label: "cathedral" }
    ],
    target: { x: 222, w: 15, h: 9, kind: "house", label: "chapel" }
  }
]

const mulberry32 = (seed) => {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const between = (rand, min, max) => min + rand() * (max - min)
const round = (value, step = 1) => Math.round(value / step) * step

const buildRandomLevel = (seed) => {
  const rand = mulberry32(seed)
  const worldWidth = round(between(rand, 220, 320), 10)
  const target = {
    x: round(between(rand, worldWidth * 0.45, worldWidth - 34)),
    w: round(between(rand, 10, 16)),
    h: round(between(rand, 6, 13)),
    kind: rand() > 0.5 ? "house" : "hut",
    label: "target"
  }
  const obstacles = []

  if (target.x > 90 && rand() > 0.2) {
    obstacles.push({
      x: round(between(rand, 45, target.x - 45)),
      w: round(between(rand, 5, 7)),
      h: round(between(rand, 12, 26)),
      kind: "wall",
      label: "wall"
    })
  }

  if (rand() > 0.3) {
    const w = round(between(rand, 10, 18))
    obstacles.push({
      x: target.x - w - round(between(rand, 3, 9)),
      w,
      h: round(between(rand, 24, 52)),
      kind: rand() > 0.5 ? "tower" : "building",
      label: "tower"
    })
  }

  return {
    id: `random-${seed}`,
    name: "Random Siege",
    brief: "A new town every time. Good luck.",
    worldWidth,
    wind: round(between(rand, -1.5, 1.5), 0.1),
    obstacles,
    target
  }
}

export const generateSiege = (seed = Date.now()) => {
  for (let attempt = 0; attempt < 40; attempt++) {
    const level = buildRandomLevel(seed + attempt * 7919)
    if (solveLevel(level, { angleStep: 3, cwStep: 75 }).length > 0) return level
  }
  return LEVELS[0]
}
