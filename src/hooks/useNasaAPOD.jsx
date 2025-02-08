import { useCallback } from "react"
import useSessionStore from "./useSessionStore"

const useNasaAPOD = () => {
  const fetcher = useCallback(async () => {
    try {
      const response = await fetch(
        `https://api.nasa.gov/planetary/apod?api_key=${
          import.meta.env.VITE_NASA_API_KEY || "DEMO_KEY"
        }`,
        {
          headers: {
            "Cache-Control": "max-age=3600" // Cache for 1 hour
          }
        }
      )
      if (!response.ok) {
        throw new Error(`NASA API responded with status: ${response.status}`)
      }
      return response.json()
    } catch (error) {
      console.error("NASA APOD fetch error:", error)
      throw error
    }
  }, [])

  const options = {
    expiryCheck: (data) => {
      const today = new Date().toDateString()
      return data?.date !== today
    },
    cacheTime: 3600000 // 1 hour in milliseconds
  }

  const { data: spaceData, loading, error } = useSessionStore("nasaAPOD", fetcher, options)

  return { spaceData, loading, error }
}

export default useNasaAPOD
