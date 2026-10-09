import { PIVOT, SHORT_ARM, PROJECTILE_RADIUS, RELEASE_POINT, armTip } from "./physics"

const COLORS = {
  skyTop: "#0f1b2b",
  skyMid: "#3b3f5c",
  skyHorizon: "#e59a5c",
  sun: "rgba(255, 214, 150, 0.9)",
  hillFar: "#2a3346",
  hillNear: "#1f2a26",
  ground: "#24301f",
  groundEdge: "#3f5a33",
  stone: "#6c7079",
  stoneDark: "#4b4f57",
  tower: "#555b68",
  building: "#5f5a52",
  window: "#f6c66b",
  windowDark: "#2c2f36",
  wood: "#8b5e34",
  woodDark: "#5e3d20",
  iron: "#3b3e44",
  target: "#9a5b3a",
  targetRoof: "#5c2e22",
  banner: "#d93a3a",
  ring: "#f4efe6",
  projectile: "#d9d4c7",
  trail: "255, 170, 90",
  ghost: "200, 220, 210"
}

const hash = (a, b) => {
  const s = Math.sin(a * 127.1 + b * 311.7) * 43758.5453
  return s - Math.floor(s)
}

export const createCamera = (level, width, height) => {
  const left = -16
  const right = level.worldWidth + 6
  const scale = width / (right - left)
  const groundY = height - Math.max(22, height * 0.08)
  return {
    width,
    height,
    scale,
    groundY,
    toX: (x) => (x - left) * scale,
    toY: (y) => groundY - y * scale
  }
}

const drawSky = (ctx, cam) => {
  const sky = ctx.createLinearGradient(0, 0, 0, cam.groundY)
  sky.addColorStop(0, COLORS.skyTop)
  sky.addColorStop(0.6, COLORS.skyMid)
  sky.addColorStop(1, COLORS.skyHorizon)
  ctx.fillStyle = sky
  ctx.fillRect(0, 0, cam.width, cam.groundY)

  const sunX = cam.width * 0.82
  const sunY = cam.groundY * 0.72
  const glow = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, cam.width * 0.18)
  glow.addColorStop(0, "rgba(255, 210, 140, 0.55)")
  glow.addColorStop(1, "rgba(255, 210, 140, 0)")
  ctx.fillStyle = glow
  ctx.fillRect(0, 0, cam.width, cam.groundY)
  ctx.fillStyle = COLORS.sun
  ctx.beginPath()
  ctx.arc(sunX, sunY, Math.max(10, cam.width * 0.028), 0, Math.PI * 2)
  ctx.fill()
}

const drawHills = (ctx, cam) => {
  const layers = [
    { color: COLORS.hillFar, amp: 0.1, base: 0.82, freq: 0.006, phase: 1.3 },
    { color: COLORS.hillNear, amp: 0.06, base: 0.92, freq: 0.011, phase: 4.1 }
  ]
  for (const layer of layers) {
    ctx.fillStyle = layer.color
    ctx.beginPath()
    ctx.moveTo(0, cam.groundY)
    for (let x = 0; x <= cam.width; x += 8) {
      const wave =
        Math.sin(x * layer.freq + layer.phase) * 0.6 +
        Math.sin(x * layer.freq * 2.3 + layer.phase) * 0.4
      ctx.lineTo(x, cam.groundY * (layer.base - layer.amp * wave))
    }
    ctx.lineTo(cam.width, cam.groundY)
    ctx.closePath()
    ctx.fill()
  }
}

const drawGround = (ctx, cam) => {
  ctx.fillStyle = COLORS.ground
  ctx.fillRect(0, cam.groundY, cam.width, cam.height - cam.groundY)
  ctx.fillStyle = COLORS.groundEdge
  ctx.fillRect(0, cam.groundY, cam.width, Math.max(2, cam.scale * 0.6))
}

const drawWindows = (ctx, cam, rect, seed) => {
  const cols = Math.max(1, Math.floor(rect.w / 4))
  const rows = Math.max(1, Math.floor(rect.h / 6))
  const cellW = rect.w / cols
  const cellH = rect.h / rows
  for (let c = 0; c < cols; c++) {
    for (let r = 1; r < rows; r++) {
      const lit = hash(seed + c, r) > 0.45
      ctx.fillStyle = lit ? COLORS.window : COLORS.windowDark
      const wx = rect.x + c * cellW + cellW * 0.32
      const wy = r * cellH + cellH * 0.25
      ctx.fillRect(
        cam.toX(wx),
        cam.toY(wy + cellH * 0.4),
        cellW * 0.36 * cam.scale,
        cellH * 0.4 * cam.scale
      )
    }
  }
}

const drawObstacle = (ctx, cam, o) => {
  const x = cam.toX(o.x)
  const y = cam.toY(o.h)
  const w = o.w * cam.scale
  const h = o.h * cam.scale

  if (o.kind === "wall") {
    ctx.fillStyle = COLORS.stone
    ctx.fillRect(x, y, w, h)
    ctx.strokeStyle = COLORS.stoneDark
    ctx.lineWidth = 1
    const course = 2.5 * cam.scale
    for (let row = 0, yy = y + course; yy < y + h; yy += course, row++) {
      ctx.beginPath()
      ctx.moveTo(x, yy)
      ctx.lineTo(x + w, yy)
      ctx.stroke()
      const offset = row % 2 ? w / 2 : w / 4
      ctx.beginPath()
      ctx.moveTo(x + offset, yy - course)
      ctx.lineTo(x + offset, yy)
      ctx.stroke()
    }
    const merlon = w / 3
    ctx.fillStyle = COLORS.stone
    for (let i = 0; i < 3; i += 2)
      ctx.fillRect(x + i * merlon, y - 2 * cam.scale, merlon, 2 * cam.scale)
    return
  }

  ctx.fillStyle = o.kind === "tower" ? COLORS.tower : COLORS.building
  ctx.fillRect(x, y, w, h)
  drawWindows(ctx, cam, o, o.x)

  if (o.kind === "tower") {
    ctx.fillStyle = COLORS.stoneDark
    ctx.beginPath()
    ctx.moveTo(x - 1.5 * cam.scale, y)
    ctx.lineTo(x + w / 2, y - Math.min(14, o.w * 0.9) * cam.scale)
    ctx.lineTo(x + w + 1.5 * cam.scale, y)
    ctx.closePath()
    ctx.fill()
  } else {
    ctx.fillStyle = COLORS.stoneDark
    ctx.fillRect(x - cam.scale, y - 1.2 * cam.scale, w + 2 * cam.scale, 1.2 * cam.scale)
  }
}

const drawTarget = (ctx, cam, target, time, destroyed) => {
  const x = cam.toX(target.x)
  const y = cam.toY(target.h)
  const w = target.w * cam.scale
  const h = target.h * cam.scale

  if (target.kind === "tent") {
    ctx.fillStyle = destroyed ? "#4a3a30" : "#c9a36b"
    ctx.beginPath()
    ctx.moveTo(x, cam.groundY)
    ctx.lineTo(x + w / 2, y)
    ctx.lineTo(x + w, cam.groundY)
    ctx.closePath()
    ctx.fill()
  } else {
    ctx.fillStyle = destroyed ? "#3f2e26" : COLORS.target
    ctx.fillRect(x, y, w, h)
    ctx.fillStyle = destroyed ? "#2a1c17" : COLORS.targetRoof
    ctx.beginPath()
    ctx.moveTo(x - cam.scale, y)
    ctx.lineTo(x + w / 2, y - Math.min(6, target.w * 0.4) * cam.scale)
    ctx.lineTo(x + w + cam.scale, y)
    ctx.closePath()
    ctx.fill()
  }

  if (destroyed) return

  const cx = x + w / 2
  const cy = target.kind === "tent" ? cam.groundY - h * 0.35 : y + h * 0.5
  const radius = Math.max(4, Math.min(w, h) * 0.32)
  for (let i = 3; i >= 1; i--) {
    ctx.fillStyle = i % 2 ? COLORS.banner : COLORS.ring
    ctx.beginPath()
    ctx.arc(cx, cy, (radius * i) / 3, 0, Math.PI * 2)
    ctx.fill()
  }

  const poleX = target.kind === "tent" ? x + w / 2 : x + w * 0.8
  const poleTop = y - (target.kind === "tent" ? 7 : 10) * cam.scale
  ctx.strokeStyle = "#d8d2c4"
  ctx.lineWidth = Math.max(1, cam.scale * 0.3)
  ctx.beginPath()
  ctx.moveTo(poleX, target.kind === "tent" ? y : y - Math.min(6, target.w * 0.4) * cam.scale * 0.4)
  ctx.lineTo(poleX, poleTop)
  ctx.stroke()

  const flagW = 5 * cam.scale
  const flagH = 3 * cam.scale
  ctx.fillStyle = COLORS.banner
  ctx.beginPath()
  ctx.moveTo(poleX, poleTop)
  for (let i = 0; i <= 8; i++) {
    const fx = poleX + (flagW * i) / 8
    const wave = Math.sin(time * 6 + i * 0.9) * flagH * 0.18 * (i / 8)
    ctx.lineTo(fx, poleTop + wave)
  }
  for (let i = 8; i >= 0; i--) {
    const fx = poleX + (flagW * i) / 8
    const wave = Math.sin(time * 6 + i * 0.9) * flagH * 0.18 * (i / 8)
    ctx.lineTo(fx, poleTop + flagH + wave)
  }
  ctx.closePath()
  ctx.fill()
}

const line = (ctx, cam, a, b, width, color) => {
  ctx.strokeStyle = color
  ctx.lineWidth = Math.max(1.5, width * cam.scale)
  ctx.lineCap = "round"
  ctx.beginPath()
  ctx.moveTo(cam.toX(a.x), cam.toY(a.y))
  ctx.lineTo(cam.toX(b.x), cam.toY(b.y))
  ctx.stroke()
}

const drawTrebuchet = (ctx, cam, armDeg, loaded) => {
  const base = [
    { x: -6, y: 0.9 },
    { x: 6, y: 0.9 }
  ]
  line(ctx, cam, base[0], base[1], 0.9, COLORS.woodDark)
  line(ctx, cam, { x: -4.5, y: 0.9 }, PIVOT, 0.7, COLORS.wood)
  line(ctx, cam, { x: 4.5, y: 0.9 }, PIVOT, 0.7, COLORS.wood)

  for (const wx of [-4.5, 4.5]) {
    ctx.fillStyle = COLORS.iron
    ctx.beginPath()
    ctx.arc(cam.toX(wx), cam.toY(0.9), Math.max(3, 0.9 * cam.scale), 0, Math.PI * 2)
    ctx.fill()
  }

  const tip = armTip(armDeg)
  const short = armTip(armDeg + 180, SHORT_ARM)
  line(ctx, cam, short, tip, 0.55, COLORS.wood)

  const cwSize = 2.6
  ctx.fillStyle = COLORS.iron
  ctx.fillRect(
    cam.toX(short.x - cwSize / 2),
    cam.toY(short.y - 0.4),
    cwSize * cam.scale,
    cwSize * cam.scale
  )
  line(ctx, cam, short, { x: short.x, y: short.y - 0.4 }, 0.2, COLORS.iron)

  ctx.fillStyle = COLORS.iron
  ctx.beginPath()
  ctx.arc(cam.toX(PIVOT.x), cam.toY(PIVOT.y), Math.max(2.5, 0.5 * cam.scale), 0, Math.PI * 2)
  ctx.fill()

  if (loaded) {
    const stone = { x: tip.x + 1.2, y: Math.max(PROJECTILE_RADIUS, tip.y - 1.6) }
    line(ctx, cam, tip, stone, 0.12, "#c9b99a")
    drawStone(ctx, cam, stone)
  }
}

const drawStone = (ctx, cam, p) => {
  ctx.fillStyle = COLORS.projectile
  ctx.beginPath()
  ctx.arc(cam.toX(p.x), cam.toY(p.y), Math.max(3, PROJECTILE_RADIUS * cam.scale), 0, Math.PI * 2)
  ctx.fill()
}

const drawTrail = (ctx, cam, points, rgb, alpha, dashed) => {
  if (points.length < 2) return
  ctx.save()
  ctx.strokeStyle = `rgba(${rgb}, ${alpha})`
  ctx.lineWidth = dashed ? 1.25 : 2
  if (dashed) ctx.setLineDash([4, 5])
  ctx.beginPath()
  ctx.moveTo(cam.toX(points[0].x), cam.toY(points[0].y))
  for (const p of points) ctx.lineTo(cam.toX(p.x), cam.toY(p.y))
  ctx.stroke()
  ctx.restore()
}

const drawAimGuide = (ctx, cam, angle, speed) => {
  const length = 6 + speed * 0.4
  const theta = (angle * Math.PI) / 180
  const end = {
    x: RELEASE_POINT.x + Math.cos(theta) * length,
    y: RELEASE_POINT.y + Math.sin(theta) * length
  }
  ctx.save()
  ctx.setLineDash([3, 4])
  line(ctx, cam, RELEASE_POINT, end, 0.25, "rgba(183, 212, 176, 0.85)")
  ctx.restore()
  ctx.fillStyle = "rgba(183, 212, 176, 0.95)"
  ctx.beginPath()
  ctx.arc(cam.toX(end.x), cam.toY(end.y), 3, 0, Math.PI * 2)
  ctx.fill()
}

const drawParticles = (ctx, cam, particles) => {
  for (const p of particles) {
    ctx.globalAlpha = Math.max(0, p.life / p.maxLife)
    ctx.fillStyle = p.color
    ctx.beginPath()
    ctx.arc(cam.toX(p.x), cam.toY(p.y), Math.max(1.5, p.size * cam.scale), 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.globalAlpha = 1
}

const drawAltitudeMarker = (ctx, cam, shot) => {
  const sx = cam.toX(shot.x)
  ctx.fillStyle = "rgba(255, 190, 120, 0.95)"
  ctx.beginPath()
  ctx.moveTo(sx, 4)
  ctx.lineTo(sx - 6, 14)
  ctx.lineTo(sx + 6, 14)
  ctx.closePath()
  ctx.fill()
  ctx.font = "600 11px Figtree, system-ui, sans-serif"
  ctx.textAlign = "center"
  ctx.fillText(`${Math.round(shot.y)}m`, sx, 28)
}

export const renderScene = (ctx, cam, level, game, controls) => {
  ctx.clearRect(0, 0, cam.width, cam.height)
  drawSky(ctx, cam)
  drawHills(ctx, cam)
  drawGround(ctx, cam)

  for (const ghost of game.ghosts) drawTrail(ctx, cam, ghost, COLORS.ghost, 0.35, true)

  level.obstacles.forEach((o) => drawObstacle(ctx, cam, o))
  drawTarget(ctx, cam, level.target, game.time, game.destroyed)

  drawTrebuchet(ctx, cam, game.arm, game.phase === "aiming")

  if (game.phase === "aiming") drawAimGuide(ctx, cam, controls.angle, controls.speed)

  if (game.phase === "swinging") drawStone(ctx, cam, armTip(game.arm))

  if (game.shot) {
    drawTrail(
      ctx,
      cam,
      [...game.shot.trail, { x: game.shot.x, y: game.shot.y }],
      COLORS.trail,
      0.9,
      false
    )
    if (game.phase === "flying") {
      drawStone(ctx, cam, game.shot)
      if (cam.toY(game.shot.y) < 0) drawAltitudeMarker(ctx, cam, game.shot)
    }
  }

  drawParticles(ctx, cam, game.particles)

  if (game.flash > 0) {
    ctx.fillStyle = `rgba(255, 230, 190, ${game.flash * 0.35})`
    ctx.fillRect(0, 0, cam.width, cam.height)
  }
}
