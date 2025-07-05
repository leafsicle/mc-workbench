import React, { useState } from "react"
import { Typography, Pagination } from "@mui/material"
import { DateTime } from "luxon"
import Template from "../template"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion"
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
      <Accordion type="single" collapsible className="w-full max-w-xl">
        {currentMonths.map((monthGroup) => (
          <AccordionItem key={monthGroup.month} value={monthGroup.month}>
            <AccordionTrigger>
              <Typography variant="h6" gutterBottom color="black">
                {monthGroup.month} ({monthGroup.workouts.length} workouts)
              </Typography>
            </AccordionTrigger>
            <AccordionContent>
              <Accordion type="single" collapsible className="w-full">
                {monthGroup.workouts.map((workout, workoutIndex) => (
                  <AccordionItem
                    key={`${workout.workout_id || workoutIndex}`}
                    value={`${workout.workout_id || workoutIndex}`}>
                    <AccordionTrigger>
                      <Typography variant="subtitle1" color="black">
                        {`${workout.title} - ${DateTime.fromISO(workout.start_time)
                          .setZone("America/New_York")
                          .toLocaleString(DateTime.DATE_MED)}`}
                      </Typography>
                    </AccordionTrigger>
                    <AccordionContent>
                      {workout.exercises.map((exercise, exerciseIndex) => (
                        <div key={`${workout.workout_id}-exercise-${exerciseIndex}`}>
                          <Typography variant="body1" gutterBottom color="black">
                            {exercise.title}: {exercise.sets.length} sets
                          </Typography>
                        </div>
                      ))}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
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
