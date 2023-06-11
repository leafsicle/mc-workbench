import { Box } from '@mui/material'
import { Grid } from '@mui/material'
import { plants } from '../../data/plants'
import PlantCard from '../cards/plantCard/PlantCard'

const Garden = () => {
  return (
    <Box>
      <h1>Current Plants</h1>
      <Grid container xs={12} flexWrap='wrap'>
        {plants.map(plant => {
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
