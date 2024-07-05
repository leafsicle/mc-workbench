import React, { useEffect, useRef, useState } from 'react'
import { Box, Slider } from '@mui/material'

const drawCircle = (canvasRef, blurRadius, canvasBodyText) => event => {
  const canvas = canvasRef.current
  const ctx = canvas.getContext('2d')
  const rect = canvas.getBoundingClientRect()
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top
  const radius = blurRadius

  ctx.clearRect(0, 0, canvas.width, canvas.height)
  // First shadow
  ctx.beginPath()
  ctx.arc(x, y, radius, 0, 2 * Math.PI, false)
  ctx.shadowBlur = 450 // Adjust the value to get the desired fuzziness
  ctx.shadowColor = 'rgba(0,0,255,1)'
  ctx.fillStyle = 'rgba(244,255,0,0.5)'
  ctx.fill()
  // Second shadow
  ctx.beginPath()
  ctx.arc(x, y, radius, 0, 2 * Math.PI, false)
  ctx.shadowBlur = 250 // Adjust the value to get the desired fuzziness
  ctx.shadowColor = 'rgba(244,255,0,1)'
  ctx.fillStyle = 'rgba(244,255,0,0.5)'
  ctx.fill()

  // Third shadow
  ctx.beginPath()
  ctx.arc(x, y, radius, 0, 2 * Math.PI, false)
  ctx.shadowBlur = 150 // Adjust the value to get the desired fuzziness
  ctx.shadowColor = 'rgba(0,0,255,1)'
  ctx.fillStyle = 'rgba(244,255,0,0.5)'
  ctx.fill()

  // Text wrapping
  const maxWidth = 400
  const lineHeight = 30
  const xText = 150
  const yText = 150
  ctx.font = '30px Arial'
  ctx.fillStyle = 'black'
  wrapText(ctx, canvasBodyText, xText, yText, maxWidth, lineHeight)
}

const wrapText = (ctx, text, x, y, maxWidth, lineHeight) => {
  const words = text.split(' ')
  let line = ''
  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' '
    const metrics = ctx.measureText(testLine)
    const testWidth = metrics.width
    if (testWidth > maxWidth && n > 0) {
      ctx.fillText(line, x, y)
      line = words[n] + ' '
      y += lineHeight
    } else {
      line = testLine
    }
  }
  ctx.fillText(line, x, y)
}

const PlainPage = () => {
  const canvasBodyText =
    "Looks like you found this in the dark but that page doesn't exist"
  const canvasRef = useRef(null)
  const [blurRadius, setBlurRadius] = useState(20)

  useEffect(() => {
    const canvas = canvasRef.current
    const handler = drawCircle(canvasRef, blurRadius, canvasBodyText)

    canvas.addEventListener('mousemove', handler)
    return () => {
      canvas.removeEventListener('mousemove', handler)
    }
  }, [blurRadius, canvasBodyText])

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    drawCircle(
      canvasRef,
      blurRadius,
      canvasBodyText
    )({ clientX: canvas.width / 2, clientY: canvas.height / 2 })
  }, [canvasBodyText, blurRadius])

  return (
    <Box
      style={{
        backgroundColor: 'white',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
      }}
    >
      <Box style={{ backgroundColor: 'black' }}>
        <Box
          style={{
            width: '50%',
            margin: 'auto',
            height: '100px',
            paddingTop: '50px'
          }}
        >
          <Slider
            aria-label='Volume'
            value={blurRadius}
            min={30}
            max={100}
            step={5}
            onChange={(event, newValue) => {
              setBlurRadius(newValue)
            }}
          />
        </Box>

        <canvas
          ref={canvasRef}
          id='canvas'
          height={window.innerHeight - 100}
          width={window.innerWidth}
          style={{ border: '1px solid black' }}
        ></canvas>
      </Box>
    </Box>
  )
}

export default PlainPage
