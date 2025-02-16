import React, { useState, useRef, useEffect, useCallback } from "react"
import paper from "paper" // make sure paper.js is installed in your project

// TrebuchetTool is a simple, interactive physics tool for a trebuchet.
// It lets you adjust parameters such as the mass of the counterweight, mass of the projectile,
// pivot height, sling length and the lengths of the short and long arms.
// The simulation runs automatically based on the current settings.
const TrebuchetTool = () => {
  // Trebuchet constants stored in state. Adjust default values as needed.
  const [Mcw, setMcw] = useState(1000) // mass of counterweight (in kg)
  const [mp, setMp] = useState(10) // mass of projectile (in kg)
  const [h, setH] = useState(10) // height of pivot (meters)
  const [ds, setDs] = useState(5) // sling length (meters)
  const [dsa, setDsa] = useState(2) // length of short arm (meters)
  const [dla, setDla] = useState(4) // length of long arm (meters)
  const [desiredAngle, setDesiredAngle] = useState(45) // desired release angle (°)
  const [releaseTime, setReleaseTime] = useState(null)
  const [projectileDistance, setProjectileDistance] = useState(null)
  const [projectileVelocity, setProjectileVelocity] = useState(null)
  const [scaleAdjustment, setScaleAdjustment] = useState(1) // Scale multiplier

  // Create a ref to attach the Paper.js canvas.
  const paperCanvasRef = useRef(null)

  // Set up Paper.js on the canvas once when the component mounts.
  useEffect(() => {
    if (paperCanvasRef.current) {
      paper.setup(paperCanvasRef.current)
    }
  }, [])

  // simulate() uses a dummy model to compute the release time, projectile velocity, and range.
  const simulate = useCallback(() => {
    // Convert the desired angle from degrees to radians.
    const desiredAngleRad = desiredAngle * (Math.PI / 180)
    const g = 9.81 // gravitational acceleration (m/s²)

    // Dummy angular acceleration estimation (only for demonstration).
    const a = (Mcw * g) / (dsa + dla)

    let t = 0
    const dt = 0.001
    let slingAngle = 0

    // Increment t until the computed slingAngle reaches or exceeds the desired angle.
    while (slingAngle < desiredAngleRad && t < 10) {
      t += dt
      slingAngle = 0.5 * a * t * t
    }

    setReleaseTime(t.toFixed(3))

    // Compute projectile's initial (linear) velocity:
    // v = slingLength * (angular velocity ≈ a * t)
    const v = ds * a * t
    setProjectileVelocity(v.toFixed(3))

    // Compute projectile range using: range = (v² * sin(2θ)) / g
    const range = (v * v * Math.sin(2 * desiredAngleRad)) / g
    setProjectileDistance(range.toFixed(3))
  }, [Mcw, ds, dsa, dla, desiredAngle])

  // drawTrajectoryPaperJS() uses the computed projectile velocity, range, and desired angle
  // to render a parabolic path on a Paper.js canvas.
  // The drawing is scaled dynamically so the entire trajectory always fits within the canvas.
  const drawTrajectoryPaperJS = useCallback(() => {
    if (!projectileDistance || !projectileVelocity) return

    const v = parseFloat(projectileVelocity)
    const theta = desiredAngle * (Math.PI / 180)
    const g = 9.81
    const flightTime = (2 * v * Math.sin(theta)) / g
    const range = parseFloat(projectileDistance)
    const H_max = (v * v * Math.sin(theta) * Math.sin(theta)) / (2 * g)

    const canvas = paperCanvasRef.current
    if (!canvas) return

    // Ensure a Paper.js project is active before clearing.
    if (!paper.project) {
      paper.setup(canvas)
    } else {
      paper.project.clear()
    }

    const canvasWidth = canvas.width
    const canvasHeight = canvas.height

    // 1. Establish a consistent origin point at the bottom left:
    const padding = 40
    const originX = padding // A small padding from the left edge
    const originY = canvasHeight - padding // Ground level (bottom of the canvas)

    // Optionally, recalculate the available drawing area:
    const availableWidth = canvasWidth - originX - padding
    const availableHeight = originY - padding
    const scaleX = availableWidth / range
    const scaleY = availableHeight / H_max
    const scale = Math.min(scaleX, scaleY) * 0.9 * scaleAdjustment

    // 2. Draw axes using the new origin.
    // Draw the x-axis (ground level)
    new paper.Path.Line({
      from: new paper.Point(originX, originY),
      to: new paper.Point(canvasWidth - padding, originY),
      strokeColor: "black",
      strokeWidth: 1
    })

    // Draw the y-axis
    new paper.Path.Line({
      from: new paper.Point(originX, originY),
      to: new paper.Point(originX, padding), // Padding at the top
      strokeColor: "black",
      strokeWidth: 1
    })

    // 3. Draw the parabolic trajectory.
    const path = new paper.Path()
    path.strokeColor = "blue"
    path.strokeWidth = 2

    const numPoints = 50
    for (let i = 0; i <= numPoints; i++) {
      const t_i = flightTime * (i / numPoints)
      const x = v * Math.cos(theta) * t_i
      let y = v * Math.sin(theta) * t_i - 0.5 * g * t_i * t_i
      if (y < 0) y = 0

      // Map simulation coordinates to canvas coordinates:
      const x_canvas = originX + x * scale
      const y_canvas = originY - y * scale // Subtract from originY since y increases upward

      const point = new paper.Point(x_canvas, y_canvas)
      if (i === 0) {
        path.moveTo(point)
      } else {
        path.lineTo(point)
      }
    }

    // Draw a red circle at the landing point.
    new paper.Path.Circle({
      center: path.lastSegment.point,
      radius: 4,
      fillColor: "red"
    })

    paper.view.draw()
  }, [projectileDistance, projectileVelocity, desiredAngle, scaleAdjustment])

  // Automatically run the simulation each time any of the input values change.
  useEffect(() => {
    simulate()
  }, [Mcw, mp, h, ds, dsa, dla, desiredAngle, simulate])

  // Redraw the Paper.js canvas whenever the simulation results change.
  useEffect(() => {
    drawTrajectoryPaperJS()
  }, [drawTrajectoryPaperJS])

  useEffect(() => {
    // Save the original view size.
    const originalViewSize = { width: 1000, height: 400 } // Update these values to match your starting canvas size

    const handleResize = () => {
      const canvas = paperCanvasRef.current
      if (!canvas) return

      // For instance, if the canvas element's client dimensions change:
      const newWidth = canvas.clientWidth
      const newHeight = canvas.clientHeight

      // Update the Paper.js view size.
      paper.view.viewSize = new paper.Size(newWidth, newHeight)

      // Get scale factors.
      const xScale = newWidth / originalViewSize.width
      const yScale = newHeight / originalViewSize.height

      // If you have a background raster, update its bounds:
      if (paper.project.activeLayer.children.some((item) => item instanceof paper.Raster)) {
        const backgroundRaster = paper.project.activeLayer.children.find(
          (item) => item instanceof paper.Raster
        )
        if (backgroundRaster) {
          backgroundRaster.bounds = paper.view.bounds
        }
      }

      // Reposition and scale the active layer so that the sketch stays proportional:
      paper.project.activeLayer.position.x *= xScale
      paper.project.activeLayer.position.y *= yScale
      paper.project.activeLayer.scale(xScale, yScale)

      // Redraw the view to apply changes.
      paper.view.draw()
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [paperCanvasRef])

  return (
    <div style={{ padding: "1rem" }}>
      <h1>Trebuchet Physics Tool</h1>
      <p>
        Adjust the trebuchet parameters and the desired release angle. The simulation updates
        automatically:
      </p>
      <div>
        <div style={{ marginBottom: "0.5rem" }}>
          <label>
            Mass of Counterweight (Mcw):
            <input
              type="number"
              value={Mcw}
              onChange={(e) => setMcw(Number(e.target.value))}
              style={{ marginLeft: "0.5rem" }}
            />
          </label>
        </div>
        <div style={{ marginBottom: "0.5rem" }}>
          <label>
            Mass of Projectile (mp):
            <input
              type="number"
              value={mp}
              onChange={(e) => setMp(Number(e.target.value))}
              style={{ marginLeft: "0.5rem" }}
            />
          </label>
        </div>
        <div style={{ marginBottom: "0.5rem" }}>
          <label>
            Height of Pivot (h):
            <input
              type="number"
              value={h}
              onChange={(e) => setH(Number(e.target.value))}
              style={{ marginLeft: "0.5rem" }}
            />
          </label>
        </div>
        <div style={{ marginBottom: "0.5rem" }}>
          <label>
            Sling Length (ds):
            <input
              type="number"
              value={ds}
              onChange={(e) => setDs(Number(e.target.value))}
              style={{ marginLeft: "0.5rem" }}
            />
          </label>
        </div>
        <div style={{ marginBottom: "0.5rem" }}>
          <label>
            Length of Short Arm (dsa):
            <input
              type="number"
              value={dsa}
              onChange={(e) => setDsa(Number(e.target.value))}
              style={{ marginLeft: "0.5rem" }}
            />
          </label>
        </div>
        <div style={{ marginBottom: "0.5rem" }}>
          <label>
            Length of Long Arm (dla):
            <input
              type="number"
              value={dla}
              onChange={(e) => setDla(Number(e.target.value))}
              style={{ marginLeft: "0.5rem" }}
            />
          </label>
        </div>
        <div style={{ marginBottom: "0.5rem" }}>
          <label>
            Desired Release Angle (°):
            <input
              type="number"
              value={desiredAngle}
              onChange={(e) => setDesiredAngle(Number(e.target.value))}
              style={{ marginLeft: "0.5rem" }}
            />
          </label>
        </div>
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <label style={{ display: "block", marginBottom: "0.5rem" }}>Visible Scale:</label>
        <input
          type="range"
          min="0.1"
          max="20"
          step="0.1"
          value={scaleAdjustment}
          onChange={(e) => setScaleAdjustment(Number(e.target.value))}
          style={{ width: "100%" }}
        />
      </div>

      {releaseTime !== null && (
        <div style={{ marginTop: "1rem" }}>
          <h2>Results</h2>
          <p>Simulated Release Time: {releaseTime} seconds</p>
          <p>Projectile Distance: {projectileDistance} meters</p>
          {/* Render a Paper.js canvas for enhanced visuals */}
          <div style={{ marginTop: "1rem" }}>
            <canvas
              ref={paperCanvasRef}
              width={1000}
              height={660}
              style={{ border: "1px solid #ccc" }}></canvas>
          </div>
        </div>
      )}
    </div>
  )
}

export default TrebuchetTool
