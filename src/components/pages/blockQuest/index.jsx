import React, { useEffect, useRef, useState } from "react"
import { LEVELS } from "./levels"
import { createGame, idleGame, respawnPlayer, spawnFirework, updateGame } from "./engine"
import { renderGame, tileSize } from "./renderer"
import { setMuted, sfx } from "./audio"
import "./blockQuest.css"

const PROGRESS_KEY = "scrapyard:blockquest-progress"
const MUTE_KEY = "scrapyard:blockquest-muted"

const SPLASHES = [
  "Made for Christopher!",
  "Creeper? Aw man!",
  "100% blocky!",
  "Now with diamonds!",
  "Watch out for arrows!",
  "Christopher rules!",
  "Bonk those creepers!"
]

const KEYMAP = {
  ArrowLeft: "left",
  KeyA: "left",
  ArrowRight: "right",
  KeyD: "right",
  ArrowUp: "jump",
  KeyW: "jump",
  Space: "jump",
  KeyX: "attack",
  KeyJ: "attack",
  KeyK: "attack",
  KeyF: "attack"
}

const freshInput = () => ({
  left: false,
  right: false,
  jump: false,
  attack: false,
  jumpTap: false,
  attackTap: false
})
const clamp = (value, min, max) => Math.min(max, Math.max(min, value))
const fullscreenElement = () => document.fullscreenElement ?? document.webkitFullscreenElement

const readStorage = (key, fallback) => {
  try {
    return JSON.parse(window.localStorage.getItem(key)) ?? fallback
  } catch {
    return fallback
  }
}

const writeStorage = (key, value) => {
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // storage can be unavailable (private mode); progress just won't persist
  }
}

const TouchButton = ({ action, label, className, inputRef }) => {
  const press = (down) => (event) => {
    event.preventDefault()
    inputRef.current[action] = down
    if (down) {
      inputRef.current[`${action}Tap`] = true
      sfx.unlock()
      event.currentTarget.setPointerCapture?.(event.pointerId)
    }
  }
  return (
    <button
      type="button"
      className={`bq-touch__btn ${className}`}
      aria-label={action}
      onPointerDown={press(true)}
      onPointerUp={press(false)}
      onPointerCancel={press(false)}
      onLostPointerCapture={press(false)}
      onContextMenu={(event) => event.preventDefault()}>
      {label}
    </button>
  )
}

const BlockQuest = () => {
  const [screen, setScreen] = useState("title")
  const [levelIndex, setLevelIndex] = useState(0)
  const [result, setResult] = useState(null)
  const [progress, setProgress] = useState(() => readStorage(PROGRESS_KEY, {}))
  const [muted, setMutedState] = useState(() => readStorage(MUTE_KEY, false))
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showTouch, setShowTouch] = useState(
    () => "ontouchstart" in window && !window.matchMedia?.("(any-pointer: fine)").matches
  )
  const [splash] = useState(() => SPLASHES[Math.floor(Math.random() * SPLASHES.length)])

  const canvasRef = useRef(null)
  const stageRef = useRef(null)
  const gameRef = useRef(null)
  if (!gameRef.current) gameRef.current = createGame(LEVELS[0])
  const inputRef = useRef(freshInput())
  const screenRef = useRef(screen)
  const eventsRef = useRef({})
  const fullscreenRef = useRef(false)
  const nativeFullscreenRef = useRef(false)
  screenRef.current = screen
  fullscreenRef.current = isFullscreen

  eventsRef.current = {
    onDeath: () => setScreen("dead"),
    onComplete: (stats) => {
      const level = LEVELS[levelIndex]
      setResult(stats)
      setProgress((prev) => ({
        ...prev,
        [level.id]: {
          done: true,
          diamonds: Math.max(prev[level.id]?.diamonds ?? 0, stats.diamonds),
          total: stats.totalDiamonds
        }
      }))
      setScreen(levelIndex === LEVELS.length - 1 ? "victory" : "complete")
    }
  }

  useEffect(() => writeStorage(PROGRESS_KEY, progress), [progress])

  useEffect(() => {
    setMuted(muted)
    writeStorage(MUTE_KEY, muted)
  }, [muted])

  useEffect(() => {
    inputRef.current = freshInput()
  }, [screen])

  useEffect(() => {
    const canvas = canvasRef.current
    const stage = stageRef.current
    const ctx = canvas.getContext("2d")
    const size = { w: 0, h: 0 }
    let frame
    let last = performance.now()
    let fireworkT = 0

    const resize = () => {
      const w = stage.clientWidth
      const h = fullscreenRef.current
        ? stage.clientHeight
        : Math.round(clamp(w * 0.5625, 260, window.innerHeight * 0.78))
      if (!w || (w === size.w && h === size.h)) return
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
    window.addEventListener("resize", resize)

    const tick = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      const game = gameRef.current
      const current = screenRef.current
      if (current === "playing") updateGame(game, inputRef.current, dt, eventsRef.current)
      else if (current !== "paused") idleGame(game, dt)

      if (current === "victory" && game.cam && size.h) {
        fireworkT -= dt
        if (fireworkT <= 0) {
          fireworkT = 0.45
          const viewW = size.w / tileSize(size.w, size.h)
          spawnFirework(
            game,
            game.cam.x + viewW * (0.15 + Math.random() * 0.7),
            game.cam.y + 2 + Math.random() * 4
          )
        }
      }

      if (size.w) renderGame(ctx, game, size.w, size.h, dt, { attract: current === "title" })
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      window.removeEventListener("resize", resize)
    }
  }, [])

  useEffect(() => {
    const onKey = (down) => (event) => {
      const action = KEYMAP[event.code]
      const current = screenRef.current
      if (!down) {
        if (!action) return
        inputRef.current[action] = false
        // Space/Enter activate a focused button on keyup, which would toggle the toolbar mid-game.
        if (current === "playing") event.preventDefault()
        return
      }
      if (event.code === "Escape" || event.code === "KeyP") {
        if (current === "playing") setScreen("paused")
        else if (current === "paused") setScreen("playing")
        return
      }
      if (current !== "playing" || !action) return
      event.preventDefault()
      inputRef.current[action] = true
      if (!event.repeat) inputRef.current[`${action}Tap`] = true
    }
    const keyDown = onKey(true)
    const keyUp = onKey(false)
    const pauseIfPlaying = () => {
      inputRef.current = freshInput()
      if (screenRef.current === "playing") setScreen("paused")
    }
    const onVisibility = () => document.hidden && pauseIfPlaying()
    // Leaving native fullscreen with Esc or the back gesture should also drop our layout.
    const onFullscreen = () => {
      if (fullscreenElement() || !nativeFullscreenRef.current) return
      nativeFullscreenRef.current = false
      setIsFullscreen(false)
    }

    window.addEventListener("keydown", keyDown)
    window.addEventListener("keyup", keyUp)
    window.addEventListener("blur", pauseIfPlaying)
    document.addEventListener("visibilitychange", onVisibility)
    document.addEventListener("fullscreenchange", onFullscreen)
    document.addEventListener("webkitfullscreenchange", onFullscreen)
    return () => {
      window.removeEventListener("keydown", keyDown)
      window.removeEventListener("keyup", keyUp)
      window.removeEventListener("blur", pauseIfPlaying)
      document.removeEventListener("visibilitychange", onVisibility)
      document.removeEventListener("fullscreenchange", onFullscreen)
      document.removeEventListener("webkitfullscreenchange", onFullscreen)
    }
  }, [])

  useEffect(() => {
    if (!isFullscreen) return undefined
    const root = document.documentElement
    const previous = [root.style.overflow, document.body.style.overflow]
    root.style.overflow = "hidden"
    document.body.style.overflow = "hidden"
    return () => {
      root.style.overflow = previous[0]
      document.body.style.overflow = previous[1]
    }
  }, [isFullscreen])

  // iPhones only allow native fullscreen on <video>, so the CSS layout alone has to cover the
  // screen there; elsewhere native fullscreen also hides the browser bars.
  const enterFullscreen = () => {
    setIsFullscreen(true)
    const stage = stageRef.current
    const request = stage?.requestFullscreen ?? stage?.webkitRequestFullscreen
    if (!request || fullscreenElement()) return
    Promise.resolve(request.call(stage))
      .then(() => {
        nativeFullscreenRef.current = true
        return window.screen?.orientation?.lock?.("landscape")
      })
      .catch(() => {})
  }

  const exitFullscreen = () => {
    setIsFullscreen(false)
    nativeFullscreenRef.current = false
    if (!fullscreenElement()) return
    const exit = document.exitFullscreen ?? document.webkitExitFullscreen
    Promise.resolve(exit?.call(document)).catch(() => {})
  }

  const toggleFullscreen = () => (isFullscreen ? exitFullscreen() : enterFullscreen())

  const startLevel = (index) => {
    sfx.unlock()
    if (showTouch && !isFullscreen) enterFullscreen()
    gameRef.current = createGame(LEVELS[index])
    setLevelIndex(index)
    setResult(null)
    setScreen("playing")
    stageRef.current?.focus()
  }

  const respawn = () => {
    respawnPlayer(gameRef.current, true)
    setScreen("playing")
    stageRef.current?.focus()
  }

  const resume = () => {
    setScreen("playing")
    stageRef.current?.focus()
  }

  const firstUnfinished = LEVELS.findIndex((level) => !progress[level.id]?.done)
  const continueIndex = firstUnfinished === -1 ? 0 : firstUnfinished
  const anyDone = LEVELS.some((level) => progress[level.id]?.done)
  const level = LEVELS[levelIndex]

  return (
    <div className="bq">
      <p className="bq__eyebrow">Made for Christopher</p>
      <h2 className="bq__title">Block Quest</h2>
      <p className="bq__brief">
        Run, jump and bonk your way through four blocky worlds. Grab the diamonds, dodge the
        skeleton arrows, and don&apos;t let the creepers get too close!
      </p>

      <div
        ref={stageRef}
        className={`bq-stage ${isFullscreen ? "bq-stage--full" : ""}`}
        tabIndex={-1}
        onPointerDown={(event) => event.pointerType === "touch" && setShowTouch(true)}
        onContextMenu={(event) => event.preventDefault()}>
        <canvas ref={canvasRef} className="bq-canvas" />

        <button
          type="button"
          className="bq-fs"
          aria-label={isFullscreen ? "Exit full screen" : "Full screen"}
          onClick={toggleFullscreen}>
          {isFullscreen ? "✕" : "⛶"}
        </button>
        {isFullscreen && <p className="bq-rotate">Turn your phone sideways for a bigger view!</p>}

        {screen === "title" && (
          <div className="bq-overlay bq-overlay--title">
            <div className="bq-logo">
              <span className="bq-logo__top">Christopher&apos;s</span>
              <span className="bq-logo__main">BLOCK QUEST</span>
              <span className="bq-splash">{splash}</span>
            </div>
            <div className="bq-menu">
              <button
                type="button"
                className="bq-btn bq-btn--wide"
                onClick={() => startLevel(continueIndex)}>
                {anyDone ? `Continue: World ${continueIndex + 1}` : "Play"}
              </button>
              <div className="bq-worlds">
                {LEVELS.map((lvl, i) => {
                  const best = progress[lvl.id]
                  return (
                    <button
                      key={lvl.id}
                      type="button"
                      className={`bq-btn bq-world ${best?.done ? "bq-world--done" : ""}`}
                      onClick={() => startLevel(i)}>
                      <span className="bq-world__num">World {i + 1}</span>
                      <span className="bq-world__name">{lvl.name}</span>
                      {best?.done && (
                        <span className="bq-world__badge">
                          ✓ <span className="bq-gem">◆</span> {best.diamonds}/{best.total}
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {screen === "paused" && (
          <div className="bq-overlay">
            <h3 className="bq-heading">Game Paused</h3>
            <div className="bq-menu">
              <button type="button" className="bq-btn bq-btn--wide" onClick={resume}>
                Back to Game
              </button>
              <button
                type="button"
                className="bq-btn bq-btn--wide"
                onClick={() => setScreen("title")}>
                Title Screen
              </button>
            </div>
          </div>
        )}

        {screen === "dead" && (
          <div className="bq-overlay bq-overlay--dead">
            <h3 className="bq-heading bq-heading--dead">You died!</h3>
            <p className="bq-sub">
              Don&apos;t worry, Christopher. Even Steve needs a few tries! You keep your{" "}
              <span className="bq-gem">◆</span> {gameRef.current.diamonds} diamonds.
            </p>
            <div className="bq-menu">
              <button type="button" className="bq-btn bq-btn--wide" onClick={respawn}>
                Respawn
              </button>
              <button
                type="button"
                className="bq-btn bq-btn--wide"
                onClick={() => setScreen("title")}>
                Title Screen
              </button>
            </div>
          </div>
        )}

        {screen === "complete" && result && (
          <div className="bq-overlay">
            <h3 className="bq-heading bq-heading--gold">World Complete!</h3>
            <p className="bq-sub">Awesome job, Christopher! You beat {level.name}.</p>
            <ul className="bq-stats">
              <li>
                <span className="bq-gem">◆</span> Diamonds: {result.diamonds} /{" "}
                {result.totalDiamonds}
              </li>
              <li>Mobs bonked: {result.mobs}</li>
            </ul>
            <div className="bq-menu">
              <button
                type="button"
                className="bq-btn bq-btn--wide"
                onClick={() => startLevel(levelIndex + 1)}>
                Next World: {LEVELS[levelIndex + 1]?.name}
              </button>
              <button
                type="button"
                className="bq-btn bq-btn--wide"
                onClick={() => startLevel(levelIndex)}>
                Play Again
              </button>
              <button
                type="button"
                className="bq-btn bq-btn--wide"
                onClick={() => setScreen("title")}>
                Title Screen
              </button>
            </div>
          </div>
        )}

        {screen === "victory" && result && (
          <div className="bq-overlay bq-overlay--victory">
            <h3 className="bq-heading bq-heading--gold">You beat Block Quest!</h3>
            <p className="bq-sub">Christopher is officially a Minecraft legend!</p>
            <ul className="bq-stats">
              <li>
                <span className="bq-gem">◆</span> Nether diamonds: {result.diamonds} /{" "}
                {result.totalDiamonds}
              </li>
              <li>Mobs bonked: {result.mobs}</li>
            </ul>
            <div className="bq-menu">
              <button type="button" className="bq-btn bq-btn--wide" onClick={() => startLevel(0)}>
                Play Again from World 1
              </button>
              <button
                type="button"
                className="bq-btn bq-btn--wide"
                onClick={() => setScreen("title")}>
                Title Screen
              </button>
            </div>
          </div>
        )}

        {screen === "playing" && (
          <>
            <button
              type="button"
              className="bq-pause"
              aria-label="Pause"
              onClick={() => setScreen("paused")}>
              II
            </button>
            <div className={`bq-touch ${showTouch ? "bq-touch--on" : ""}`}>
              <div className="bq-touch__group">
                <TouchButton action="left" label="◀" className="" inputRef={inputRef} />
                <TouchButton action="right" label="▶" className="" inputRef={inputRef} />
              </div>
              <div className="bq-touch__group">
                <TouchButton
                  action="attack"
                  label="⚔"
                  className="bq-touch__btn--attack"
                  inputRef={inputRef}
                />
                <TouchButton
                  action="jump"
                  label="▲"
                  className="bq-touch__btn--jump"
                  inputRef={inputRef}
                />
              </div>
            </div>
          </>
        )}
      </div>

      <div className="bq-toolbar">
        <div className="bq-keys">
          <span>
            <kbd>←</kbd>
            <kbd>→</kbd> or <kbd>A</kbd>
            <kbd>D</kbd> walk
          </span>
          <span>
            <kbd>Space</kbd> jump
          </span>
          <span>
            <kbd>X</kbd> sword
          </span>
          <span>
            <kbd>Esc</kbd> pause
          </span>
        </div>
        <div className="bq-toolbar__actions">
          <button type="button" className="bq-chip" onClick={() => setMutedState((m) => !m)}>
            {muted ? "Sound: off" : "Sound: on"}
          </button>
          <button type="button" className="bq-chip" onClick={toggleFullscreen}>
            {isFullscreen ? "Exit full screen" : "Full screen"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default BlockQuest
