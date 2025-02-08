import React, { useState } from "react"
import { Typography, Pagination } from "@mui/material"
import { DateTime } from "luxon"
import Template from "../template"
import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import useWorkouts from "../../../hooks/useWorkouts"

const ITEMS_PER_PAGE = 5

const Fitness = () => {
  const [page, setPage] = useState(1)
  const { monthlyGroups, loading, error } = useWorkouts()

  if (loading) return <Template pageTitle="Fitness">Loading...</Template>
  if (error) return <Template pageTitle="Fitness">Error loading workouts</Template>

  const totalPages = Math.ceil(monthlyGroups.length / ITEMS_PER_PAGE)
  const currentMonths = monthlyGroups.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

  const handlePageChange = (event, value) => {
    setPage(value)
  }

  return (
    <Template pageTitle="Fitness">
      {currentMonths.map((monthGroup, monthIndex) => (
        <Accordion key={monthGroup.month} sx={{ mt: 2 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6" gutterBottom color="primary">
              {monthGroup.month} ({monthGroup.workouts.length} workouts)
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            {monthGroup.workouts.map((workout, workoutIndex) => (
              <Accordion key={`${workout.workout_id || workoutIndex}`} sx={{ mt: 1 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="subtitle1" color="primary">
                    {workout.title} -{" "}
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
          </AccordionDetails>
        </Accordion>
      ))}
      <Pagination
        count={totalPages}
        page={page}
        onChange={handlePageChange}
        sx={{ mt: 4, display: "flex", justifyContent: "center" }}
      />
    </Template>
  )
}

export default Fitness
