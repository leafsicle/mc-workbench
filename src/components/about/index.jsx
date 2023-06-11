import React, { useState, useEffect } from 'react'
const About = () => {
  const [isPressed, setIsPressed] = useState(false)
  const [duration, setDuration] = useState(0)
  const [lastTime, setLastTime] = useState(0)
  const [message, setMessage] = useState('')
  // set the window title
  useEffect(() => {
    document.title = 'Tapchat'
  }, [])
  useEffect(() => {
    let timerId

    if (isPressed) {
      const startTime = Date.now()
      timerId = setInterval(() => {
        setDuration(Date.now() - startTime)
      }, 50) // Update duration every 100 milliseconds (adjust as needed)
    } else {
      clearInterval(timerId)
    }

    return () => {
      clearInterval(timerId)
    }
  }, [isPressed])

  const handleMouseDown = () => {
    setIsPressed(true)
  }
  const handleDuration = () => {
    if (lastTime > 200 && lastTime < 600) {
      setMessage(message + '-')
    } else {
      setMessage(message + '.')
    }
  }

  const handleMouseUp = () => {
    setIsPressed(false)
    setLastTime(duration)
    handleDuration()
    setDuration(0)
  }
  return (
    <div>
      <button onMouseDown={handleMouseDown} onMouseUp={handleMouseUp}>
        Click Me
      </button>
      <button
        onClick={() => {
          setLastTime(0)
          setMessage('')
        }}
      >
        Reset
      </button>
      <h1>{message}</h1>
      <p>Duration: {lastTime}ms</p>
    </div>
  )
}
export default About
