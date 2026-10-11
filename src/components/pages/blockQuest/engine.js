import { isLava, isSolid, tileColor, UNBREAKABLE } from "./tiles"
import { sfx } from "./audio"

export const MAX_HEARTS = 5
export const ATTACK_TIME = 0.28

const GRAVITY = 40
const MAX_FALL = 20
const RUN_SPEED = 6.2
const GROUND_ACCEL = 70
const AIR_ACCEL = 45
const GROUND_FRICTION = 55
const AIR_FRICTION = 18
const JUMP_SPEED = 15
const COYOTE = 0.1
const JUMP_BUFFER = 0.14
const INVULN = 1.4
const ATTACK_COOLDOWN = 0.36
const STEP = 1 / 120
const ACTIVE_RANGE = 22

const PLAYER_W = 0.6
const PLAYER_H = 1.75

const CREEPER_FUSE = 1.5
const ARROW_SPEED = 8
const ARROW_GRAVITY = 4

const rand = (min, max) => min + Math.random() * (max - min)
const center = (b) => ({ x: b.x + b.w / 2, y: b.y + b.h / 2 })
const overlaps = (a, b) => a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y

const spawnBody = (x, groundRow, w, h) => ({
  x: x + 0.5 - w / 2,
  y: groundRow - h,
  w,
  h,
  vx: 0,
  vy: 0,
  onGround: false,
  hitWall: false
})

export const createGame = (level) => {
  const game = {
    level,
    grid: level.grid.map((row) => row.split("")),
    width: level.width,
    height: level.height,
    time: 0,
    accumulator: 0,
    state: "playing",
    player: null,
    checkpoint: null,
    mobs: [],
    arrows: [],
    items: [],
    beds: [],
    signs: [],
    portal: null,
    particles: [],
    diamonds: 0,
    totalDiamonds: 0,
    mobsDefeated: 0,
    activeSign: null,
    toast: null,
    shake: 0,
    portalT: 0,
    prevInput: { jump: false, attack: false },
    cam: null
  }

  for (const e of level.entities) {
    switch (e.type) {
      case "player":
        game.checkpoint = { x: e.x, y: e.y }
        game.player = {
          ...spawnBody(e.x, e.y, PLAYER_W, PLAYER_H),
          facing: 1,
          hearts: MAX_HEARTS,
          invuln: 0,
          knock: 0,
          coyote: 0,
          jumpBuffer: 0,
          attackT: -1,
          attackCd: 0,
          attackQueued: false,
          hitSet: new Set(),
          walk: 0
        }
        break
      case "creeper":
        game.mobs.push({
          ...spawnBody(e.x, e.y, 0.55, 1.6),
          type: "creeper",
          dir: -1,
          hp: 1,
          fuse: 0,
          fusing: false,
          knock: 0,
          hurtT: 0,
          walk: 0,
          alive: true
        })
        break
      case "skeleton":
        game.mobs.push({
          ...spawnBody(e.x, e.y, 0.6, 1.75),
          type: "skeleton",
          dir: -1,
          hp: 2,
          shootCd: rand(0.8, 1.6),
          aimT: -1,
          knock: 0,
          hurtT: 0,
          walk: 0,
          alive: true
        })
        break
      case "diamond":
      case "apple":
        game.items.push({ type: e.type, x: e.x + 0.5, y: e.y + 0.5, phase: Math.random() * 6 })
        if (e.type === "diamond") game.totalDiamonds += 1
        break
      case "bed":
        game.beds.push({ x: e.x, y: e.y - 1, w: 1, h: 1, active: false })
        break
      case "sign":
        game.signs.push({ x: e.x, y: e.y - 1, text: e.text })
        break
      case "portal":
        game.portal = { x: e.x, y: e.y, w: e.w, h: e.h }
        break
      default:
        break
    }
  }

  for (const row of game.grid) for (const tile of row) if (tile === "O") game.totalDiamonds += 1
  return game
}

const tileAt = (game, tx, ty) => {
  if (ty < 0 || ty >= game.height || tx < 0 || tx >= game.width) return "."
  return game.grid[ty][tx]
}

const solidAt = (game, tx, ty) => {
  if (tx < 0 || tx >= game.width) return true
  if (ty < 0 || ty >= game.height) return false
  return isSolid(game.grid[ty][tx])
}

const overlapsSolid = (game, x, y, w, h) => {
  const x0 = Math.floor(x)
  const x1 = Math.floor(x + w - 1e-4)
  const y0 = Math.floor(y)
  const y1 = Math.floor(y + h - 1e-4)
  for (let ty = y0; ty <= y1; ty++) {
    for (let tx = x0; tx <= x1; tx++) if (solidAt(game, tx, ty)) return true
  }
  return false
}

const touchesLava = (game, b) => {
  const x0 = Math.floor(b.x + 0.1)
  const x1 = Math.floor(b.x + b.w - 0.1)
  const y0 = Math.floor(b.y + 0.2)
  const y1 = Math.floor(b.y + b.h - 0.2)
  for (let ty = y0; ty <= y1; ty++) {
    for (let tx = x0; tx <= x1; tx++) if (isLava(tileAt(game, tx, ty))) return true
  }
  return false
}

const moveBody = (game, b, dt) => {
  b.hitWall = false
  b.x += b.vx * dt
  if (overlapsSolid(game, b.x, b.y, b.w, b.h)) {
    if (b.vx > 0) b.x = Math.floor(b.x + b.w - 1e-4) - b.w
    else if (b.vx < 0) b.x = Math.floor(b.x) + 1
    b.vx = 0
    b.hitWall = true
  }

  b.onGround = false
  b.y += b.vy * dt
  if (overlapsSolid(game, b.x, b.y, b.w, b.h)) {
    if (b.vy > 0) {
      b.y = Math.floor(b.y + b.h - 1e-4) - b.h
      b.onGround = true
    } else if (b.vy < 0) {
      b.y = Math.floor(b.y) + 1
    }
    b.vy = 0
  }
}

const atEdge = (game, m) => {
  const tx = Math.floor(m.dir > 0 ? m.x + m.w + 0.05 : m.x - 0.05)
  const ty = Math.floor(m.y + m.h + 0.1)
  return !solidAt(game, tx, ty)
}

const burst = (game, x, y, colors, count, { speed = 6, life = 0.8, size = 0.18, gravity = 18 }) => {
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2
    const s = Math.random() * speed
    const l = life * rand(0.5, 1.2)
    game.particles.push({
      x,
      y,
      vx: Math.cos(angle) * s,
      vy: Math.sin(angle) * s - speed * 0.3,
      life: l,
      maxLife: l,
      size: size * rand(0.6, 1.4),
      color: colors[i % colors.length],
      gravity
    })
  }
}

const poof = (game, b) => {
  const c = center(b)
  burst(game, c.x, c.y, ["#ffffff", "#e6e6e6", "#cfcfcf"], 22, {
    speed: 3,
    life: 0.9,
    size: 0.28,
    gravity: -2
  })
}

const showToast = (game, text) => {
  game.toast = { text, t: 0 }
}

const breakTile = (game, tx, ty) => {
  const tile = game.grid[ty][tx]
  game.grid[ty][tx] = "."
  burst(game, tx + 0.5, ty + 0.5, [tileColor(tile), "#00000055"], 10, { speed: 5, life: 0.6 })
  if (tile === "O") {
    game.items.push({ type: "diamond", x: tx + 0.5, y: ty + 0.5, phase: 0, pop: 0.4 })
  }
}

const killMob = (game, m, byPlayer) => {
  m.alive = false
  poof(game, m)
  sfx.poof()
  if (byPlayer) game.mobsDefeated += 1
}

const damageMob = (game, m, fromX, amount = 1) => {
  if (!m.alive) return
  m.hp -= amount
  m.hurtT = 0.3
  m.fusing = false
  m.fuse = 0
  const dir = Math.sign(center(m).x - fromX) || 1
  m.vx = dir * 7
  m.vy = -6
  m.knock = 0.3
  sfx.hit()
  if (m.hp <= 0) killMob(game, m, true)
}

const die = (game, events) => {
  const p = game.player
  p.hearts = 0
  game.state = "dead"
  poof(game, p)
  events.onDeath?.()
}

const hurtPlayer = (game, amount, fromX, events) => {
  const p = game.player
  if (p.invuln > 0 || game.state !== "playing") return
  p.hearts -= amount
  p.invuln = INVULN
  p.knock = 0.25
  p.vx = (Math.sign(center(p).x - fromX) || -p.facing) * 7
  p.vy = -8
  game.shake = Math.max(game.shake, 0.25)
  sfx.hurt()
  if (p.hearts <= 0) die(game, events)
}

export const respawnPlayer = (game, fullHeal = false) => {
  const p = game.player
  const cp = game.checkpoint
  Object.assign(p, spawnBody(cp.x, cp.y, PLAYER_W, PLAYER_H))
  p.invuln = INVULN
  p.knock = 0
  p.attackT = -1
  if (fullHeal) p.hearts = MAX_HEARTS
  game.state = "playing"
  game.cam = null
}

const fallOut = (game, events) => {
  const p = game.player
  p.hearts -= 1
  sfx.hurt()
  if (p.hearts <= 0) {
    die(game, events)
    return
  }
  showToast(game, "Ouch! Back to your spawn point.")
  respawnPlayer(game)
}

const explode = (game, m, events) => {
  m.alive = false
  const c = center(m)
  sfx.explode()
  game.shake = 0.6
  burst(game, c.x, c.y, ["#ffffff", "#d9d9d9", "#ffb347", "#ff7a2f", "#555555"], 60, {
    speed: 10,
    life: 0.9,
    size: 0.32,
    gravity: 4
  })

  const radius = 1.7
  for (let ty = Math.floor(c.y - radius); ty <= Math.floor(c.y + radius); ty++) {
    for (let tx = Math.floor(c.x - radius); tx <= Math.floor(c.x + radius); tx++) {
      if (ty < 0 || ty >= game.height - 1 || tx < 0 || tx >= game.width) continue
      const tile = game.grid[ty][tx]
      if (tile === "." || UNBREAKABLE.has(tile) || tile === "q") continue
      if (Math.hypot(tx + 0.5 - c.x, ty + 0.5 - c.y) > radius) continue
      breakTile(game, tx, ty)
    }
  }

  for (const other of game.mobs) {
    if (other === m || !other.alive) continue
    if (Math.hypot(center(other).x - c.x, center(other).y - c.y) < 2.6) killMob(game, other, false)
  }

  const pc = center(game.player)
  const dist = Math.hypot(pc.x - c.x, pc.y - c.y)
  if (dist < 3) hurtPlayer(game, dist < 1.8 ? 2 : 1, c.x, events)
}

const updatePlayer = (game, input, dt, events) => {
  const p = game.player
  p.invuln = Math.max(0, p.invuln - dt)
  p.attackCd = Math.max(0, p.attackCd - dt)
  p.jumpBuffer = Math.max(0, p.jumpBuffer - dt)
  p.coyote = p.onGround ? COYOTE : Math.max(0, p.coyote - dt)

  const dir = (input.right ? 1 : 0) - (input.left ? 1 : 0)
  if (p.knock > 0) {
    p.knock -= dt
  } else if (dir !== 0) {
    const accel = p.onGround ? GROUND_ACCEL : AIR_ACCEL
    p.vx = Math.max(-RUN_SPEED, Math.min(RUN_SPEED, p.vx + dir * accel * dt))
    if (p.attackT < 0) p.facing = dir
  } else {
    const friction = (p.onGround ? GROUND_FRICTION : AIR_FRICTION) * dt
    p.vx = Math.abs(p.vx) <= friction ? 0 : p.vx - Math.sign(p.vx) * friction
  }

  if (p.jumpBuffer > 0 && p.coyote > 0) {
    p.vy = -JUMP_SPEED
    p.jumpBuffer = 0
    p.coyote = 0
    sfx.jump()
  }

  // Letting go of jump early pulls you down faster, giving short hops and big leaps.
  const extraGravity = !input.jump && p.vy < 0 ? GRAVITY * 1.6 : 0
  p.vy = Math.min(MAX_FALL, p.vy + (GRAVITY + extraGravity) * dt)

  const prevBottom = p.y + p.h
  moveBody(game, p, dt)
  if (p.onGround) p.walk += Math.abs(p.vx) * dt

  if (p.attackQueued && p.attackCd <= 0) {
    p.attackQueued = false
    p.attackT = 0
    p.attackCd = ATTACK_COOLDOWN
    p.hitSet.clear()
    sfx.swing()
  }
  if (p.attackT >= 0) {
    p.attackT += dt
    if (p.attackT > ATTACK_TIME) p.attackT = -1
  }
  if (p.attackT >= 0.03 && p.attackT <= 0.2) swordHits(game, p)

  for (const m of game.mobs) {
    if (!m.alive || !overlaps(p, m)) continue
    if (p.vy > 0 && prevBottom <= m.y + 0.4) {
      killMob(game, m, true)
      p.vy = input.jump ? -16 : -11
      sfx.stomp()
      game.shake = Math.max(game.shake, 0.12)
    } else if (m.type === "skeleton") {
      hurtPlayer(game, 1, center(m).x, events)
    } else if (!m.fusing && m.hurtT <= 0) {
      m.fusing = true
      sfx.hiss()
    }
    if (game.state !== "playing") return
  }

  if (touchesLava(game, p) || p.y > game.height + 1) {
    fallOut(game, events)
    return
  }

  for (const item of game.items) {
    if (item.taken) continue
    const box = { x: item.x - 0.4, y: item.y - 0.4, w: 0.8, h: 0.8 }
    if (!overlaps(p, box)) continue
    item.taken = true
    burst(game, item.x, item.y, ["#e3fdff", "#5decf5", "#fff6a0"], 12, {
      speed: 4,
      life: 0.5,
      size: 0.14,
      gravity: 0
    })
    if (item.type === "diamond") {
      game.diamonds += 1
      sfx.diamond()
    } else {
      p.hearts = Math.min(MAX_HEARTS, p.hearts + 2)
      sfx.eat()
      showToast(game, "Golden apple! +2 hearts")
    }
  }
  game.items = game.items.filter((item) => !item.taken)

  for (const bed of game.beds) {
    if (bed.active || !overlaps(p, bed)) continue
    for (const other of game.beds) other.active = false
    bed.active = true
    game.checkpoint = { x: bed.x, y: bed.y + 1 }
    p.hearts = Math.min(MAX_HEARTS, p.hearts + 1)
    sfx.bed()
    showToast(game, "Spawn point set!")
  }

  const pc = center(p)
  game.activeSign =
    game.signs.find((s) => Math.abs(s.x + 0.5 - pc.x) < 1.6 && Math.abs(s.y + 0.5 - pc.y) < 2) ??
    null

  if (game.portal && overlaps(p, game.portal)) {
    game.state = "entering"
    game.portalT = 0
    p.vx = 0
    p.vy = 0
    sfx.portal()
  }
}

const swordHits = (game, p) => {
  const reach = 1.35
  const hitbox = {
    x: p.facing > 0 ? p.x + p.w - 0.15 : p.x - reach + 0.15,
    y: p.y - 0.3,
    w: reach,
    h: p.h + 0.3
  }
  const pcx = center(p).x

  for (const m of game.mobs) {
    if (!m.alive || p.hitSet.has(m) || !overlaps(hitbox, m)) continue
    p.hitSet.add(m)
    damageMob(game, m, pcx)
  }

  for (const a of game.arrows) {
    if (a.friendly || a.stuck) continue
    if (a.x < hitbox.x || a.x > hitbox.x + hitbox.w || a.y < hitbox.y || a.y > hitbox.y + hitbox.h)
      continue
    a.friendly = true
    a.vx = p.facing * ARROW_SPEED * 1.4
    a.vy = -1
    sfx.clink()
  }

  if (!p.hitSet.has("block")) {
    const x0 = Math.floor(hitbox.x)
    const x1 = Math.floor(hitbox.x + hitbox.w)
    const y0 = Math.floor(hitbox.y)
    const y1 = Math.floor(hitbox.y + hitbox.h)
    for (let ty = y0; ty <= y1; ty++) {
      for (let tx = x0; tx <= x1; tx++) {
        if (tileAt(game, tx, ty) !== "O") continue
        breakTile(game, tx, ty)
        sfx.breakBlock()
        p.hitSet.add("block")
        return
      }
    }
  }
}

const canSee = (game, m, target) => {
  const y = Math.floor(m.y + 0.5)
  const from = Math.floor(center(m).x)
  const to = Math.floor(target.x)
  const step = Math.sign(to - from)
  for (let x = from; x !== to; x += step) if (solidAt(game, x, y)) return false
  return true
}

const updateMob = (game, m, dt, events) => {
  const p = game.player
  const mc = center(m)
  const pc = center(p)
  const dx = pc.x - mc.x
  const dy = pc.y - mc.y
  const dist = Math.hypot(dx, dy)
  const playerAround = game.state === "playing"
  m.hurtT = Math.max(0, m.hurtT - dt)

  let speed = 0
  if (m.type === "creeper") {
    if (playerAround && !m.fusing && m.hurtT <= 0 && dist < 1.8 && Math.abs(dy) < 1.5) {
      m.fusing = true
      sfx.hiss()
    }
    if (m.fusing && (dist > 3.6 || !playerAround)) m.fusing = false
    m.fuse = m.fusing ? m.fuse + dt : Math.max(0, m.fuse - dt)
    if (m.fuse >= CREEPER_FUSE) {
      explode(game, m, events)
      return
    }
    if (!m.fusing) {
      const chasing = playerAround && dist < 8 && Math.abs(dy) < 3
      if (chasing) m.dir = Math.sign(dx) || m.dir
      speed = chasing ? 1.9 : 0.8
      if (atEdge(game, m)) {
        if (chasing) speed = 0
        else m.dir = -m.dir
      }
    }
  } else {
    const sees = playerAround && Math.abs(dx) < 9 && Math.abs(dy) < 2.5 && canSee(game, m, pc)
    if (sees) {
      m.dir = Math.sign(dx) || m.dir
      m.shootCd -= dt
      if (m.shootCd <= 0) {
        m.aimT = m.aimT < 0 ? 0 : m.aimT + dt
        if (m.aimT >= 0.75) {
          shootArrow(game, m, pc)
          m.aimT = -1
          m.shootCd = rand(1.9, 2.7)
        }
      }
    } else {
      m.aimT = -1
      m.shootCd = Math.max(0.6, m.shootCd - dt)
      speed = 1.1
      if (atEdge(game, m)) m.dir = -m.dir
    }
  }

  if (m.knock > 0) {
    m.knock -= dt
  } else {
    m.vx = m.dir * speed
  }
  m.vy = Math.min(MAX_FALL, m.vy + GRAVITY * dt)
  moveBody(game, m, dt)
  if (m.hitWall && m.knock <= 0) m.dir = -m.dir
  if (m.onGround) m.walk += Math.abs(m.vx) * dt

  if (touchesLava(game, m) || m.y > game.height + 1) killMob(game, m, false)
}

const shootArrow = (game, m, target) => {
  const mc = center(m)
  const sx = mc.x + m.dir * 0.5
  const sy = m.y + 0.55
  const t = Math.max(0.2, Math.abs(target.x - sx) / ARROW_SPEED)
  const vy = Math.max(-6, Math.min(6, (target.y - sy) / t - 0.5 * ARROW_GRAVITY * t))
  game.arrows.push({ x: sx, y: sy, vx: m.dir * ARROW_SPEED, vy, stuck: false, life: 6 })
  sfx.bow()
}

const updateArrows = (game, dt, events) => {
  const p = game.player
  for (const a of game.arrows) {
    a.life -= dt
    if (a.stuck) continue
    a.vy += ARROW_GRAVITY * dt
    a.x += a.vx * dt
    a.y += a.vy * dt
    a.angle = Math.atan2(a.vy, a.vx)
    if (solidAt(game, Math.floor(a.x), Math.floor(a.y))) {
      a.stuck = true
      a.life = Math.min(a.life, 2)
      continue
    }
    if (a.friendly) {
      const hit = game.mobs.find(
        (m) => m.alive && a.x > m.x && a.x < m.x + m.w && a.y > m.y && a.y < m.y + m.h
      )
      if (hit) {
        damageMob(game, hit, a.x - a.vx, 2)
        a.life = 0
      }
    } else if (
      game.state === "playing" &&
      a.x > p.x &&
      a.x < p.x + p.w &&
      a.y > p.y &&
      a.y < p.y + p.h
    ) {
      hurtPlayer(game, 1, a.x - a.vx, events)
      a.life = 0
    }
  }
  game.arrows = game.arrows.filter((a) => a.life > 0 && a.y < game.height + 2)
}

const updateParticles = (game, dt) => {
  for (const pt of game.particles) {
    pt.vy += pt.gravity * dt
    pt.x += pt.vx * dt
    pt.y += pt.vy * dt
    pt.life -= dt
  }
  game.particles = game.particles.filter((pt) => pt.life > 0)
}

export const spawnFirework = (game, x, y) => {
  const palettes = [
    ["#ff5555", "#ffaa00", "#ffff55"],
    ["#55ff55", "#55ffff", "#ffffff"],
    ["#5555ff", "#ff55ff", "#ffffff"],
    ["#ffaa00", "#ffff55", "#55ffff"]
  ]
  const colors = palettes[Math.floor(Math.random() * palettes.length)]
  burst(game, x, y, colors, 50, { speed: 7, life: 1.4, size: 0.2, gravity: 3 })
  sfx.firework()
}

const step = (game, input, dt, events) => {
  game.time += dt
  if (game.state === "playing") updatePlayer(game, input, dt, events)
  if (game.state === "entering") {
    game.portalT += dt
    if (game.portalT >= 1.1 && !game.completed) {
      game.completed = true
      events.onComplete?.({
        diamonds: game.diamonds,
        totalDiamonds: game.totalDiamonds,
        mobs: game.mobsDefeated
      })
    }
  }

  const pc = game.player ? center(game.player) : { x: 0 }
  for (const m of game.mobs) {
    if (m.alive && Math.abs(center(m).x - pc.x) < ACTIVE_RANGE) updateMob(game, m, dt, events)
  }
  game.mobs = game.mobs.filter((m) => m.alive)
  updateArrows(game, dt, events)
  updateParticles(game, dt)

  for (const item of game.items) {
    item.phase += dt * 3
    if (item.pop > 0) item.pop -= dt
  }
  if (game.toast) {
    game.toast.t += dt
    if (game.toast.t > 2.4) game.toast = null
  }
  game.shake = Math.max(0, game.shake - dt)
}

export const updateGame = (game, input, dt, events) => {
  const p = game.player
  // Taps are latched by the input layer so a press shorter than one frame still counts.
  if (input.jumpTap || (input.jump && !game.prevInput.jump)) p.jumpBuffer = JUMP_BUFFER
  if (input.attackTap || (input.attack && !game.prevInput.attack)) p.attackQueued = true
  input.jumpTap = false
  input.attackTap = false
  game.prevInput = { jump: input.jump, attack: input.attack }

  game.accumulator = Math.min(game.accumulator + dt, 0.1)
  while (game.accumulator >= STEP) {
    game.accumulator -= STEP
    step(game, input, STEP, events)
  }
}

// Keeps animations and particles alive behind menus without moving the player.
export const idleGame = (game, dt) => {
  game.time += dt
  updateParticles(game, dt)
  for (const item of game.items) item.phase += dt * 3
}
