import React, { useState } from 'react'
import { Box } from '@mui/material'
import { Grid } from '@mui/material'
import { plants } from '../../data/plants'
import PlantCard from '../cards/plantCard/PlantCard'
import Button from '@mui/material/Button'
import { toast } from 'react-toastify'

const Garden = () => {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)

  const callToast = () => {
    toast('This will be a modal', {
      type: toast.TYPE.SUCCESS,
      position: toast.POSITION.TOP_CENTER,
      autoClose: 1500,
      key: 'submit'
    })
  }

  const handleAddPlant = () => {
    setIsOpen(!isOpen)
    callToast()
  }

  // fitler plants functon
  const filterPlants = (plants, query) => {
    if (!query) {
      return plants
    }
    return plants.filter(plant => {
      const plantName = plant.name.toLowerCase()
      return plantName.includes(query)
    })
  }
  const filteredPlants = filterPlants(plants, query)

  return (
    <Box style={{ padding: '2rem' }}>
      <h1>Current Plants</h1>
      <Box style={{ marginBottom: '1rem' }}>
        <input
          type='text'
          placeholder='Search for a plant'
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        <Button
          text='add plants'
          color='primary'
          variant='contained'
          onClick={handleAddPlant}
        >
          Add Plant
        </Button>
      </Box>
      <Box style={{ marginBottom: '1rem' }}>
        {isOpen && <h1 style={{ color: 'white' }}> This is Modal</h1>}
      </Box>
      <Grid container flexWrap='wrap' spacing={2}>
        {filteredPlants.map(plant => {
          return (
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              lg={3}
              key={plant.id}
              style={{ padding: '.5rem' }}
            >
              <PlantCard plant={plant} key={plant.id} />
            </Grid>
          )
        })}
      </Grid>
    </Box>
  )
}
export default Garden
