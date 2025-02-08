import { v4 as uuidv4 } from "uuid"
import useSessionStore from "./useSessionStore"
import { groupWorkoutsByMonth } from "../components/pages/fitness/utils"
import useToast from "./useToast"

const useWorkouts = () => {
  const showToast = useToast()

  const fetcher = async () => {
    try {
      const response = await fetch("https://api.hevyapp.com/v1/workouts?page=3&page_size=100", {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "api-key": import.meta.env.VITE_HEVY_API_KEY
        }
      })

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`)
      }

      const data = await response.json()
      return data.workouts // Return the workouts array directly
    } catch (error) {
      showToast(`Failed to fetch workouts: ${error.message}`, "error")
      throw error
    }
  }

  const options = {
    transform: (data) => {
      const workoutsWithUUID = data.map((workout) => ({
        ...workout,
        workout_id: uuidv4()
      }))
      return workoutsWithUUID
    },
    validateData: (data) => Array.isArray(data) && data.length > 0
  }

  const { data: workouts, loading, error } = useSessionStore("workouts", fetcher, options)
  const monthlyGroups = workouts ? groupWorkoutsByMonth(workouts) : []

  return { workouts, monthlyGroups, loading, error }
}

export default useWorkouts
