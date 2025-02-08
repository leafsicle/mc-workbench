import { useCallback } from "react"
import useSessionStore from "./useSessionStore"

const MAX_RETRIES = 3
const RETRY_DELAY = 1000 // 1 second
const CACHE_KEY = "nasaAPOD"

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const useNasaAPOD = () => {
  const fetcher = useCallback(async (retryCount = 0) => {
    // Check if we've exceeded max retries in this session
    const failedAttempts = sessionStorage.getItem(`${CACHE_KEY}_failures`) || 0
    if (failedAttempts >= MAX_RETRIES) {
      throw new Error(`Maximum retry attempts (${MAX_RETRIES}) reached. Please try again later.`)
    }

    try {
      const response = await fetch(
        `https://api.nasa.gov/planetary/apod?api_key=${
          import.meta.env.VITE_NASA_API_KEY || "DEMO_KEY"
        }`,
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

      // Clear failure count on success
      sessionStorage.removeItem(`${CACHE_KEY}_failures`)
      return response.json()
    } catch (error) {
      console.error(
        `NASA APOD fetch error (attempt ${retryCount + 1}/${MAX_RETRIES}):`,
        error.message
      )

      if (retryCount < MAX_RETRIES - 1) {
        await delay(RETRY_DELAY * (retryCount + 1))
        // Increment failure count
        sessionStorage.setItem(`${CACHE_KEY}_failures`, parseInt(failedAttempts) + 1)
        return fetcher(retryCount + 1)
      }

      throw error
    }
  }, [])

  const options = {
    expiryCheck: (data) => {
      if (!data?.date) return true
      const today = new Date().toISOString().split("T")[0] // Format: YYYY-MM-DD
      return data.date !== today
    },
    cacheTime: 3600000, // 1 hour in milliseconds
    validateData: (data) => data && data.url && data.title,
    retryLimit: MAX_RETRIES
  }

  const { data: spaceData, loading, error } = useSessionStore(CACHE_KEY, fetcher, options)

  return { spaceData, loading, error }
}

export default useNasaAPOD
