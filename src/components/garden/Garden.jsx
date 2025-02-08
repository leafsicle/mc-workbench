import React, { useState } from "react"
import { Box } from "@mui/material"
import { Grid } from "@mui/material"
// import { plants as plantData } from '../../data/plants'
import PlantCard from "../cards/plantCard/PlantCard"
import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogTitle from "@mui/material/DialogTitle"
import CloseIcon from "@mui/icons-material/Close"
import Input from "@mui/material/Input"
import Select from "@mui/material/Select"
import MenuItem from "@mui/material/MenuItem"
import OutlinedInput from "@mui/material/OutlinedInput"
import { useQuery } from "@apollo/client"
import { GET_PLANTS } from "./queries"

const Garden = () => {
  const [query, setQuery] = useState("")
  const [isOpen, setIsOpen] = useState(false)

  const handleAddPlant = () => {
    setIsOpen(!isOpen)
  }

  const { data, errors, loading } = useQuery(GET_PLANTS)
  let plantInfo = data?.plants || []

  const filterPlants = (plants, query) => {
    if (!query) {
      return plants
    }
    return plants.filter((plant) => {
      const plantName = plant.name.toLowerCase()
      return plantName.includes(query)
    })
  }
  const filteredPlants = filterPlants(plantInfo, query)
  if (loading) return "Loading..."
  if (errors) return `Error! ${errors.message}`
  return (
    <Box style={{ padding: "2rem" }}>
      <h1>Current Plants</h1>
      <Box style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="Search for a plant"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Button text="add plants" color="primary" variant="contained" onClick={handleAddPlant}>
          Add Plant
        </Button>
      </Box>
      <Grid container flexWrap="wrap" spacing={2}>
        {filteredPlants.map((plant, idx) => {
          return (
            <Grid item xs={12} sm={6} md={4} lg={3} key={idx} style={{ padding: ".5rem" }}>
              <PlantCard plant={plant} />
            </Grid>
          )
        })}
        <Dialog open={isOpen} onClose={() => setIsOpen(false)} fullWidth>
          <DialogTitle>
            Add a plant modal!
            <Button
              text="add plants"
              color="primary"
              variant="contained"
              onClick={() => setIsOpen(!isOpen)}
              style={{ float: "right" }}>
              <CloseIcon />
            </Button>
          </DialogTitle>
          <Grid container>
            <Grid container style={{ padding: "2rem" }} spacing={1}>
              <Grid item xs={12} sm={6}>
                <Input fullWidth id="name" placeholder="name" />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Input fullWidth id="quanitity" placeholder="quanitity" />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="Watering Frequency"
                  fullWidth
                  defaultValue={10}
                  input={<OutlinedInput label={"label-text"} placeholder="Watering Frequency" />}>
                  <MenuItem value={10}>Daily</MenuItem>
                  <MenuItem value={20}>Weekly</MenuItem>
                  <MenuItem value={30}>Monthly</MenuItem>
                </Select>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Input fullWidth id="sunlight" placeholder="sunlight" />
              </Grid>
            </Grid>
          </Grid>
        </Dialog>
      </Grid>
    </Box>
  )
}
export default Garden
