export const G = 9.81

export const CW_MIN = 200
export const CW_MAX = 2500
export const ANGLE_MIN = 5
export const ANGLE_MAX = 85

export const PIVOT = { x: 0, y: 7 }
export const LONG_ARM = 9
export const SHORT_ARM = 3
export const REST_ARM_DEG = 215
export const RELEASE_ARM_DEG = 80
export const FOLLOW_ARM_DEG = 55

export const PROJECTILE_RADIUS = 0.9

const PROJECTILE_MASS = 15
const ARM_DROP = 4
const EFFICIENCY = 0.25

const toRad = (deg) => (deg * Math.PI) / 180

export const armTip = (deg, length = LONG_ARM) => ({
  x: PIVOT.x + length * Math.cos(toRad(deg)),
  y: PIVOT.y + length * Math.sin(toRad(deg))
})

export const RELEASE_POINT = armTip(RELEASE_ARM_DEG)

// Counterweight potential energy → projectile kinetic energy, with a flat efficiency loss.
export const launchSpeed = (counterweight) =>
  Math.sqrt((2 * EFFICIENCY * counterweight * G * ARM_DROP) / PROJECTILE_MASS)

export const flatRange = (counterweight, angle) => {
  const v = launchSpeed(counterweight)
  return (v * v * Math.sin(2 * toRad(angle))) / G
}

export const createShot = ({ angle, counterweight, wind = 0 }) => {
  const v = launchSpeed(counterweight)
  const theta = toRad(angle)
  return {
    x: RELEASE_POINT.x,
    y: RELEASE_POINT.y,
    vx: v * Math.cos(theta),
    vy: v * Math.sin(theta),
    wind,
    t: 0,
    apex: RELEASE_POINT.y,
    trail: [{ x: RELEASE_POINT.x, y: RELEASE_POINT.y }],
    sinceTrail: 0
  }
}

export const stepShot = (shot, dt) => {
  shot.vx += shot.wind * dt
  shot.vy -= G * dt
  shot.x += shot.vx * dt
  shot.y += shot.vy * dt
  shot.t += dt
  if (shot.y > shot.apex) shot.apex = shot.y
  shot.sinceTrail += dt
  if (shot.sinceTrail >= 0.04) {
    shot.trail.push({ x: shot.x, y: shot.y })
    shot.sinceTrail = 0
  }
}

const touches = (shot, rect) => {
  const r = PROJECTILE_RADIUS
  return shot.x + r >= rect.x && shot.x - r <= rect.x + rect.w && shot.y - r <= rect.h
}

export const checkImpact = (shot, level) => {
  if (touches(shot, level.target)) return { outcome: "target" }
  const obstacle = level.obstacles.find((o) => touches(shot, o))
  if (obstacle) return { outcome: "obstacle", obstacle }
  if (shot.y <= 0) return { outcome: "ground" }
  if (shot.x > level.worldWidth + 60 || shot.x < -40) return { outcome: "out" }
  return null
}

export const describeImpact = (shot, impact) => ({
  ...impact,
  x: shot.x,
  y: Math.max(0, shot.y),
  distance: Math.max(0, shot.x),
  apex: shot.apex,
  flightTime: shot.t,
  descent: (Math.atan2(-shot.vy, Math.abs(shot.vx)) * 180) / Math.PI
})

export const simulateShot = (params, level, dt = 1 / 120, maxT = 40) => {
  const shot = createShot({ ...params, wind: level.wind })
  while (shot.t < maxT) {
    stepShot(shot, dt)
    const impact = checkImpact(shot, level)
    if (impact) return describeImpact(shot, impact)
  }
  return describeImpact(shot, { outcome: "out" })
}

export const solveLevel = (level, { angleStep = 2, cwStep = 50 } = {}) => {
  const hits = []
  for (let angle = ANGLE_MIN; angle <= ANGLE_MAX; angle += angleStep) {
    for (let counterweight = CW_MIN; counterweight <= CW_MAX; counterweight += cwStep) {
      const result = simulateShot({ angle, counterweight }, level, 1 / 90)
      if (result.outcome === "target") hits.push({ angle, counterweight, descent: result.descent })
    }
  }
  return hits
}

export const requiredDescent = (hits) => {
  if (!hits.length) return null
  const minDescent = Math.min(...hits.map((hit) => hit.descent))
  return Math.max(0, Math.floor(minDescent / 5) * 5)
}
