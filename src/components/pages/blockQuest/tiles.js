// One character per tile so levels stay readable as grids.
export const TILES = {
  ".": { solid: false },
  G: { solid: true, color: "#5d9b3a" }, // grass
  D: { solid: true, color: "#866043" }, // dirt
  S: { solid: true, color: "#7d7d7d" }, // stone
  C: { solid: true, color: "#7a7a7a" }, // cobblestone
  P: { solid: true, color: "#a8864f" }, // planks
  H: { solid: true, color: "#3f8f2a" }, // leaf block you can stand on
  B: { solid: true, color: "#3b3b3b" }, // bedrock
  O: { solid: true, color: "#5decf5" }, // diamond ore
  N: { solid: true, color: "#6f2a2a" }, // netherrack
  Y: { solid: true, color: "#f9d49c" }, // glowstone
  Q: { solid: true, color: "#1d1530" }, // obsidian
  A: { solid: true, color: "#dbd3a0" }, // sand
  q: { solid: false, color: "#1d1530" }, // portal frame (background so you can walk in)
  W: { solid: false, color: "#6b5131" }, // tree trunk (background)
  L: { solid: false, color: "#3f8f2a" }, // tree leaves (background)
  X: { solid: false, color: "#f06a12" }, // lava
  t: { solid: false, color: "#ffd35a" } // torch
}

export const isSolid = (tile) => TILES[tile]?.solid === true
export const isLava = (tile) => tile === "X"
export const tileColor = (tile) => TILES[tile]?.color ?? "#888888"

// Creeper blasts leave these alone so portals and the world floor can't be destroyed.
export const UNBREAKABLE = new Set(["B", "Q"])
