import React, { useState, useEffect } from "react"
import { DateTime } from "luxon"
import { Typography, Paper, createTheme, Pagination } from "@mui/material"
import { styled } from "@mui/material/styles"
import Template from "../template"
import { parse } from "papaparse"
import { v4 as uuidv4 } from "uuid"
import { groupWorkoutsByDate } from "./utils"
import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"

const ITEMS_PER_PAGE = 10

const Fitness = () => {
  const [workouts, setWorkouts] = useState([])
  const [page, setPage] = useState(1)

  useEffect(() => {
    const fetchAndProcessWorkouts = async () => {
      try {
        const response = await fetch("/src/data/workouts.csv")
        const csvText = await response.text()
        const parsedData = parse(csvText, { header: true }).data

        // First, add UUIDs to the raw workout data
        const workoutsWithUUID = parsedData.map(workout => ({
          ...workout,
          workout_id: uuidv4() // Using workout_id to avoid conflicts
        }))

        setWorkouts(workoutsWithUUID)
        localStorage.setItem("workouts_with_uuid", JSON.stringify(workoutsWithUUID))
      } catch (error) {
        console.error("Error loading workouts:", error)
      }
    }

    fetchAndProcessWorkouts()
  }, [])

  const sortedGroups = groupWorkoutsByDate(workouts)
  const totalPages = Math.ceil(sortedGroups.length / ITEMS_PER_PAGE)
  const currentWorkouts = sortedGroups.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  )

  const handlePageChange = (event, value) => {
    setPage(value)
  }

  return (
    <Template pageTitle="Fitness">
      {currentWorkouts.map((workout, index) => (
        <Accordion key={`workout-${workout.workout_id || index}`} sx={{ mt: 2 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6" gutterBottom color="primary">
              {workout.title}:{" "}
              {DateTime.fromISO(workout.start_time)
                .setZone("America/New_York")
                .toLocaleString(DateTime.DATE_MED)}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            {workout.exercises.map((exercise, exerciseIndex) => (
              <div key={`${workout.workout_id}-exercise-${exerciseIndex}`}>
                <Typography variant="body1" gutterBottom color="primary">
                  {exercise.title}: {exercise.sets.length} sets
                </Typography>
              </div>
            ))}
          </AccordionDetails>
        </Accordion>
      ))}
      <Pagination
        count={totalPages}
        page={page}
        onChange={handlePageChange}
        sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}
      />
    </Template>
  )
}

export default Fitness
