import React, { useState } from 'react'
import { Box } from '@mui/material'
import { Grid } from '@mui/material'
import { plants } from '../../data/plants'
import PlantCard from '../cards/plantCard/PlantCard'

const Garden = () => {
  const [query, setQuery] = useState('')

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
    <Box>
      <h1>Current Plants</h1>
      <input
        type='text'
        placeholder='Search for a plant'
        value={query}
        onChange={e => setQuery(e.target.value)}
      />
      <Grid container flexWrap='wrap'>
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
