import React from "react"
import { plants } from "../../data/plants"
import Grid from "@mui/material/Grid"
import Typography from "@mui/material/Typography"
import ImageCard from "@/components/ui/image-card"

const NotFound = () => {
  const chosenOne = () => {
    const plant = plants[Math.floor(Math.random() * plants.length)]
    return plant
  }
  const plant = chosenOne()

  return (
    <Grid container spacing={2} flexDirection="column" alignItems="center">
      <Grid item xs={12}>
        <Typography variant="h3" color="text.darkBackground">
          404
        </Typography>
      </Grid>
      <Grid
        item
        xs={12}
        style={{
          margin: "0 auto",
          maxWidth: "500px"
        }}>
        <ImageCard imageUrl={plant.image} caption={plant.name}></ImageCard>
      </Grid>
    </Grid>
  )
}
export default NotFound
