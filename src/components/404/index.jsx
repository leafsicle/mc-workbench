import React from "react"
import { plants } from "../../data/plants"
import PlantCard from "../cards/PlantCard"
import Grid from "@mui/material/Grid"
import Typography from "@mui/material/Typography"

const NotFound = () => {
  const chosenOne = () => {
    const plant = plants[Math.floor(Math.random() * plants.length)]
    return plant
  }
  const plant = chosenOne()

  return (
    <Grid container spacing={2} flexDirection="column" alignItems="center">
      <Grid item xs={12}>
        <Typography variant="h3">404</Typography>
      </Grid>
      <Grid
        item
        xs={12}
        style={{
          margin: "0 auto",
          maxWidth: "500px",
          width: "100%"
        }}>
        <PlantCard plant={plant} useGlow={false} />
      </Grid>
    </Grid>
  )
}
export default NotFound
