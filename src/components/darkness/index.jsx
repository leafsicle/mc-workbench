import React, { useEffect, useRef } from 'react'
import { Box } from '@mui/material'
import Slider from '@mui/material/Slider'
const PlainPage = () => {
  const canvasRef = useRef(null)
  const [blurRadius, setBlurRadius] = React.useState(20)
  const drawCircle = event => {
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
    // Add text to the canvas
    ctx.font = '30px Arial'
    ctx.fillStyle = 'black'
    ctx.fillText('Your text here', 150, 150)
  }
  useEffect(() => {
    const canvas = canvasRef.current
    const drawCircle = event => {
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
      // Add text to the canvas
      ctx.font = '30px Arial'
      ctx.fillStyle = 'black'
      ctx.fillText('Your text here', 150, 150)
    }

    canvas.addEventListener('mousemove', drawCircle)
    return () => {
      canvas.removeEventListener('mousemove', drawCircle)
    }
  }, [blurRadius])

  useEffect(() => {
    const canvas = canvasRef.current
    canvas.addEventListener('mousemove', drawCircle)
    return () => {
      canvas.removeEventListener('mousemove', drawCircle)
    }
  }, [])

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
        <Slider
          aria-label='Volume'
          value={blurRadius}
          onChange={(event, newValue) => {
            setBlurRadius(newValue)
          }}
        />
        <canvas
          ref={canvasRef}
          id='canvas'
          height={window.innerHeight - 100}
          width={window.innerWidth - 100}
          style={{ border: '1px solid black' }}
        ></canvas>
      </Box>
    </Box>
  )
}

export default PlainPage
