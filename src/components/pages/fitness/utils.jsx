import { DateTime } from "luxon"

const serializeToHevyFormat = workouts => {
  const groups = {}

  workouts.forEach(workout => {
    // Parse the date string from format "19 Dec 2024, 06:27"
    const [datePart, timePart] = workout.start_time.split(", ")
    const [day, month, year] = datePart.split(" ")

    // Create ISO8601 string
    const startTime = DateTime.fromFormat(`${year}-${month}-${day} ${timePart}`, "yyyy-MMM-d HH:mm", {
      zone: "utc",
    }).toISO()

    const endTime = DateTime.fromFormat(
      `${year}-${month}-${day} ${workout.end_time.split(", ")[1]}`,
      "yyyy-MMM-d HH:mm",
      { zone: "utc" },
    ).toISO()

    // Use combination of date and title as key
    const groupKey = `${startTime}-${workout.title}`

    if (!groups[groupKey]) {
      groups[groupKey] = {
        title: workout.title,
        description: workout.description,
        start_time: startTime,
        end_time: endTime,
        exercises: {},
        created_at: startTime,
        updated_at: startTime,
      }
    }

    // Group exercises within the workout
    if (!groups[groupKey].exercises[workout.exercise_title]) {
      groups[groupKey].exercises[workout.exercise_title] = {
        index: Object.keys(groups[groupKey].exercises).length,
        title: workout.exercise_title,
        exercise_template_id: workout.exercise_template_id,
        superset_id: workout.superset_id || null,
        notes: workout.exercise_notes || "",
        sets: [],
      }
    }

    // Add set to the exercise
    groups[groupKey].exercises[workout.exercise_title].sets.push({
      index: workout.set_index,
      type: workout.set_type || "normal",
      weight_kg: workout.weight_lbs ? workout.weight_lbs * 0.45359237 : null,
      reps: workout.reps,
      distance_meters: workout.distance_miles ? workout.distance_miles * 1609.34 : null,
      duration_seconds: workout.duration_seconds,
      rpe: workout.rpe,
    })
  })

  // Convert exercises objects to arrays and sort all indexes
  Object.values(groups).forEach(workout => {
    workout.exercises = Object.values(workout.exercises).sort((a, b) => a.index - b.index)
    workout.exercises.forEach(exercise => {
      exercise.sets.sort((a, b) => a.index - b.index)
    })
  })

  return Object.values(groups)
}

export const groupWorkoutsByDate = workouts => {
  return serializeToHevyFormat(workouts).sort(
    (a, b) => DateTime.fromISO(b.start_time) - DateTime.fromISO(a.start_time),
  )
}

export const groupWorkoutsByMonth = workouts => {
  const monthlyGroups = {}
  
  const serializedWorkouts = serializeToHevyFormat(workouts)
  
  serializedWorkouts.forEach(workout => {
    const monthKey = DateTime.fromISO(workout.start_time)
      .setZone("America/New_York")
      .toFormat("MMMM yyyy")
    
    if (!monthlyGroups[monthKey]) {
      monthlyGroups[monthKey] = []
    }
    
    monthlyGroups[monthKey].push(workout)
  })
  
  // Sort workouts within each month by date (newest first)
  Object.keys(monthlyGroups).forEach(month => {
    monthlyGroups[month].sort((a, b) => 
      DateTime.fromISO(b.start_time) - DateTime.fromISO(a.start_time)
    )
  })
  
  // Convert to array of { month, workouts } objects and sort by month (newest first)
  return Object.entries(monthlyGroups)
    .map(([month, workouts]) => ({ month, workouts }))
    .sort((a, b) => 
      DateTime.fromFormat(b.month, "MMMM yyyy") - DateTime.fromFormat(a.month, "MMMM yyyy")
    )
}
