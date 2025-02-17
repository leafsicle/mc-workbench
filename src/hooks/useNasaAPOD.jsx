import { useCallback, useMemo, useState } from "react"
import { DateTime } from "luxon"
import useSessionStore from "./useSessionStore"

const MAX_RETRIES = 3
const RETRY_DELAY = 1000 // 1 second

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const useNasaAPOD = () => {
  // Create state to manage the selected date. Default is today.
  const [selectedDate, setSelectedDate] = useState(new Date())

  // Convert the selected date to Eastern Time using Luxon and format as YYYY-MM-DD.
  const selectedDateEastern = DateTime.fromJSDate(selectedDate).setZone("America/New_York")
  const formattedDate = selectedDateEastern.toFormat("yyyy-MM-dd")

  // Create a dynamic cache key based on the selected date.
  const cacheKeyForDate = `nasaAPOD-${formattedDate}`

  // Use a loop-based retry mechanism instead of recursive calls.
  const fetcher = useCallback(async () => {
    // Early check: Ensure we are not trying to fetch a future date.
    const todayFormatted = DateTime.now().setZone("America/New_York").toFormat("yyyy-MM-dd")
    if (formattedDate > todayFormatted) {
      throw new Error(`Cannot fetch APOD for future date: ${formattedDate}`)
    }

    let attempt = 0
    while (attempt < MAX_RETRIES) {
      try {
        const response = await fetch(
          `https://api.nasa.gov/planetary/apod?api_key=${
            import.meta.env.VITE_NASA_API_KEY || "DEMO_KEY"
          }&date=${formattedDate}`,
          {
            method: "GET",
            mode: "cors",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              "Cache-Control": "max-age=3600"
            }
          }
        )

        if (!response.ok) {
          const errorData = await response.text()
          throw new Error(`NASA API Error: ${response.status} - ${errorData}`)
        }

        // Clear failure count on success.
        sessionStorage.removeItem(`${cacheKeyForDate}_failures`)
        return response.json()
      } catch (error) {
        console.error(
          `NASA APOD fetch error (attempt ${attempt + 1}/${MAX_RETRIES}):`,
          error.message
        )

        attempt++
        // Update the failure count in session storage.
        sessionStorage.setItem(`${cacheKeyForDate}_failures`, attempt)

        if (attempt >= MAX_RETRIES) {
          throw error
        }

        await delay(RETRY_DELAY * attempt)
      }
    }
  }, [formattedDate, cacheKeyForDate])

  // Memoize the options so that their references don't change between renders.
  const options = useMemo(
    () => ({
      expiryCheck: (data) => {
        // If there is no date or the cached date doesn't match the selected date, treat it as expired.
        if (!data?.date) return true
        return data.date !== formattedDate
      },
      cacheTime: 3600000, // 1 hour in milliseconds
      validateData: (data) => data && data.url && data.title,
      retryLimit: MAX_RETRIES
    }),
    [formattedDate]
  )

  // Use the dynamic cache key for session storage.
  const { data: spaceData, loading, error } = useSessionStore(cacheKeyForDate, fetcher, options)

  // New date incrementor function to move the selected date by a given number of days.
  const incrementDay = (numDays) => {
    const currentEastern = DateTime.fromJSDate(selectedDate).setZone("America/New_York")
    const newDateEastern = currentEastern.plus({ days: numDays })
    const todayEastern = DateTime.now().setZone("America/New_York")
    // For forward increments, do not allow going into the future.
    if (numDays > 0 && newDateEastern > todayEastern) return
    setSelectedDate(newDateEastern.toJSDate())
  }

  // Functions to go to the previous day and next day using the incrementDay helper.
  const previousDay = () => {
    incrementDay(-1)
  }

  const nextDay = () => {
    incrementDay(1)
  }

  return {
    spaceData,
    loading,
    error,
    selectedDate,
    setSelectedDate,
    previousDay,
    nextDay,
    incrementDay
  }
}

export default useNasaAPOD
