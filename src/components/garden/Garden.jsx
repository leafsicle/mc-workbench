import React, { useState } from "react"
import { Box } from "@mui/material"
import { Grid } from "@mui/material"
import { plants as plantData } from "../../data/plants"
import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogTitle from "@mui/material/DialogTitle"
import CloseIcon from "@mui/icons-material/Close"
import Input from "@mui/material/Input"
import Select from "@mui/material/Select"
import MenuItem from "@mui/material/MenuItem"
import OutlinedInput from "@mui/material/OutlinedInput"
// import { useQuery } from "@apollo/client"
// import { GET_PLANTS } from "./queries"
import ImageCard from "@/components/ui/image-card"
import { useNavigate } from "react-router-dom"

const Garden = () => {
  const navigate = useNavigate()
  const [query, setQuery] = useState("")
  const [isOpen, setIsOpen] = useState(false)

  const handleAddPlant = () => {
    setIsOpen(!isOpen)
  }

  // const { data, errors, loading } = useQuery(GET_PLANTS)
  // let plantInfo = data?.plants || []

  const filterPlants = (plants, query) => {
    if (!query) {
      return plants
    }
    return plants.filter((plant) => {
      const plantName = plant.name.toLowerCase()
      return plantName.includes(query)
    })
  }
  const filteredPlants = filterPlants(plantData, query)
  // if (loading) return "Loading..."
  // if (errors) return `Error! ${errors.message}`
  return (
    <Box style={{ padding: "2rem" }}>
      <Box className="flex flex-row justify-center gap-2 mb-2">
        <input
          type="text"
          placeholder="Search for a plant"
          value={query}
          className="max-w-sm text-white"
          autoFocus
          onChange={(e) => setQuery(e.target.value)}
        />
        {/* <Button
          text="add plants"
          color="primary"
          variant="contained"
          hidden={true}
          className="max-w-sm text-white"
          onClick={handleAddPlant}>
          Add Plant
        </Button> */}
      </Box>
      <h1 className="text-2xl font-bold text-white text-center mb-4">Current Plants</h1>
      <Grid container flexWrap="wrap" spacing={2}>
        {filteredPlants.map((plant, idx) => {
          return (
            <Grid item xs={12} sm={6} md={3} key={idx} style={{ padding: ".5rem" }}>
              <Box
                className="flex flex-col items-center justify-center gap-3"
                onClick={() => navigate(`/garden`)}
                style={{ cursor: "pointer" }}>
                <ImageCard imageUrl={plant.image} caption={plant.name} />
              </Box>
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
