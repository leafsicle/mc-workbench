import { ATTACK_TIME, MAX_HEARTS } from "./engine"
import { getTextures, hash } from "./textures"
import {
  drawApple,
  drawArrow,
  drawBed,
  drawCreeper,
  drawDiamond,
  drawDiamondIcon,
  drawHeart,
  drawPortal,
  drawSign,
  drawSkeleton,
  drawSteve,
  drawTorch
} from "./sprites"

export const VIEW_TILES = 12

// Hurt tint only shows for the first moment of invulnerability, then Steve just blinks.
const INVULN_FLASH_FROM = 1.15

const THEMES = {
  day: {
    sky: ["#6ea8ff", "#b5d3ff"],
    sun: "#fff6a0",
    cloud: "rgba(255, 255, 255, 0.92)",
    hills: ["#8cc96d", "#6aa64f"],
    darkness: 0
  },
  dusk: {
    sky: ["#2e2257", "#f0905d"],
    sun: "#ffcf70",
    cloud: "rgba(255, 190, 170, 0.7)",
    hills: ["#3d4b4a", "#29352f"],
    darkness: 0.3
  },
  cave: { sky: ["#121216", "#1b1b21"], wall: "bgStone", darkness: 0.85 },
  nether: { sky: ["#2a0707", "#5a1a0e"], wall: "bgNether", darkness: 0.4 }
}

const FONT = '"Courier New", ui-monospace, monospace'
let lightCanvas = null

const clamp = (v, min, max) => Math.min(max, Math.max(min, v))

const shadowText = (ctx, text, x, y, size, color = "#ffffff", align = "left") => {
  ctx.font = `bold ${size}px ${FONT}`
  ctx.textAlign = align
  ctx.textBaseline = "top"
  const off = Math.max(1, Math.round(size / 10))
  ctx.fillStyle = "#3f3f3f"
  ctx.fillText(text, x + off, y + off)
  ctx.fillStyle = color
  ctx.fillText(text, x, y)
}

const wrapText = (ctx, text, maxWidth) => {
  const lines = []
  let line = ""
  for (const word of text.split(" ")) {
    const next = line ? `${line} ${word}` : word
    if (ctx.measureText(next).width > maxWidth && line) {
      lines.push(line)
      line = word
    } else {
      line = next
    }
  }
  if (line) lines.push(line)
  return lines
}

const updateCamera = (game, viewW, viewH, dt, attract) => {
  const maxX = Math.max(0, game.width - viewW)
  const maxY = Math.max(0, game.height - viewH)
  if (attract) {
    const span = Math.max(1, maxX)
    const t = (game.time * 1.5) % (span * 2)
    game.cam = { x: t > span ? span * 2 - t : t, y: maxY }
    return game.cam
  }
  const p = game.player
  const target = {
    x: clamp(p.x + p.w / 2 - viewW / 2 + p.facing * 1.2, 0, maxX),
    y: clamp(p.y + p.h / 2 - viewH * 0.55, 0, maxY)
  }
  if (!game.cam) {
    game.cam = target
  } else {
    const k = 1 - Math.exp(-dt * 7)
    game.cam = {
      x: game.cam.x + (target.x - game.cam.x) * k,
      y: game.cam.y + (target.y - game.cam.y) * k
    }
  }
  return game.cam
}

const drawOutdoorBackdrop = (ctx, theme, cam, ts, w, h) => {
  const sunSize = ts * 1.8
  ctx.fillStyle = theme.sun
  ctx.fillRect(Math.round(w * 0.78 - cam.x * ts * 0.03), Math.round(h * 0.12), sunSize, sunSize)

  const cloudPar = 0.2
  const first = Math.floor((cam.x * cloudPar) / 16) - 1
  const last = first + Math.ceil(w / ts / 16) + 2
  ctx.fillStyle = theme.cloud
  for (let k = first; k <= last; k++) {
    const cx = (k * 16 + hash(k, 0, 7) * 8 - cam.x * cloudPar) * ts
    const cy = (0.8 + hash(k, 1, 7) * 2.2 - cam.y * 0.2) * ts
    const cw = (4 + Math.floor(hash(k, 2, 7) * 4)) * ts
    ctx.fillRect(Math.round(cx), Math.round(cy), cw, ts * 0.7)
    ctx.fillRect(Math.round(cx + ts), Math.round(cy - ts * 0.5), cw - ts * 2, ts * 0.6)
  }

  theme.hills.forEach((color, layer) => {
    const par = 0.3 + layer * 0.2
    const cols = Math.ceil(w / ts) + 2
    const start = Math.floor(cam.x * par)
    const offset = (cam.x * par - start) * ts
    ctx.fillStyle = color
    for (let i = 0; i < cols; i++) {
      const col = start + i
      const height = Math.round(
        3 + layer * 0.5 + 2 * Math.sin(col * 0.11 + layer * 9) + 1.3 * Math.sin(col * 0.33 + layer)
      )
      const top = h - (height + 2.5 - layer) * ts * 0.8
      ctx.fillRect(Math.round(i * ts - offset), Math.round(top), ts + 1, h - top)
    }
  })
}

const drawWallBackdrop = (ctx, tex, cam, ts, w, h) => {
  const par = 0.5
  const ox = (((cam.x * par) % 1) + 1) % 1
  const oy = (((cam.y * par) % 1) + 1) % 1
  for (let y = -1; y <= Math.ceil(h / ts); y++) {
    for (let x = -1; x <= Math.ceil(w / ts); x++) {
      ctx.drawImage(tex, Math.round((x - ox) * ts), Math.round((y - oy) * ts), ts, ts)
    }
  }
}

const drawEmbers = (ctx, time, w, h, ts) => {
  ctx.fillStyle = "rgba(255, 140, 60, 0.55)"
  for (let i = 0; i < 28; i++) {
    const speed = 0.3 + hash(i, 0, 70) * 0.6
    const x = (hash(i, 1, 70) * w + Math.sin(time * 0.7 + i) * ts) % w
    const y = h - ((time * speed * ts + hash(i, 2, 70) * h) % h)
    const s = Math.max(2, ts * 0.1)
    ctx.fillRect(Math.round(x), Math.round(y), s, s)
  }
}

const drawBackdrop = (ctx, game, theme, cam, ts, w, h) => {
  const tex = getTextures()
  const sky = ctx.createLinearGradient(0, 0, 0, h)
  sky.addColorStop(0, theme.sky[0])
  sky.addColorStop(1, theme.sky[1])
  ctx.fillStyle = sky
  ctx.fillRect(0, 0, w, h)
  if (theme.hills) drawOutdoorBackdrop(ctx, theme, cam, ts, w, h)
  if (theme.wall) drawWallBackdrop(ctx, tex[theme.wall], cam, ts, w, h)
  if (game.level.theme === "nether") drawEmbers(ctx, game.time, w, h, ts)
}

const drawTiles = (ctx, game, cam, ts, w, h, toScreen) => {
  const tex = getTextures()
  const lavaFrame = tex.lava[Math.floor(game.time * 3) % tex.lava.length]
  const x0 = Math.max(0, Math.floor(cam.x))
  const x1 = Math.min(game.width - 1, Math.ceil(cam.x + w / ts))
  const y0 = Math.max(0, Math.floor(cam.y))
  const y1 = Math.min(game.height - 1, Math.ceil(cam.y + h / ts))
  const lights = []

  for (let ty = y0; ty <= y1; ty++) {
    for (let tx = x0; tx <= x1; tx++) {
      const tile = game.grid[ty][tx]
      if (tile === ".") continue
      const { x, y } = toScreen(tx, ty)
      if (tile === "t") {
        drawTorch(ctx, x, y, ts / 16, game.time)
        lights.push({ x: tx + 0.5, y: ty + 0.4, r: 4.5 })
        continue
      }
      if (tile === "X") {
        ctx.drawImage(lavaFrame, x, y, ts, ts)
        if (game.grid[ty - 1]?.[tx] !== "X") lights.push({ x: tx + 0.5, y: ty + 0.2, r: 2.2 })
        continue
      }
      const image = tex[tile]
      if (!image) continue
      ctx.drawImage(image, x, y, ts, ts)
      if (tile === "W" || tile === "L" || tile === "q") {
        ctx.fillStyle = "rgba(0, 0, 0, 0.18)"
        ctx.fillRect(x, y, ts, ts)
      }
      if (tile === "Y") lights.push({ x: tx + 0.5, y: ty + 0.5, r: 4 })
    }
  }
  return lights
}

const drawLighting = (ctx, lights, darkness, w, h, toScreen, ts) => {
  if (!lightCanvas) lightCanvas = document.createElement("canvas")
  if (lightCanvas.width !== w || lightCanvas.height !== h) {
    lightCanvas.width = w
    lightCanvas.height = h
  }
  const lc = lightCanvas.getContext("2d")
  lc.globalCompositeOperation = "source-over"
  lc.clearRect(0, 0, w, h)
  lc.fillStyle = `rgba(4, 4, 14, ${darkness})`
  lc.fillRect(0, 0, w, h)
  lc.globalCompositeOperation = "destination-out"
  for (const light of lights) {
    const { x, y } = toScreen(light.x, light.y)
    const r = light.r * ts
    const g = lc.createRadialGradient(x, y, 0, x, y, r)
    g.addColorStop(0, "rgba(0, 0, 0, 1)")
    g.addColorStop(0.45, "rgba(0, 0, 0, 0.75)")
    g.addColorStop(1, "rgba(0, 0, 0, 0)")
    lc.fillStyle = g
    lc.beginPath()
    lc.arc(x, y, r, 0, Math.PI * 2)
    lc.fill()
  }
  ctx.drawImage(lightCanvas, 0, 0, w, h)
}

const drawHud = (ctx, game, w, ts) => {
  const p = game.player
  const px = Math.max(2, Math.round(ts / 11))
  const low = p.hearts <= 1
  ctx.fillStyle = "rgba(0, 0, 0, 0.35)"
  ctx.fillRect(6, 6, MAX_HEARTS * px * 8.5 + px * 2, px * 7 + 12)
  for (let i = 0; i < MAX_HEARTS; i++) {
    const jiggle = low ? Math.round(Math.sin(game.time * 20 + i) * px * 0.6) : 0
    drawHeart(ctx, 12 + i * px * 8.5, 12 + jiggle, px, i < p.hearts)
  }

  const size = Math.max(14, Math.round(ts * 0.6))
  const label = `${game.diamonds} / ${game.totalDiamonds}`
  ctx.font = `bold ${size}px ${FONT}`
  const textW = ctx.measureText(label).width
  const iconX = w - 16 - textW - px * 9
  ctx.fillStyle = "rgba(0, 0, 0, 0.35)"
  ctx.fillRect(iconX - 6, 6, w - iconX, px * 7 + 12)
  drawDiamondIcon(ctx, iconX, 12, px)
  shadowText(ctx, label, w - 12 - textW, 12 + (px * 7 - size) / 2, size)

  if (game.time < 3.5) {
    const alpha = clamp(3.5 - game.time, 0, 1)
    ctx.globalAlpha = alpha
    shadowText(ctx, game.level.name, w / 2, ts * 1.6, Math.round(ts * 0.9), "#ffff55", "center")
    ctx.globalAlpha = 1
  }
}

const drawBubble = (ctx, text, anchorX, anchorY, w, ts) => {
  const size = Math.max(13, Math.round(ts * 0.48))
  ctx.font = `bold ${size}px ${FONT}`
  const maxWidth = Math.min(w - 40, size * 22)
  const lines = wrapText(ctx, text, maxWidth)
  const lineH = size * 1.25
  const boxW = Math.max(...lines.map((l) => ctx.measureText(l).width)) + size * 1.4
  const boxH = lines.length * lineH + size
  const x = clamp(anchorX - boxW / 2, 8, w - boxW - 8)
  const y = Math.max(8, anchorY - boxH - ts * 0.4)
  ctx.fillStyle = "rgba(16, 0, 16, 0.88)"
  ctx.fillRect(x, y, boxW, boxH)
  ctx.strokeStyle = "#5a2a9a"
  ctx.lineWidth = 2
  ctx.strokeRect(x + 1, y + 1, boxW - 2, boxH - 2)
  lines.forEach((line, i) =>
    shadowText(ctx, line, x + size * 0.7, y + size * 0.5 + i * lineH, size)
  )
}

export const renderGame = (ctx, game, w, h, dt, { attract = false } = {}) => {
  const theme = THEMES[game.level.theme] ?? THEMES.day
  const ts = Math.max(12, Math.round(h / VIEW_TILES))
  const cam = updateCamera(game, w / ts, h / ts, dt, attract)
  const shake = game.shake > 0 ? game.shake * ts * 0.35 : 0
  const sx = shake ? (Math.random() - 0.5) * shake : 0
  const sy = shake ? (Math.random() - 0.5) * shake : 0
  const camPx = { x: Math.round(cam.x * ts - sx), y: Math.round(cam.y * ts - sy) }
  const toScreen = (x, y) => ({ x: Math.round(x * ts) - camPx.x, y: Math.round(y * ts) - camPx.y })
  const scale = ts / 16

  ctx.imageSmoothingEnabled = false
  drawBackdrop(ctx, game, theme, cam, ts, w, h)
  const lights = drawTiles(ctx, game, cam, ts, w, h, toScreen)

  if (game.portal) {
    const { x, y } = toScreen(game.portal.x, game.portal.y)
    drawPortal(ctx, x, y, game.portal.w * ts, game.portal.h * ts, ts, game.time)
    lights.push({ x: game.portal.x + 1, y: game.portal.y + 2, r: 4 })
  }

  for (const bed of game.beds) {
    const { x, y } = toScreen(bed.x, bed.y)
    drawBed(ctx, x, y, scale, bed.active)
  }
  for (const sign of game.signs) {
    const { x, y } = toScreen(sign.x, sign.y)
    drawSign(ctx, x, y, scale)
  }
  for (const item of game.items) {
    const { x, y } = toScreen(item.x, item.y + Math.sin(item.phase) * 0.12)
    if (item.type === "diamond") drawDiamond(ctx, x, y, scale * 1.1, item.phase * 0.7)
    else drawApple(ctx, x, y, scale * 1.1, item.phase * 0.7)
    lights.push({ x: item.x, y: item.y, r: 1.4 })
  }

  for (const m of game.mobs) {
    const { x, y } = toScreen(m.x + m.w / 2, m.y + m.h)
    const moving = Math.abs(m.vx) > 0.1
    const hurt = m.hurtT > 0
    if (m.type === "creeper") {
      drawCreeper(ctx, x, y, scale, {
        walk: m.walk,
        moving,
        fuse: Math.min(1, m.fuse / 1.5),
        hurt,
        time: game.time
      })
    } else {
      drawSkeleton(ctx, x, y, scale, {
        facing: m.dir,
        walk: m.walk,
        moving,
        aim: m.aimT >= 0 ? m.aimT / 0.75 : -1,
        hurt,
        wither: game.level.theme === "nether"
      })
    }
  }

  const p = game.player
  const blink = p.invuln > 0 && Math.floor(game.time * 14) % 2 === 0
  if (!attract && game.state !== "dead" && !blink) {
    const { x, y } = toScreen(p.x + p.w / 2, p.y + p.h)
    const entering = game.state === "entering"
    if (entering) ctx.globalAlpha = clamp(1 - game.portalT, 0, 1)
    drawSteve(ctx, x, y, scale, {
      facing: p.facing,
      walk: p.walk,
      moving: Math.abs(p.vx) > 0.3 && p.onGround,
      airborne: !p.onGround,
      attack: p.attackT >= 0 ? Math.min(1, p.attackT / ATTACK_TIME) : -1,
      hurt: p.invuln > INVULN_FLASH_FROM
    })
    ctx.globalAlpha = 1
  }
  if (!attract) lights.push({ x: p.x + p.w / 2, y: p.y + p.h / 2, r: 5.5 })

  for (const a of game.arrows) {
    const { x, y } = toScreen(a.x, a.y)
    drawArrow(ctx, x, y, scale, a.angle ?? 0, a.stuck ? Math.min(1, a.life) : 1)
  }

  for (const pt of game.particles) {
    const { x, y } = toScreen(pt.x, pt.y)
    const size = Math.max(2, pt.size * ts * Math.min(1, (pt.life / pt.maxLife) * 1.5))
    ctx.fillStyle = pt.color
    ctx.fillRect(x - size / 2, y - size / 2, size, size)
  }

  if (theme.darkness > 0) drawLighting(ctx, lights, theme.darkness, w, h, toScreen, ts)

  if (attract) return
  drawHud(ctx, game, w, ts)

  if (game.activeSign && game.state === "playing") {
    const { x, y } = toScreen(game.activeSign.x + 0.5, game.activeSign.y)
    drawBubble(ctx, game.activeSign.text, x, y, w, ts)
  }
  if (game.toast) {
    ctx.globalAlpha = clamp(2.4 - game.toast.t, 0, 1)
    shadowText(ctx, game.toast.text, w / 2, h * 0.28, Math.round(ts * 0.6), "#ffff55", "center")
    ctx.globalAlpha = 1
  }
}
