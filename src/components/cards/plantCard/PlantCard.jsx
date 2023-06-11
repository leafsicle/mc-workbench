import React, { useState } from 'react'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { Grid } from '@mui/material'

const PlantCard = ({ plant, useGlow = true }) => {
  const [hideDescription, setHideDescription] = useState(true)
  // set the style of the card based on the useGlow prop
  return (
    <Grid item xs={12} sm={6} md={4}>
      <Card
        onClick={() => setHideDescription(!hideDescription)}
        x={{
          boxShadow: useGlow ? '0 0 10px 0 rgba(0, 230, 0, 0.2)' : 'none',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            boxShadow: useGlow ? '0 0 30px 0 rgba(20, 230, 0, 0.7)' : 'none',
            transition: 'all 0.2s ease-in-out'
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
              maxHeight: '40%'
            }}
          >
            {!hideDescription && plant.description}
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  )
}
export default PlantCard
