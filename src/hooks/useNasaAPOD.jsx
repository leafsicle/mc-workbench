import { useState, useEffect } from "react"
import { toast } from "react-toastify"


const useNasaAPOD = () => {
  const [spaceData, setSpaceData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSpaceData = async () => {
      try {
        const cached = localStorage.getItem('nasaAPOD')
        const cachedDate = localStorage.getItem('nasaAPODDate')
        const today = new Date().toDateString()

        if (cached && cachedDate === today) {
          setSpaceData(JSON.parse(cached))
          setLoading(false)
          return
        }

        const response = await fetch(
          `https://api.nasa.gov/planetary/apod?api_key=${import.meta.env.VITE_NASA_API_KEY || 'DEMO_KEY'}`
        )
        if (!response.ok) {
          throw new Error(`NASA API responded with status: ${response.status}`)
        }
        const data = await response.json()
        
        localStorage.setItem('nasaAPOD', JSON.stringify(data))
        localStorage.setItem('nasaAPODDate', today)
        
        setSpaceData(data)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching space data:", error)
        toast.error(`Failed to load NASA space data ${error.message || ''}`)
        setLoading(false)
      }
    }

    fetchSpaceData()
  }, [])

  return { spaceData, loading }
}

export default useNasaAPOD 