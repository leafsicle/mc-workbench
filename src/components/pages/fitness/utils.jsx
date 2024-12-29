import { DateTime } from "luxon"

// Memoization cache
const memoizeCache = new Map()

export const serializeWorkoutToJSON = workouts => {
  const groups = {}

  workouts.forEach(workout => {
    // Parse the date string from format "19 Dec 2024, 06:27"
    const [datePart, timePart] = workout.start_time.split(", ")
    const [day, month, year] = datePart.split(" ")

    // Create ISO8601 string
    const isoString = DateTime.fromFormat(`${year}-${month}-${day} ${timePart}`, "yyyy-MMM-d HH:mm", {
      zone: "utc",
    }).toISO()

    // Use combination of date and title as key
    const groupKey = `${isoString}-${workout.title}`

    if (!groups[groupKey]) {
      groups[groupKey] = {
        title: workout.title,
        start_time: isoString,
        end_time: DateTime.fromFormat(
          `${year}-${month}-${day} ${workout.end_time.split(", ")[1]}`,
          "yyyy-MMM-d HH:mm",
          { zone: "utc" },
        ).toISO(),
        description: workout.description,
        exercises: {},
      }
    }

    // Group exercises within the workout
    if (!groups[groupKey].exercises[workout.exercise_title]) {
      groups[groupKey].exercises[workout.exercise_title] = {
        title: workout.exercise_title,
        superset_id: workout.superset_id,
        notes: workout.exercise_notes,
        sets: [],
      }
    }

    // Add set to the exercise
    groups[groupKey].exercises[workout.exercise_title].sets.push({
      set_index: workout.set_index,
      set_type: workout.set_type,
      weight_lbs: workout.weight_lbs,
      reps: workout.reps,
      distance_miles: workout.distance_miles,
      duration_seconds: workout.duration_seconds,
      rpe: workout.rpe,
    })
  })

  // Convert exercises objects to arrays and sort sets
  Object.values(groups).forEach(workout => {
    workout.exercises = Object.values(workout.exercises).map(exercise => {
      exercise.sets.sort((a, b) => a.set_index - b.set_index)
      return exercise
    })
  })

  return Object.values(groups)
}

export const groupWorkoutsByDate = workouts => {
  return serializeWorkoutToJSON(workouts).sort(
    (a, b) => DateTime.fromISO(a.start_time) - DateTime.fromISO(b.start_time),
  )
}
