import { Box } from '@mui/material'
import { Grid } from '@mui/material'
import { plants } from '../../data/plants'
import PlantCard from '../cards/plantCard/PlantCard'

const Garden = () => {
  return (
    <Box>
      <h1>Current Plants</h1>
      <Grid container>
        {plants.map(plant => {
          return <PlantCard plant={plant} key={plant.id} />
        })}
      </Grid>
    </Box>
  )
}
export default Garden
