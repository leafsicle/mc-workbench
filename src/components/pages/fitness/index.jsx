import React, { useState, useEffect } from "react"
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  List,
  ListItem,
  ListItemText,
  Paper,
  Grid,
  CssBaseline,
  ThemeProvider,
  createTheme,
} from "@mui/material"
import useToast from "../../../hooks/useToast"
import { styled } from "@mui/material/styles"
import Template from "../template"
import { parse } from "papaparse"
import { v4 as uuidv4 } from "uuid"
import { DateTime } from "luxon"
//import data
// Create a dark theme
const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#90caf9", // A lighter blue for better contrast in dark mode
    },
    background: {
      default: "#303030",
      paper: "#424242",
    },
  },
})

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginTop: theme.spacing(3),
  backgroundColor: theme.palette.background.paper,
}))

const serializeWorkoutToJSON = workout => {
  const groups = {}
  workout.forEach(item => {
    // Parse the timestamp and convert it to Eastern Standard Time
    const zonedTime = DateTime.fromISO(item.start_time, { zone: "utc" }).setZone("America/New_York")
    // Format the time to a consistent string
    const formattedTime = zonedTime.toFormat("yyyy-MM-dd HH:mm:ssZZ")

    if (!groups[formattedTime]) {
      groups[formattedTime] = []
    }
    groups[formattedTime].push(item)
  })
  return groups
}

const Fitness = () => {
  const [workouts, setWorkouts] = useState([])

  useEffect(() => {
    fetch("/src/data/workouts.csv")
      .then(response => response.text())
      .then(csvText => {
        const parsedData = parse(csvText, { header: true }).data

        // Add a unique UUID to each workout
        const workoutsWithUUID = parsedData.map(workout => ({
          ...workout,
          id: uuidv4(),
        }))

        setWorkouts(workoutsWithUUID)

        // Save the workouts with UUIDs to local storage
        localStorage.setItem("workouts_with_uuid", JSON.stringify(workoutsWithUUID))
      })
  }, [])

  console.log(serializeWorkoutToJSON(workouts))

  return (
    <Template pageTitle="Fitness">
      <Typography variant="h6" gutterBottom color="primary">
        {workouts.map((workout, index) => (
          <Typography key={index} variant="h6" gutterBottom color="primary">
            {workout.name}
          </Typography>
        ))}
      </Typography>
    </Template>
  )
}

export default Fitness
