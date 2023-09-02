import React, { useEffect, useRef, useState } from 'react'
import { Box, Slider, TextField } from '@mui/material'

const drawCircle = (canvasRef, blurRadius, canvasBodyText) => event => {
  const canvas = canvasRef.current
  const ctx = canvas.getContext('2d')
  const rect = canvas.getBoundingClientRect()
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top
  const radius = blurRadius

  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.beginPath()
  ctx.arc(x, y, radius, 0, 2 * Math.PI, false)
  ctx.fillStyle = 'rgba(244,255,0,0.5)'
  ctx.fill()
  ctx.font = '30px Arial'
  ctx.fillStyle = 'black'
  ctx.fillText(canvasBodyText, 150, 150)
}

const PlainPage = () => {
  const [canvasBodyText, setCanvasBodyText] = useState('Bacon Text')
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
          <TextField
            label='Enter Display Text'
            variant='outlined'
            style={{ border: '1px solid yellow' }}
            onChange={event => setCanvasBodyText(event.target.value)}
            InputLabelProps={{
              style: { color: 'yellow' }
            }}
          />
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
