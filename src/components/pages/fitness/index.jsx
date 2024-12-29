import React, { useState, useEffect } from "react"
import { DateTime } from "luxon"
import { Typography, Paper, createTheme } from "@mui/material"
import { styled } from "@mui/material/styles"
import Template from "../template"
import { parse } from "papaparse"
import { v4 as uuidv4 } from "uuid"
import { groupWorkoutsByDate } from "./utils"
import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"

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
  const sortedGroups = groupWorkoutsByDate(workouts)

  return (
    <Template pageTitle="Fitness">
      {sortedGroups.slice(0, 100).map((workout, index) => (
        <Accordion key={index} sx={{ mt: 2 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6" gutterBottom color="primary">
              {workout.title}:{" "}
              {DateTime.fromISO(workout.start_time)
                .setZone("America/New_York")
                .toLocaleString(DateTime.DATE_MED)}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            {workout.exercises.map((exercise, index) => (
              <div key={index}>
                <Typography variant="body1" gutterBottom color="primary">
                  {exercise.title}: {exercise.sets.length} sets
                </Typography>
              </div>
            ))}
          </AccordionDetails>
        </Accordion>
      ))}
    </Template>
  )
}

export default Fitness
