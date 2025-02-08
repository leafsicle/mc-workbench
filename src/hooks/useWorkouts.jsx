import { v4 as uuidv4 } from "uuid"
import { parse } from "papaparse"
import useSessionStore from "./useSessionStore"
import { groupWorkoutsByMonth } from "../components/pages/fitness/utils"

const useWorkouts = () => {
  const fetcher = async () => {
    const response = await fetch("/data/workouts.csv")
    const csvText = await response.text()
    const parsedData = parse(csvText, { header: true }).data
    return parsedData
  }

  const options = {
    transform: (data) => {
      const workoutsWithUUID = data.map((workout) => ({
        ...workout,
        workout_id: uuidv4()
      }))
      return workoutsWithUUID
    }
  }

  const { data: workouts, loading, error } = useSessionStore("workouts", fetcher, options)
  const monthlyGroups = workouts ? groupWorkoutsByMonth(workouts) : []

  return { workouts, monthlyGroups, loading, error }
}

export default useWorkouts
