import { useCallback, useMemo } from "react"
import useSessionStore from "./useSessionStore"

const MAX_RETRIES = 3
const RETRY_DELAY = 1000 // 1 second
const CACHE_KEY = "nasaAPOD"

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const useNasaAPOD = () => {
  // Use a loop-based retry mechanism instead of recursive calls.
  const fetcher = useCallback(async () => {
    let attempt = 0
    while (attempt < MAX_RETRIES) {
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
        // Log the current attempt through the loop.
        console.error(
          `NASA APOD fetch error (attempt ${attempt + 1}/${MAX_RETRIES}):`,
          error.message
        )

        attempt++
        // Update the failure count in session storage (for debugging or other uses)
        sessionStorage.setItem(`${CACHE_KEY}_failures`, attempt)

        // If we've reached the max number of retries, throw the error
        if (attempt >= MAX_RETRIES) {
          throw error
        }

        // Wait an increasing delay before retrying
        await delay(RETRY_DELAY * attempt)
      }
    }
  }, [])

  // Memoize the options so that their references don't change between renders.
  const options = useMemo(
    () => ({
      expiryCheck: (data) => {
        // If there is no date or the cached date doesn't match today's date, treat it as expired
        if (!data?.date) return true
        const today = new Date().toISOString().split("T")[0]
        return data.date !== today
      },
      cacheTime: 3600000, // 1 hour in milliseconds
      validateData: (data) => data && data.url && data.title,
      retryLimit: MAX_RETRIES
    }),
    []
  )

  const { data: spaceData, loading, error } = useSessionStore(CACHE_KEY, fetcher, options)

  return { spaceData, loading, error }
}

export default useNasaAPOD
