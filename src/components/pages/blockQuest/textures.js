const SIZE = 16

export const hash = (x, y, seed = 0) => {
  let h =
    Math.imul(x | 0, 374761393) + Math.imul(y | 0, 668265263) + Math.imul(seed | 0, 1442695041)
  h = Math.imul(h ^ (h >>> 13), 1274126177)
  h ^= h >>> 16
  return (h >>> 0) / 4294967296
}

const pick = (palette, r) => palette[Math.min(palette.length - 1, Math.floor(r * palette.length))]

const paint = (fn, w = SIZE, h = SIZE) => {
  const canvas = document.createElement("canvas")
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext("2d")
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const color = fn(x, y)
      if (!color) continue
      ctx.fillStyle = color
      ctx.fillRect(x, y, 1, 1)
    }
  }
  return canvas
}

const DIRT = ["#866043", "#79553a", "#96704b", "#6c4c33"]
const GREEN = ["#5d9b3a", "#6fb043", "#4f8a2f", "#7cc04c"]
const STONE = ["#7d7d7d", "#888888", "#747474", "#6b6b6b", "#939393"]
const LEAVES = ["#3f8f2a", "#358024", "#4ea533", "#2e7320"]
const PLANKS = ["#a8864f", "#b08d54", "#9e7d48", "#b8975c"]
const CREEPER = ["#5fd35a", "#3fae3a", "#0f8f0c", "#86e27f", "#2c7a29", "#b5ecb0"]

const dirt = (x, y, s) => (hash(x, y, s) < 0.07 ? "#5a3f2a" : pick(DIRT, hash(x, y, s + 1)))
const stone = (x, y, s) => pick(STONE, hash(x, y, s))

const grass = () =>
  paint((x, y) => {
    const edge = 2 + Math.floor(hash(x, 0, 3) * 3)
    if (y < edge) return pick(GREEN, hash(x, y, 4))
    if (y === edge && hash(x, y, 5) < 0.5) return "#4f8a2f"
    return dirt(x, y, 7)
  })

const cobble = () => {
  const shades = ["#8a8a8a", "#7a7a7a", "#969696", "#6e6e6e"]
  const points = Array.from({ length: 7 }, (_, i) => ({
    x: hash(i, 0, 91) * SIZE,
    y: hash(i, 1, 91) * SIZE,
    shade: pick(shades, hash(i, 2, 91))
  }))
  return paint((x, y) => {
    let d1 = Infinity
    let d2 = Infinity
    let best = points[0]
    for (const p of points) {
      for (const ox of [-SIZE, 0, SIZE]) {
        for (const oy of [-SIZE, 0, SIZE]) {
          const d = Math.hypot(x + 0.5 - p.x - ox, y + 0.5 - p.y - oy)
          if (d < d1) {
            d2 = d1
            d1 = d
            best = p
          } else if (d < d2) {
            d2 = d
          }
        }
      }
    }
    if (d2 - d1 < 1.1) return "#4f4f4f"
    return hash(x, y, 93) < 0.15 ? "#a5a5a5" : best.shade
  })
}

const planks = () =>
  paint((x, y) => {
    const row = Math.floor(y / 4)
    if (y % 4 === 3) return "#6e5530"
    if (x === (row % 2 ? 4 : 12)) return "#7d6136"
    return pick(PLANKS, hash(Math.floor(x / 3) + row * 7, row, 5) * 0.6 + hash(x, y, 6) * 0.4)
  })

const log = () =>
  paint((x, y) => {
    if (x % 4 === 0) return "#4e3a22"
    return pick(["#6b5131", "#5f472b", "#765a37"], hash(x, Math.floor(y / 2), 9))
  })

const leaves = () =>
  paint((x, y) => (hash(x, y, 11) < 0.12 ? "#1d5214" : pick(LEAVES, hash(x, y, 12))))

const ORE_SPOTS = new Set(
  [
    [3, 4],
    [4, 4],
    [4, 5],
    [10, 3],
    [11, 3],
    [11, 4],
    [6, 10],
    [7, 10],
    [7, 11],
    [12, 11],
    [12, 12],
    [13, 12],
    [2, 13]
  ].map(([x, y]) => `${x},${y}`)
)

const ore = () =>
  paint((x, y) => {
    if (!ORE_SPOTS.has(`${x},${y}`)) return stone(x, y, 21)
    return hash(x, y, 22) < 0.3 ? "#e3fdff" : pick(["#5decf5", "#2bc3cf"], hash(x, y, 23))
  })

const lavaFrame = (frame) =>
  paint((x, y) => {
    const wave =
      Math.sin((x + frame * 4) * 0.55 + Math.sin((y + frame * 2) * 0.6) * 1.6) +
      Math.cos((y - frame * 3) * 0.45 + x * 0.2)
    const t = (wave + 2) / 4 + hash(x, y, 40 + frame) * 0.4 - 0.2
    if (t > 0.75) return "#ffd35a"
    if (t > 0.55) return "#ff9c23"
    if (t > 0.35) return "#f06a12"
    return "#c9440c"
  })

const noiseTile = (palette, seed, speck) =>
  paint((x, y) => {
    if (speck && hash(x, y, seed + 1) < speck.chance) return speck.color
    return pick(palette, hash(x, y, seed))
  })

const CREEPER_FACE = [
  "........",
  "........",
  ".KK..KK.",
  ".KK..KK.",
  "...KK...",
  "..KKKK..",
  "..KKKK..",
  "..K..K.."
]

const creeperPart = (w, h, seed, face) =>
  paint(
    (x, y) => {
      if (face && face[y][x] === "K") return y >= 5 ? "#1e1e1e" : "#0d0d0d"
      return pick(CREEPER, hash(x, y, seed))
    },
    w,
    h
  )

let cache = null

export const getTextures = () => {
  if (cache) return cache
  cache = {
    G: grass(),
    D: paint((x, y) => dirt(x, y, 1)),
    S: paint((x, y) => stone(x, y, 2)),
    C: cobble(),
    P: planks(),
    W: log(),
    L: leaves(),
    H: leaves(),
    B: noiseTile(["#575757", "#3b3b3b", "#777777", "#262626", "#4a4a4a"], 30),
    O: ore(),
    N: noiseTile(["#6f2a2a", "#7d3030", "#622424", "#8e3b3b"], 31, {
      chance: 0.1,
      color: "#4a1717"
    }),
    Y: noiseTile(["#f9d49c", "#e9b46a", "#ffe8b8", "#c99350", "#fff4d6"], 32),
    Q: noiseTile(["#140f22", "#1d1530", "#2a1f44", "#0d0918"], 33, {
      chance: 0.06,
      color: "#5b3d8a"
    }),
    A: noiseTile(["#dbd3a0", "#e3dcab", "#d0c793", "#c9bf88"], 34),
    lava: [0, 1, 2, 3].map(lavaFrame),
    bgStone: noiseTile(["#3a3a40", "#34343a", "#2e2e33", "#404046"], 35),
    bgNether: noiseTile(["#2a0e0e", "#331212", "#250b0b", "#3a1515"], 36),
    creeperHead: creeperPart(8, 8, 50, CREEPER_FACE),
    creeperBody: creeperPart(8, 12, 51),
    creeperLeg: creeperPart(4, 6, 52)
  }
  cache.q = cache.Q
  return cache
}
