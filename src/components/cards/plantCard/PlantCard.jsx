import React, { useState } from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'

const PlantCard = ({ plant, useGlow = true }) => {
  const [hideDescription, setHideDescription] = useState(true)
  const [timerActive, setTimerActive] = useState(false)
  const handleMouseEnter = () => {
    if (timerActive) {
      setTimerActive(false)
    }
  }

  const handleMouseLeave = () => {
    setTimerActive(true)
    setTimeout(() => {
      setHideDescription(true)
      setTimerActive(false)
    }, 3000)
  }

  return (
    <Card
      key={plant.id}
      tabIndex={plant.id}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={() => setHideDescription(!hideDescription)}
      sx={{
        boxShadow: useGlow ? '0 0 10px 0 rgba(0, 230, 0, 0.2)' : 'none',
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
          boxShadow: useGlow ? '0 0 40px 0 rgba(20, 230, 0, 0.7)' : 'none',
          transition: 'all 0.2s pulse',
          transform: 'scale(1.03)'
        },
        '&:focus': {
          outline: 'none',
          boxShadow: useGlow ? '0 0 40px 0 rgba(20, 230, 0, 0.9)' : 'none',
          transition: 'all 0.2s pulse',
          transform: 'scale(1.034)'
        }
      }}
    >
      <CardMedia
        sx={{
          height: hideDescription ? '80%' : '10%'
        }}
        image={plant.image}
        title={plant.name}
        alt={plant.name}
      />
      <CardContent className='card-content'>
        <Typography variant='h5' component='div'>
          {plant.name}
        </Typography>
        <Typography
          variant='body2'
          color='text.secondary'
          style={{
            maxHeight: '40%',
            transition: 'all 0.3s ease-in-out'
          }}
        >
          {!hideDescription && plant.description}
        </Typography>
      </CardContent>
    </Card>
  )
}
export default PlantCard
