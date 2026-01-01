import React, { useState, useRef, useEffect, useCallback } from "react"
import paper from "paper"
import { Box, Typography, Stack, useTheme } from "@mui/material"
import InputField from "@/components/input/InputField"

const DataDisplay = ({ releaseTime, projectileDistance, projectileVelocity }) => {
  return (
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
  )
}

const TrebuchetTool = () => {
  const [Mcw, setMcw] = useState(100)
  const [mp, setMp] = useState(10)
  const [h, setH] = useState(10)
  const [ds, setDs] = useState(5)
  const [dsa, setDsa] = useState(2)
  const [dla, setDla] = useState(4)
  const [desiredAngle, setDesiredAngle] = useState(45)
  const [releaseTime, setReleaseTime] = useState(null)
  const [projectileDistance, setProjectileDistance] = useState(null)
  const [projectileVelocity, setProjectileVelocity] = useState(null)
  const [validationWarnings, setValidationWarnings] = useState([])

  const paperCanvasRef = useRef(null)
  const containerRef = useRef(null)
  const theme = useTheme()

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
    // Ensure distance is never negative
    setProjectileDistance(Math.max(0, range).toFixed(3))
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
    const scale = Math.min(scaleX, scaleY) * 0.8

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

    // Draw launch angle label near the origin point
    new paper.PointText({
      point: new paper.Point(originX + 30, originY - 30),
      content: `${desiredAngle}°`,
      fillColor: "white",
      fontSize: 14,
      fontWeight: "bold",
      justification: "left"
    })

    // Draw apex point
    const t_apex = (v * Math.sin(theta)) / g
    const x_apex = v * Math.cos(theta) * t_apex
    const y_apex = H_max
    const x_apex_canvas = originX + x_apex * scale
    const y_apex_canvas = originY - y_apex * scale
    const apexPoint = new paper.Point(x_apex_canvas, y_apex_canvas)

    new paper.Path.Circle({
      center: apexPoint,
      radius: 4,
      fillColor: "orange"
    })

    // Draw height label above the apex point
    new paper.PointText({
      point: new paper.Point(apexPoint.x, apexPoint.y - 20),
      content: `${H_max.toFixed(1)}m`,
      fillColor: "white",
      fontSize: 14,
      fontWeight: "bold",
      justification: "center"
    })

    // Draw landing point
    const landingPoint = path.lastSegment.point
    new paper.Path.Circle({
      center: landingPoint,
      radius: 4,
      fillColor: "red"
    })

    // Draw distance label above the landing point
    new paper.PointText({
      point: new paper.Point(landingPoint.x, landingPoint.y - 20),
      content: `${parseFloat(projectileDistance).toFixed(1)}m`,
      fillColor: "white",
      fontSize: 14,
      fontWeight: "bold",
      justification: "center"
    })

    paper.view.draw()
  }, [projectileDistance, projectileVelocity, desiredAngle])

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

  // Validate physics constraints
  useEffect(() => {
    const warnings = []

    if (mp >= Mcw) {
      warnings.push(
        "Warning: Projectile mass should be much less than counterweight mass for realistic physics"
      )
    }

    if (dla <= dsa) {
      warnings.push(
        "Warning: Long arm should be longer than short arm for proper trebuchet mechanics"
      )
    }

    if (Mcw < mp * 10) {
      warnings.push("Tip: Counterweight should typically be 10-100x heavier than the projectile")
    }

    setValidationWarnings(warnings)
  }, [Mcw, mp, dsa, dla])

  // Run simulation when parameters change
  useEffect(() => {
    simulate()
  }, [Mcw, mp, h, ds, dsa, dla, desiredAngle, simulate])

  // Update visualization when results change
  useEffect(() => {
    drawTrajectoryPaperJS()
  }, [drawTrajectoryPaperJS])

  const fieldDefinitions = [
    {
      key: "counterweight",
      label: (
        <>
          Counterweight Mass (<span style={{ color: theme.palette.secondary.main }}>kg</span>)
        </>
      ),
      value: Mcw,
      onChange: (e) => {
        const value = Number(e.target.value)
        setMcw(Math.max(1, Math.min(1000, value)))
      },
      type: "number",
      inputProps: { min: 1, max: 1000, step: 1 }
    },
    {
      key: "projectile",
      label: (
        <>
          Projectile Mass (<span style={{ color: theme.palette.secondary.main }}>kg</span>)
        </>
      ),
      value: mp,
      onChange: (e) => {
        const value = Number(e.target.value)
        setMp(Math.max(0.1, Math.min(100, value)))
      },
      inputProps: { min: 0.1, max: 100, step: 0.1 }
    },
    {
      key: "pivot",
      label: (
        <>
          Pivot Height (<span style={{ color: theme.palette.secondary.main }}>m</span>)
        </>
      ),
      value: h,
      onChange: (e) => {
        const value = Number(e.target.value)
        setH(Math.max(0.1, Math.min(20, value)))
      },
      inputProps: { min: 0.1, max: 20, step: 0.1 }
    },
    {
      key: "sling",
      label: (
        <>
          Sling Length (<span style={{ color: theme.palette.secondary.main }}>m</span>)
        </>
      ),
      value: ds,
      onChange: (e) => {
        const value = Number(e.target.value)
        setDs(Math.max(0.1, Math.min(10, value)))
      },
      inputProps: { min: 0.1, max: 10, step: 0.1 }
    },
    {
      key: "shortArm",
      label: (
        <>
          Short Arm Length (<span style={{ color: theme.palette.secondary.main }}>m</span>)
        </>
      ),
      value: dsa,
      onChange: (e) => {
        const value = Number(e.target.value)
        setDsa(Math.max(0.1, Math.min(5, value)))
      },
      inputProps: { min: 0.1, max: 5, step: 0.1 }
    },
    {
      key: "longArm",
      label: (
        <>
          Long Arm Length (<span style={{ color: theme.palette.secondary.main }}>m</span>)
        </>
      ),
      value: dla,
      onChange: (e) => {
        const value = Number(e.target.value)
        setDla(Math.max(0.1, Math.min(10, value)))
      },
      inputProps: { min: 0.1, max: 10, step: 0.1 }
    },
    {
      key: "releaseAngle",
      label: (
        <>
          Release Angle (<span style={{ color: theme.palette.secondary.main }}>°</span>)
        </>
      ),
      value: desiredAngle,
      onChange: (e) => {
        const value = Number(e.target.value)
        // Cap angle between 0 and 90 degrees
        setDesiredAngle(Math.max(0, Math.min(90, value)))
      },
      inputProps: { min: 0, max: 90, step: 1 }
    }
  ]

  const Title = () => {
    return (
      <Typography variant="h4" color={theme.palette.text.primary} sx={{ mb: 2 }}>
        Trebuchet Physics Tool
      </Typography>
    )
  }

  return (
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "column", p: 2 }}>
      <Title />

      <Box sx={{ display: "flex", gap: 2, flex: 1, minHeight: 0, overflow: "hidden" }}>
        {/* Left panel - Controls */}
        <Stack spacing={2} sx={{ width: 280, flexShrink: 0, overflowY: "auto", paddingTop: 2 }}>
          <Box>
            <Stack spacing={2}>
              {fieldDefinitions.map((field) => (
                <InputField
                  key={field.key}
                  label={field.label}
                  type="number"
                  value={field.value}
                  onChange={field.onChange}
                  size="small"
                  fullWidth
                  inputProps={field.inputProps}
                />
              ))}
            </Stack>
          </Box>

          {validationWarnings.length > 0 && (
            <Box
              sx={{
                p: 2,
                bgcolor: "warning.light",
                borderRadius: 1,
                border: 1,
                borderColor: "warning.main"
              }}>
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: "bold", mb: 1, color: "warning.dark" }}>
                Physics Alerts
              </Typography>
              <Stack spacing={0.5}>
                {validationWarnings.map((warning, index) => (
                  <Typography
                    key={index}
                    variant="body2"
                    sx={{ color: "warning.dark", fontSize: "0.75rem" }}>
                    • {warning}
                  </Typography>
                ))}
              </Stack>
            </Box>
          )}

          {releaseTime !== null && (
            <DataDisplay
              releaseTime={releaseTime}
              projectileDistance={projectileDistance}
              projectileVelocity={projectileVelocity}
            />
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
            borderColor: "grey.300",
            height: "600px"
          }}>
          <Box
            ref={containerRef}
            sx={{ width: "100%", height: "400px", position: "relative", marginBottom: 2 }}>
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
