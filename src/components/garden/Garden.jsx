import React, { useState } from 'react'
import { Box } from '@mui/material'
import { Grid } from '@mui/material'
import { plants } from '../../data/plants'
import PlantCard from '../cards/plantCard/PlantCard'
import Button from '@mui/material/Button'
import { toast } from 'react-toastify'
import Dialog from '@mui/material/Dialog'
import CloseIcon from '@mui/icons-material/Close'
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
        <Dialog open={!isOpen} onClose={() => setIsOpen(false)} fullWidth>
          <Grid container>
            <Grid item xs={12}>
              <Button
                text='add plants'
                color='primary'
                variant='contained'
                onClick={() => setIsOpen(!isOpen)}
                style={{ float: 'right' }}
              >
                <CloseIcon />
              </Button>
              <h1>Add a plant modal!</h1>
              <input type='text' placeholder='name' />
              <input type='text' placeholder='quantity' />
              <input type='text' placeholder='watering frequency' />
              <input type='text' placeholder='sunlight' />
            </Grid>
          </Grid>
        </Dialog>
      </Grid>
    </Box>
  )
}
export default Garden
