import { v4 as uuidv4 } from "uuid"
import { useCallback, useMemo } from "react"
import useSessionStore from "./useSessionStore"
import { groupWorkoutsByMonth } from "../components/pages/fitness/utils"
import useToast from "./useToast"

const MAX_RETRIES = 3
const RETRY_DELAY = 1000
const CACHE_KEY = "workouts"

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const useWorkouts = () => {
  const showToast = useToast()

  const fetcher = useCallback(
    async (retryCount = 0) => {
      const failedAttempts = parseInt(sessionStorage.getItem(`${CACHE_KEY}_failures`)) || 0
      if (failedAttempts >= MAX_RETRIES) {
        throw new Error(`Maximum retry attempts (${MAX_RETRIES}) reached. Please try again later.`)
      }

      try {
        const response = await fetch("https://api.hevyapp.com/v1/workouts", {
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
        sessionStorage.removeItem(`${CACHE_KEY}_failures`)
        return data.workouts
      } catch (error) {
        console.error(
          `Workout fetch error (attempt ${retryCount + 1}/${MAX_RETRIES}):`,
          error.message
        )

        if (retryCount < MAX_RETRIES - 1) {
          await delay(RETRY_DELAY * (retryCount + 1))
          sessionStorage.setItem(`${CACHE_KEY}_failures`, failedAttempts + 1)
          return fetcher(retryCount + 1)
        }

        showToast(`Failed to fetch workouts: ${error.message}`, "error")
        throw error
      }
    },
    [showToast]
  )

  const options = useMemo(
    () => ({
      transform: (data) => {
        const workoutsWithUUID = data.map((workout) => ({
          ...workout,
          workout_id: uuidv4()
        }))
        return workoutsWithUUID
      },
      validateData: (data) => Array.isArray(data) && data.length > 0,
      retryLimit: MAX_RETRIES
    }),
    []
  )

  const { data: workouts, loading, error } = useSessionStore(CACHE_KEY, fetcher, options)
  const monthlyGroups = workouts ? groupWorkoutsByMonth(workouts) : []

  return { workouts, monthlyGroups, loading, error }
}

export default useWorkouts
