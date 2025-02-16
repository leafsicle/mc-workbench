import React, { useState, useRef, useEffect, useCallback } from "react"
import paper from "paper"
import { Box, Typography, Stack, TextField, Slider } from "@mui/material"

const TrebuchetTool = () => {
  const [Mcw, setMcw] = useState(1000)
  const [mp, setMp] = useState(10)
  const [h, setH] = useState(10)
  const [ds, setDs] = useState(5)
  const [dsa, setDsa] = useState(2)
  const [dla, setDla] = useState(4)
  const [desiredAngle, setDesiredAngle] = useState(45)
  const [releaseTime, setReleaseTime] = useState(null)
  const [projectileDistance, setProjectileDistance] = useState(null)
  const [projectileVelocity, setProjectileVelocity] = useState(null)
  const [scaleAdjustment, setScaleAdjustment] = useState(1)

  const paperCanvasRef = useRef(null)
  const containerRef = useRef(null)

  // Set up Paper.js on component mount
  useEffect(() => {
    if (paperCanvasRef.current) {
      paper.setup(paperCanvasRef.current)
      // Initial resize to fit container
      handleResize()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const simulate = useCallback(() => {
    const desiredAngleRad = desiredAngle * (Math.PI / 180)
    const g = 9.81

    const a = (Mcw * g) / (dsa + dla)
    let t = 0
    const dt = 0.001
    let slingAngle = 0

    while (slingAngle < desiredAngleRad && t < 10) {
      t += dt
      slingAngle = 0.5 * a * t * t
    }

    setReleaseTime(t.toFixed(3))
    const v = ds * a * t
    setProjectileVelocity(v.toFixed(3))
    const range = (v * v * Math.sin(2 * desiredAngleRad)) / g
    setProjectileDistance(range.toFixed(3))
  }, [Mcw, ds, dsa, dla, desiredAngle])

  const drawTrajectoryPaperJS = useCallback(() => {
    if (!projectileDistance || !projectileVelocity || !paper.project) return

    const v = parseFloat(projectileVelocity)
    const theta = desiredAngle * (Math.PI / 180)
    const g = 9.81
    const flightTime = (2 * v * Math.sin(theta)) / g
    const range = parseFloat(projectileDistance)
    const H_max = (v * v * Math.sin(theta) * Math.sin(theta)) / (2 * g)

    paper.project.clear()

    const canvas = paperCanvasRef.current
    if (!canvas) return

    const canvasWidth = canvas.width
    const canvasHeight = canvas.height

    // Set up the coordinate system
    const padding = 40
    const originX = padding
    const originY = canvasHeight - padding

    // Calculate available drawing space
    const availableWidth = canvasWidth - 2 * padding
    const availableHeight = canvasHeight - 2 * padding

    // Calculate scale factors
    const scaleX = availableWidth / range
    const scaleY = availableHeight / H_max
    const scale = Math.min(scaleX, scaleY) * 0.8 * scaleAdjustment

    // Draw grid
    const gridSpacing = 50
    const gridColor = new paper.Color(0.2, 0.2, 0.2, 0.1)

    for (let x = originX; x < canvasWidth - padding; x += gridSpacing) {
      new paper.Path.Line({
        from: new paper.Point(x, padding),
        to: new paper.Point(x, originY),
        strokeColor: gridColor,
        strokeWidth: 1
      })
    }

    for (let y = padding; y < originY; y += gridSpacing) {
      new paper.Path.Line({
        from: new paper.Point(originX, y),
        to: new paper.Point(canvasWidth - padding, y),
        strokeColor: gridColor,
        strokeWidth: 1
      })
    }

    // Draw axes
    new paper.Path.Line({
      from: new paper.Point(originX, originY),
      to: new paper.Point(canvasWidth - padding, originY),
      strokeColor: "black",
      strokeWidth: 2
    })

    new paper.Path.Line({
      from: new paper.Point(originX, originY),
      to: new paper.Point(originX, padding),
      strokeColor: "black",
      strokeWidth: 2
    })

    // Draw trajectory
    const path = new paper.Path()
    path.strokeColor = "blue"
    path.strokeWidth = 2
    path.moveTo(new paper.Point(originX, originY))

    const numPoints = 100
    for (let i = 0; i <= numPoints; i++) {
      const t_i = flightTime * (i / numPoints)
      const x = v * Math.cos(theta) * t_i
      let y = v * Math.sin(theta) * t_i - 0.5 * g * t_i * t_i
      if (y < 0) y = 0

      const x_canvas = originX + x * scale
      const y_canvas = originY - y * scale

      path.lineTo(new paper.Point(x_canvas, y_canvas))
    }

    // Draw origin point
    new paper.Path.Circle({
      center: new paper.Point(originX, originY),
      radius: 4,
      fillColor: "green"
    })

    // Draw landing point
    new paper.Path.Circle({
      center: path.lastSegment.point,
      radius: 4,
      fillColor: "red"
    })

    paper.view.draw()
  }, [projectileDistance, projectileVelocity, desiredAngle, scaleAdjustment])

  // Handle window resize
  const handleResize = useCallback(() => {
    if (!containerRef.current || !paperCanvasRef.current || !paper.view) return

    const container = containerRef.current
    const canvas = paperCanvasRef.current

    // Set canvas size to match container
    const width = container.clientWidth
    const height = container.clientHeight

    canvas.width = width
    canvas.height = height

    paper.view.viewSize = new paper.Size(width, height)

    // Redraw with new dimensions
    drawTrajectoryPaperJS()
  }, [drawTrajectoryPaperJS])

  useEffect(() => {
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [handleResize])

  // Run simulation when parameters change
  useEffect(() => {
    simulate()
  }, [Mcw, mp, h, ds, dsa, dla, desiredAngle, simulate])

  // Update visualization when results change
  useEffect(() => {
    drawTrajectoryPaperJS()
  }, [drawTrajectoryPaperJS])

  return (
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "column", p: 2 }}>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Trebuchet Physics Tool
      </Typography>

      <Box sx={{ display: "flex", gap: 2, flex: 1, minHeight: 0, overflow: "hidden" }}>
        {/* Left panel - Controls */}
        <Stack spacing={2} sx={{ width: 280, flexShrink: 0, overflowY: "auto", paddingTop: 2 }}>
          <Box>
            <Stack spacing={2}>
              <TextField
                label="Counterweight Mass (kg)"
                type="number"
                value={Mcw}
                onChange={(e) => setMcw(Number(e.target.value))}
                size="small"
                fullWidth
              />

              <TextField
                label="Projectile Mass (kg)"
                type="number"
                value={mp}
                onChange={(e) => setMp(Number(e.target.value))}
                size="small"
                fullWidth
              />

              <TextField
                label="Pivot Height (m)"
                type="number"
                value={h}
                onChange={(e) => setH(Number(e.target.value))}
                size="small"
                fullWidth
              />

              <TextField
                label="Sling Length (m)"
                type="number"
                value={ds}
                onChange={(e) => setDs(Number(e.target.value))}
                size="small"
                fullWidth
              />

              <TextField
                label="Short Arm Length (m)"
                type="number"
                value={dsa}
                onChange={(e) => setDsa(Number(e.target.value))}
                size="small"
                fullWidth
              />

              <TextField
                label="Long Arm Length (m)"
                type="number"
                value={dla}
                onChange={(e) => setDla(Number(e.target.value))}
                size="small"
                fullWidth
              />

              <TextField
                label="Release Angle (°)"
                type="number"
                value={desiredAngle}
                onChange={(e) => setDesiredAngle(Number(e.target.value))}
                size="small"
                fullWidth
              />

              <Box sx={{ px: 1 }}>
                <Typography gutterBottom>Scale: {scaleAdjustment.toFixed(1)}x</Typography>
                <Slider
                  value={scaleAdjustment}
                  onChange={(_, newValue) => setScaleAdjustment(Number(newValue))}
                  min={0.1}
                  max={2}
                  step={0.1}
                  valueLabelDisplay="auto"
                />
              </Box>
            </Stack>
          </Box>

          {releaseTime !== null && (
            <Box sx={{ mt: 2, p: 2, bgcolor: "grey.100", borderRadius: 1, color: "black" }}>
              <Typography variant="h6" sx={{ mb: 1 }}>
                Results
              </Typography>
              <Stack spacing={1}>
                <Typography variant="body2">Release Time: {releaseTime}s</Typography>
                <Typography variant="body2">Distance: {projectileDistance}m</Typography>
                <Typography variant="body2">Initial Velocity: {projectileVelocity}m/s</Typography>
              </Stack>
            </Box>
          )}
        </Stack>

        {/* Right panel - Visualization */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            minWidth: 0,
            minHeight: 0,
            border: 1,
            borderColor: "grey.300"
          }}>
          <Box
            ref={containerRef}
            sx={{ flex: 1, position: "relative", width: "100%", height: "100%" }}>
            <Box
              component="canvas"
              ref={paperCanvasRef}
              sx={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%"
              }}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default TrebuchetTool
