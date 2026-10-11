import { getTextures, hash } from "./textures"

// Sprites are drawn in "texels": 16 texels = 1 block, same density as the block textures.

let tint = null
const tintCache = new Map()

const mix = (hex, target, amount) => {
  const key = `${hex}|${target}|${amount}`
  if (tintCache.has(key)) return tintCache.get(key)
  const parse = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16))
  const a = parse(hex)
  const b = parse(target)
  const out = `rgb(${a.map((v, i) => Math.round(v + (b[i] - v) * amount)).join(",")})`
  tintCache.set(key, out)
  return out
}

const box = (ctx, x, y, w, h, color) => {
  ctx.fillStyle = tint ? mix(color, tint.color, tint.amount) : color
  ctx.fillRect(x, y, w, h)
}

const limb = (ctx, px, py, angle, draw) => {
  ctx.save()
  ctx.translate(px, py)
  ctx.rotate(angle)
  draw()
  ctx.restore()
}

const begin = (ctx, sx, sy, scale, facing = 1, hurt = false) => {
  ctx.save()
  ctx.translate(sx, sy)
  ctx.scale(scale * facing, scale)
  tint = hurt ? { color: "#ff2020", amount: 0.55 } : null
}

const end = (ctx) => {
  tint = null
  ctx.restore()
}

const easeOut = (t) => 1 - Math.pow(1 - t, 3)

const drawSword = (ctx) => {
  box(ctx, -0.5, -1, 1, 3, "#6b4a2a")
  box(ctx, -1.5, 2, 3, 1, "#2a7f86")
  box(ctx, -1, 3, 2, 9, "#4ee2ec")
  box(ctx, -1, 3, 1, 9, "#b4f7fb")
  box(ctx, -0.5, 12, 1, 1.5, "#4ee2ec")
}

export const drawSteve = (ctx, sx, sy, scale, pose) => {
  const { facing, walk, moving, airborne, attack, hurt } = pose
  begin(ctx, sx, sy, scale, facing, hurt)
  const swing = moving ? Math.sin(walk * 2.4) * 0.8 : 0
  const legSwing = airborne ? 0.55 : swing

  limb(ctx, 0, -10, -legSwing, () => {
    box(ctx, -2, 0, 4, 10, "#2f2a7a")
    box(ctx, -2, 8, 4, 2, "#3a3a3a")
  })
  limb(ctx, 0, -19.5, legSwing * 0.8, () => {
    box(ctx, -2, 0, 4, 3, "#0f8a8a")
    box(ctx, -2, 3, 4, 7, "#a77b5f")
  })

  box(ctx, -2, -20, 4, 10, "#00a8a8")
  box(ctx, 1, -20, 1, 10, "#00bcbc")

  limb(ctx, 0, -10, legSwing, () => {
    box(ctx, -2, 0, 4, 10, "#3c44aa")
    box(ctx, -2, 8, 4, 2, "#4a4a4a")
  })

  box(ctx, -4, -28, 8, 8, "#c69680")
  box(ctx, -4, -28, 8, 2, "#4a2f1b")
  box(ctx, -4, -26, 3, 3, "#4a2f1b")
  box(ctx, -1, -24, 1, 2, "#a8785f")
  box(ctx, 2, -24, 1, 1, "#ffffff")
  box(ctx, 3, -24, 1, 1, "#4b3ba3")
  box(ctx, 1, -21, 3, 1, "#7a4a33")

  const armAngle = attack >= 0 ? -3.0 + (3.0 - 0.35) * easeOut(attack) : -0.25 - legSwing * 0.8
  limb(ctx, 0, -19.5, armAngle, () => {
    box(ctx, -2, 0, 4, 3, "#00a8a8")
    box(ctx, -2, 3, 4, 7, "#c69680")
    ctx.translate(0, 9)
    ctx.rotate(-0.6)
    drawSword(ctx)
  })
  end(ctx)
}

const BONE = { bone: "#d2d2d2", shade: "#a9a9a9", socket: "#2b2b2b", bow: "#7a5230" }
const WITHER = { bone: "#4a4a4a", shade: "#333333", socket: "#0b0b0b", bow: "#5e3d22" }

const drawBow = (ctx, colors) => {
  box(ctx, 0, -5, 1, 1, colors.bow)
  box(ctx, 1, -4, 1, 2, colors.bow)
  box(ctx, 2, -2, 1, 5, colors.bow)
  box(ctx, 1, 3, 1, 2, colors.bow)
  box(ctx, 0, 5, 1, 1, colors.bow)
}

export const drawSkeleton = (ctx, sx, sy, scale, pose) => {
  const { facing, walk, moving, aim, hurt, wither } = pose
  const c = wither ? WITHER : BONE
  begin(ctx, sx, sy, scale, facing, hurt)
  const swing = moving ? Math.sin(walk * 2.4) * 0.7 : 0

  limb(ctx, 0, -10, -swing, () => box(ctx, -1, 0, 2, 10, c.shade))
  if (aim < 0) limb(ctx, 0, -19.5, swing * 0.6, () => box(ctx, -1, 0, 2, 10, c.shade))

  box(ctx, -1, -20, 2, 10, c.shade)
  for (let i = 0; i < 4; i++) box(ctx, -2, -19 + i * 2, 4, 1, c.bone)

  limb(ctx, 0, -10, swing, () => box(ctx, -1, 0, 2, 10, c.bone))

  box(ctx, -4, -28, 8, 8, c.bone)
  box(ctx, -4, -28, 8, 1, c.shade)
  box(ctx, 1, -25, 2, 2, c.socket)
  box(ctx, 3, -23, 1, 1, c.socket)
  box(ctx, 0, -21, 4, 1, c.socket)

  if (aim >= 0) {
    const pull = Math.min(1, aim)
    box(ctx, 0, -20, 9, 2, c.bone)
    box(ctx, 0, -19, 9 - pull * 2, 1, c.shade)
    ctx.save()
    ctx.translate(9, -19.5)
    drawBow(ctx, c)
    ctx.restore()
    const stringX = 9 - pull * 3
    box(ctx, stringX, -24.5, 0.5, 10, "#e8e8e8")
    if (pull > 0.15) {
      box(ctx, stringX, -19.8, 8, 0.6, "#cfcfcf")
      box(ctx, stringX + 8, -20.3, 1.5, 1.6, "#8a8a8a")
    }
  } else {
    limb(ctx, 0, -19.5, -swing * 0.6, () => {
      box(ctx, -1, 0, 2, 10, c.bone)
      ctx.translate(0.5, 9)
      drawBow(ctx, c)
    })
  }
  end(ctx)
}

export const drawCreeper = (ctx, sx, sy, scale, pose) => {
  const { walk, moving, fuse, hurt, time } = pose
  const tex = getTextures()
  const flash = fuse > 0 && Math.floor(time * (6 + fuse * 14)) % 2 === 0
  ctx.save()
  ctx.translate(sx, sy)
  const swell = 1 + fuse * 0.2
  ctx.scale(scale * swell, scale * (1 + fuse * 0.08))
  const step = moving ? Math.sin(walk * 4) : 0
  ctx.drawImage(tex.creeperLeg, -4, -6 - Math.max(0, step), 4, 6)
  ctx.drawImage(tex.creeperLeg, 0, -6 - Math.max(0, -step), 4, 6)
  ctx.drawImage(tex.creeperBody, -4, -18, 8, 12)
  ctx.drawImage(tex.creeperHead, -4, -26, 8, 8)
  if (flash || hurt) {
    ctx.globalAlpha = hurt ? 0.5 : 0.65
    ctx.fillStyle = hurt ? "#ff2020" : "#ffffff"
    ctx.fillRect(-4, -26, 8, 20)
    ctx.fillRect(-4, -6, 8, 6)
  }
  ctx.restore()
}

const DIAMOND = ["..KKKK..", ".KWCCCK.", "KWCCCCCK", "KCCCCCDK", ".KCCCDK.", "..KCDK..", "...KK..."]
const DIAMOND_COLORS = { K: "#0f5960", W: "#e3fdff", C: "#5decf5", D: "#2bc3cf" }

const APPLE = [
  "....S...",
  "...SL...",
  ".GGGGGG.",
  "GWGGGGGG",
  "GGGGGGGO",
  "GGGGGGGO",
  ".GGGGGO.",
  "..GOOG.."
]
const APPLE_COLORS = { S: "#6b4a2a", L: "#4ea533", G: "#ffd24a", W: "#fff6c8", O: "#d99a1c" }

const HEART = [".KK.KK.", "KRRKRRK", "KRWRRRK", "KRRRRRK", ".KRRRK.", "..KRK..", "...K..."]
const HEART_COLORS = { K: "#1a0505", R: "#e0201b", W: "#ff9b96" }
const HEART_EMPTY = { K: "#1a0505", R: "#3a1414", W: "#3a1414" }

const drawPixels = (ctx, map, colors, x, y, px) => {
  for (let row = 0; row < map.length; row++) {
    for (let col = 0; col < map[row].length; col++) {
      const color = colors[map[row][col]]
      if (!color) continue
      ctx.fillStyle = color
      ctx.fillRect(x + col * px, y + row * px, Math.ceil(px), Math.ceil(px))
    }
  }
}

const drawSpinning = (ctx, map, colors, cx, cy, px, spin) => {
  const squash = Math.max(0.15, Math.abs(Math.cos(spin)))
  ctx.save()
  ctx.translate(cx, cy)
  ctx.scale(squash, 1)
  drawPixels(ctx, map, colors, (-map[0].length / 2) * px, (-map.length / 2) * px, px)
  ctx.restore()
}

export const drawDiamond = (ctx, cx, cy, px, spin) =>
  drawSpinning(ctx, DIAMOND, DIAMOND_COLORS, cx, cy, px, spin)

export const drawApple = (ctx, cx, cy, px, spin) =>
  drawSpinning(ctx, APPLE, APPLE_COLORS, cx, cy, px, spin)

export const drawHeart = (ctx, x, y, px, full) =>
  drawPixels(ctx, HEART, full ? HEART_COLORS : HEART_EMPTY, x, y, px)

export const drawDiamondIcon = (ctx, x, y, px) => drawPixels(ctx, DIAMOND, DIAMOND_COLORS, x, y, px)

// Bed, sign, torch and arrow use tile-relative texels: (sx, sy) is the tile's top-left corner.
export const drawBed = (ctx, sx, sy, scale, active) => {
  begin(ctx, sx, sy, scale)
  box(ctx, 0, 12, 2, 4, "#6b4a2a")
  box(ctx, 14, 12, 2, 4, "#6b4a2a")
  box(ctx, 0, 9, 16, 3, "#a8864f")
  box(ctx, 0, 7, 16, 3, active ? "#d22b2b" : "#a31f1f")
  box(ctx, 0, 7, 16, 1, active ? "#f05454" : "#c33232")
  box(ctx, 11, 5, 5, 3, "#f2f2f2")
  box(ctx, 11, 5, 5, 1, "#ffffff")
  end(ctx)
}

export const drawSign = (ctx, sx, sy, scale) => {
  begin(ctx, sx, sy, scale)
  box(ctx, 7, 9, 2, 7, "#6b4a2a")
  box(ctx, 1, 2, 14, 8, "#b8975c")
  box(ctx, 1, 2, 14, 1, "#cfae72")
  box(ctx, 1, 9, 14, 1, "#7d6136")
  for (let i = 0; i < 3; i++) box(ctx, 3, 4 + i * 2, 6 + ((i * 3) % 5), 1, "#4a3a22")
  end(ctx)
}

export const drawTorch = (ctx, sx, sy, scale, time) => {
  begin(ctx, sx, sy, scale)
  box(ctx, 7, 7, 2, 9, "#6b4a2a")
  const flicker = Math.floor(time * 8) % 2
  box(ctx, 6.5, 4 + flicker * 0.5, 3, 3, "#ffb32b")
  box(ctx, 7, 5, 2, 2, "#fff2a0")
  end(ctx)
}

export const drawArrow = (ctx, sx, sy, scale, angle, alpha = 1) => {
  ctx.save()
  ctx.globalAlpha = alpha
  ctx.translate(sx, sy)
  ctx.rotate(angle)
  ctx.scale(scale, scale)
  box(ctx, -7, -0.5, 12, 1, "#8a6a44")
  box(ctx, 5, -1, 2, 2, "#9a9a9a")
  box(ctx, 7, -0.5, 1, 1, "#cfcfcf")
  box(ctx, -8, -1.5, 3, 1, "#f2f2f2")
  box(ctx, -8, 0.5, 3, 1, "#f2f2f2")
  ctx.restore()
}

export const drawPortal = (ctx, sx, sy, w, h, ts, time) => {
  ctx.save()
  ctx.fillStyle = "rgba(122, 44, 214, 0.82)"
  ctx.fillRect(sx, sy, w, h)
  const px = ts / 16
  const cols = Math.ceil(w / px)
  const rows = Math.ceil(h / px)
  const frame = Math.floor(time * 10)
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const wave = Math.sin(x * 0.5 + y * 0.3 + time * 3) + Math.cos(y * 0.4 - time * 2)
      const r = hash(x, y, frame)
      if (wave > 1.1 || r < 0.05) {
        ctx.fillStyle = r < 0.5 ? "rgba(214, 160, 255, 0.85)" : "rgba(170, 90, 255, 0.9)"
        ctx.fillRect(sx + x * px, sy + y * px, Math.ceil(px), Math.ceil(px))
      }
    }
  }
  ctx.restore()
}
