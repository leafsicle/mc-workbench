import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { LEVELS, generateSiege } from "./levels"
import {
  ANGLE_MAX,
  ANGLE_MIN,
  CW_MAX,
  CW_MIN,
  FOLLOW_ARM_DEG,
  RELEASE_ARM_DEG,
  REST_ARM_DEG,
  checkImpact,
  createShot,
  describeImpact,
  flatRange,
  launchSpeed,
  requiredDescent,
  solveLevel,
  stepShot
} from "./physics"
import { createCamera, renderScene } from "./renderer"
import "./trebuchet.css"

const SWING_TIME = 0.45
const IMPACT_TIME = 1.1
const RELOAD_TIME = 0.7
const TIME_SCALE = 1.5
const SIM_DT = 1 / 240
const STORAGE_KEY = "scrapyard:trebuchet-stars"

const clamp = (value, min, max) => Math.min(max, Math.max(min, value))
const lerp = (a, b, t) => a + (b - a) * t
const easeInCubic = (t) => t * t * t
const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3)

const starsFor = (shots) => (shots <= 1 ? 3 : shots <= 3 ? 2 : 1)

const loadStars = () => {
  try {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY)) ?? {}
  } catch {
    return {}
  }
}

const freshGame = () => ({
  phase: "aiming",
  phaseT: 0,
  arm: REST_ARM_DEG,
  reloadFrom: REST_ARM_DEG,
  shot: null,
  launch: null,
  ghosts: [],
  particles: [],
  destroyed: false,
  flash: 0,
  time: 0
})

const IMPACT_PALETTES = {
  target: ["#ffb35c", "#ff7a3d", "#ffd99a", "#6b4a3a"],
  obstacle: ["#9a9ea6", "#6c7079", "#cfc8b8"],
  ground: ["#6b5a40", "#8a7550", "#4a3d2a"]
}

const spawnImpact = (game, result) => {
  const hit = result.outcome === "target"
  const palette = IMPACT_PALETTES[result.outcome] ?? IMPACT_PALETTES.ground
  const count = hit ? 70 : 26
  for (let i = 0; i < count; i++) {
    const angle = Math.PI * (0.1 + Math.random() * 0.8)
    const speed = (hit ? 6 : 3) + Math.random() * (hit ? 14 : 8)
    const life = 0.6 + Math.random() * (hit ? 1.4 : 0.8)
    game.particles.push({
      x: result.x,
      y: Math.max(0.5, result.y),
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life,
      maxLife: life,
      size: 0.3 + Math.random() * 0.7,
      color: palette[i % palette.length]
    })
  }
}

const updateGame = (game, dt, level, events) => {
  game.time += dt
  game.phaseT += dt
  game.flash = Math.max(0, game.flash - dt * 2.5)

  if (game.phase === "swinging") {
    const t = clamp(game.phaseT / SWING_TIME, 0, 1)
    game.arm = lerp(REST_ARM_DEG, RELEASE_ARM_DEG, easeInCubic(t))
    if (t >= 1) {
      game.shot = createShot(game.launch)
      game.phase = "flying"
      game.phaseT = 0
    }
  } else if (game.phase === "flying") {
    game.arm = lerp(game.arm, FOLLOW_ARM_DEG, Math.min(1, dt * 6))
    let remaining = dt * TIME_SCALE
    while (remaining > 0) {
      const step = Math.min(SIM_DT, remaining)
      remaining -= step
      stepShot(game.shot, step)
      const impact = checkImpact(game.shot, level)
      if (impact) {
        const result = describeImpact(game.shot, impact)
        game.shot.trail.push({ x: game.shot.x, y: result.y })
        game.phase = "impact"
        game.phaseT = 0
        if (result.outcome === "target") {
          game.destroyed = true
          game.flash = 1
        }
        spawnImpact(game, result)
        events.onImpact(result)
        break
      }
    }
  } else if (game.phase === "impact") {
    game.arm = lerp(game.arm, FOLLOW_ARM_DEG, Math.min(1, dt * 6))
    if (!game.destroyed && game.phaseT >= IMPACT_TIME) {
      game.phase = "reloading"
      game.phaseT = 0
      game.reloadFrom = game.arm
    }
  } else if (game.phase === "reloading") {
    const t = clamp(game.phaseT / RELOAD_TIME, 0, 1)
    game.arm = lerp(game.reloadFrom, REST_ARM_DEG, easeOutCubic(t))
    if (t >= 1) {
      game.phase = "aiming"
      game.phaseT = 0
      events.onReady()
    }
  }

  for (const p of game.particles) {
    p.vy -= 9.81 * dt
    p.x += p.vx * dt
    p.y += p.vy * dt
    if (p.y < 0) {
      p.y = 0
      p.vy *= -0.3
      p.vx *= 0.6
    }
    p.life -= dt
  }
  game.particles = game.particles.filter((p) => p.life > 0)
}

const describeResult = (result, level) => {
  if (!result) return null
  const { target } = level
  switch (result.outcome) {
    case "target":
      return { tone: "hit", title: "Direct hit!", detail: `The ${target.label} is rubble.` }
    case "obstacle": {
      const behind = result.obstacle.x > target.x
      return {
        tone: "block",
        title: `Smacked the ${result.obstacle.label}`,
        detail: behind ? "Overshot. Ease off a little." : "Lob it higher or hit harder to clear it."
      }
    }
    case "ground":
      if (result.x < target.x) {
        return {
          tone: "miss",
          title: `Short by ${Math.round(target.x - result.x)} m`,
          detail: "Needs more distance."
        }
      }
      return {
        tone: "miss",
        title: `Long by ${Math.round(result.x - (target.x + target.w))} m`,
        detail: "Too much. Pull it back."
      }
    default:
      return { tone: "miss", title: "Off the map", detail: "That one's in the next county." }
  }
}

const formatWind = (wind) => {
  if (!wind) return "Calm"
  return `${wind < 0 ? "← Headwind" : "→ Tailwind"} ${Math.abs(wind).toFixed(1)}`
}

const Stars = ({ count, total = 3 }) => (
  <span className="treb-stars" aria-label={`${count} of ${total} stars`}>
    {Array.from({ length: total }, (_, i) => (
      <span key={i} className={i < count ? "treb-star treb-star--on" : "treb-star"}>
        ★
      </span>
    ))}
  </span>
)

const TrebuchetTool = () => {
  const [levelIndex, setLevelIndex] = useState(0)
  const [randomLevel, setRandomLevel] = useState(null)
  const level = randomLevel ?? LEVELS[levelIndex]

  const [angle, setAngle] = useState(45)
  const [counterweight, setCounterweight] = useState(600)
  const [phase, setPhase] = useState("aiming")
  const [shots, setShots] = useState(0)
  const [lastResult, setLastResult] = useState(null)
  const [cleared, setCleared] = useState(null)
  const [bestStars, setBestStars] = useState(loadStars)

  const canvasRef = useRef(null)
  const stageRef = useRef(null)
  const gameRef = useRef(freshGame())
  const shotsRef = useRef(0)
  const levelRef = useRef(level)
  const controlsRef = useRef({ angle, speed: launchSpeed(counterweight) })
  const eventsRef = useRef({ onImpact: () => {}, onReady: () => {} })

  levelRef.current = level
  controlsRef.current = { angle, speed: launchSpeed(counterweight) }

  const minDescent = useMemo(() => requiredDescent(solveLevel(level)), [level])
  const speed = launchSpeed(counterweight)
  const isRandom = Boolean(randomLevel)
  const message = describeResult(lastResult, level)

  const resetLevel = useCallback(() => {
    gameRef.current = freshGame()
    shotsRef.current = 0
    setShots(0)
    setLastResult(null)
    setCleared(null)
    setPhase("aiming")
  }, [])

  useEffect(() => {
    resetLevel()
  }, [level, resetLevel])

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(bestStars))
    } catch {
      // storage can be unavailable (private mode); stars just won't persist
    }
  }, [bestStars])

  eventsRef.current = {
    onImpact: (result) => {
      setLastResult(result)
      setPhase("impact")
      if (result.outcome !== "target") return
      const stars = starsFor(shotsRef.current)
      setCleared({ stars, shots: shotsRef.current })
      if (!isRandom) {
        setBestStars((prev) => ({ ...prev, [level.id]: Math.max(prev[level.id] ?? 0, stars) }))
      }
    },
    onReady: () => setPhase("aiming")
  }

  useEffect(() => {
    const canvas = canvasRef.current
    const stage = stageRef.current
    const ctx = canvas.getContext("2d")
    let frame
    let last = performance.now()
    const size = { w: 0, h: 0 }

    const resize = () => {
      const w = stage.clientWidth
      if (!w || w === size.w) return
      const h = Math.max(220, Math.round(w * 0.5))
      const dpr = window.devicePixelRatio || 1
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      size.w = w
      size.h = h
    }

    resize()
    const observer = new ResizeObserver(resize)
    observer.observe(stage)

    const tick = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      updateGame(gameRef.current, dt, levelRef.current, eventsRef.current)
      if (size.w) {
        const cam = createCamera(levelRef.current, size.w, size.h)
        renderScene(ctx, cam, levelRef.current, gameRef.current, controlsRef.current)
      }
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
    }
  }, [])

  const fire = useCallback(() => {
    const game = gameRef.current
    if (game.phase !== "aiming") return
    if (game.shot) {
      game.ghosts = [...game.ghosts, game.shot.trail].slice(-3)
      game.shot = null
    }
    game.launch = { angle, counterweight, wind: level.wind }
    game.phase = "swinging"
    game.phaseT = 0
    shotsRef.current += 1
    setShots(shotsRef.current)
    setLastResult(null)
    setPhase("swinging")
  }, [angle, counterweight, level])

  const nudgeAngle = (delta) => setAngle((a) => clamp(a + delta, ANGLE_MIN, ANGLE_MAX))
  const nudgeWeight = (delta) => setCounterweight((w) => clamp(w + delta, CW_MIN, CW_MAX))

  const onStageKeyDown = (event) => {
    const big = event.shiftKey
    if (event.key === "ArrowUp") nudgeAngle(big ? 5 : 1)
    else if (event.key === "ArrowDown") nudgeAngle(big ? -5 : -1)
    else if (event.key === "ArrowRight") nudgeWeight(big ? 100 : 25)
    else if (event.key === "ArrowLeft") nudgeWeight(big ? -100 : -25)
    else if (event.key === " " || event.key === "Enter") fire()
    else return
    event.preventDefault()
  }

  const pickLevel = (index) => {
    setRandomLevel(null)
    setLevelIndex(index)
  }

  const rollRandom = () => setRandomLevel(generateSiege(Date.now()))

  const nextLevel = () => {
    if (isRandom) rollRandom()
    else pickLevel(Math.min(levelIndex + 1, LEVELS.length - 1))
  }

  const isLastLevel = !isRandom && levelIndex === LEVELS.length - 1
  const canFire = phase === "aiming" && !cleared

  return (
    <div className="treb">
      <header className="treb__header">
        <p className="treb__eyebrow">Trebuchet siege</p>
        <h2 className="treb__title">Send It</h2>
        <p className="treb__brief">
          Set the release angle and counterweight, then let it fly. Walls and tall buildings hide
          the targets, so some shots need a flat line and others need to come down steeply.
        </p>
      </header>

      <nav className="treb__levels" aria-label="Levels">
        {LEVELS.map((l, i) => (
          <button
            key={l.id}
            type="button"
            className={!isRandom && i === levelIndex ? "treb-pill treb-pill--active" : "treb-pill"}
            onClick={() => pickLevel(i)}>
            <span className="treb-pill__index">{i + 1}</span>
            <span className="treb-pill__name">{l.name}</span>
            <Stars count={bestStars[l.id] ?? 0} />
          </button>
        ))}
        <button
          type="button"
          className={isRandom ? "treb-pill treb-pill--active" : "treb-pill"}
          onClick={rollRandom}>
          <span className="treb-pill__name">Random siege</span>
        </button>
      </nav>

      <div
        ref={stageRef}
        className="treb__stage"
        tabIndex={0}
        role="application"
        aria-label="Trebuchet field. Arrow keys aim, space fires."
        onKeyDown={onStageKeyDown}
        onPointerDown={() => stageRef.current?.focus()}>
        <canvas ref={canvasRef} className="treb__canvas" />

        <div className="treb__hud">
          <span className="treb-chip treb-chip--strong">{level.name}</span>
          <span className="treb-chip">{formatWind(level.wind)}</span>
          {minDescent !== null && <span className="treb-chip">Descent ≥ {minDescent}°</span>}
          <span className="treb-chip">Shots {shots}</span>
        </div>

        {message && !cleared && (
          <div className={`treb__callout treb__callout--${message.tone}`} role="status">
            <strong>{message.title}</strong>
            <span>{message.detail}</span>
          </div>
        )}

        {cleared && (
          <div className="treb__cleared" role="dialog" aria-label="Level cleared">
            <p className="treb__cleared-eyebrow">Target destroyed</p>
            <Stars count={cleared.stars} />
            <p className="treb__cleared-detail">
              {cleared.shots === 1 ? "First shot. Nice." : `Took ${cleared.shots} shots.`}
            </p>
            <div className="treb__cleared-actions">
              <button type="button" className="treb-btn treb-btn--ghost" onClick={resetLevel}>
                Replay
              </button>
              {!isLastLevel && (
                <button type="button" className="treb-btn" onClick={nextLevel}>
                  {isRandom ? "New siege" : "Next level"}
                </button>
              )}
              {isLastLevel && (
                <button type="button" className="treb-btn" onClick={rollRandom}>
                  Random siege
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      <p className="treb__level-brief">{level.brief}</p>

      <section className="treb__controls" aria-label="Aim">
        <label className="treb-slider">
          <span className="treb-slider__label">
            Release angle <strong>{angle}°</strong>
          </span>
          <input
            type="range"
            min={ANGLE_MIN}
            max={ANGLE_MAX}
            step={1}
            value={angle}
            onChange={(e) => setAngle(Number(e.target.value))}
          />
        </label>
        <label className="treb-slider">
          <span className="treb-slider__label">
            Counterweight <strong>{counterweight} kg</strong>
          </span>
          <input
            type="range"
            min={CW_MIN}
            max={CW_MAX}
            step={25}
            value={counterweight}
            onChange={(e) => setCounterweight(Number(e.target.value))}
          />
        </label>
        <button
          type="button"
          className="treb-btn treb-btn--fire"
          onClick={fire}
          disabled={!canFire}>
          {cleared ? "Cleared" : phase === "aiming" ? "Fire" : "Reloading…"}
        </button>
      </section>

      <p className="treb__keys">
        Click the field, then use ↑ ↓ for angle, ← → for weight (hold Shift for bigger steps), and
        Space to fire.
      </p>

      <section className="treb__readouts" aria-label="Physics readout">
        <div className="treb-stat">
          <span>Launch speed</span>
          <strong>{speed.toFixed(1)} m/s</strong>
        </div>
        <div className="treb-stat">
          <span>Flat range (no wind)</span>
          <strong>{flatRange(counterweight, angle).toFixed(0)} m</strong>
        </div>
        <div className="treb-stat">
          <span>Last distance</span>
          <strong>{lastResult ? `${lastResult.distance.toFixed(0)} m` : "—"}</strong>
        </div>
        <div className="treb-stat">
          <span>Last apex</span>
          <strong>{lastResult ? `${lastResult.apex.toFixed(0)} m` : "—"}</strong>
        </div>
        <div
          className={
            lastResult && minDescent !== null && lastResult.descent < minDescent
              ? "treb-stat treb-stat--warn"
              : "treb-stat"
          }>
          <span>Last descent</span>
          <strong>{lastResult ? `${lastResult.descent.toFixed(0)}°` : "—"}</strong>
        </div>
        <div className="treb-stat">
          <span>Flight time</span>
          <strong>{lastResult ? `${lastResult.flightTime.toFixed(1)} s` : "—"}</strong>
        </div>
      </section>
    </div>
  )
}

export default TrebuchetTool
