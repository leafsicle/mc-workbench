// quick and dirty weather list
import { useState, useEffect } from "react"
import { Box, Stack, Slider } from "@mui/material"
import MapComponent from "../../../components/maps"

const Weather = () => {
  const [location, setLocation] = useState("")
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(false)
  const [zoom, setZoom] = useState(10)
  const [error, setError] = useState(null)
  const [coordinates, setCoordinates] = useState({
    lat: 33.787756391227866,
    lng: -84.26214058671603
  })

  const url = `${import.meta.env.VITE_WEATHER_BASE_URL}/points/${coordinates.lat},${
    coordinates.lng
  }`
  const forecastUrl = `${import.meta.env.VITE_WEATHER_BASE_URL}/gridpoints/${location}/forecast`

  useEffect(() => {
    const fetchGridpoint = async () => {
      if (!coordinates.lat || !coordinates.lng) return

      setLoading(true)
      try {
        const response = await fetch(url)
        const data = await response.json()
        setLocation(`${data.properties.gridId}/${data.properties.gridX},${data.properties.gridY}`)
        setError(null)
      } catch (err) {
        setError("Failed to fetch weather location")
        console.error("Error fetching gridpoint:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchGridpoint()
  }, [url, coordinates])

  useEffect(() => {
    const fetchWeather = async () => {
      if (!location) return

      setLoading(true)
      try {
        const response = await fetch(forecastUrl)
        const data = await response.json()
        setWeather(data.properties)
        setError(null)
      } catch (err) {
        setError("Failed to fetch weather data")
        console.error("Error fetching weather:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchWeather()
  }, [forecastUrl, location])

  const handleMapClick = (lat, lng) => {
    setCoordinates({ lat, lng })
  }

  return (
    <Box sx={{ padding: 2 }}>
      <h1>Weather</h1>
      <Stack direction="row" spacing={2} width="30%" marginBottom={2}>
        <Slider value={zoom} onChange={(e, value) => setZoom(value)} min={1} max={20} step={1} />
      </Stack>
      <Box sx={{ height: "400px", width: "100%", marginBottom: 2 }}>
        <MapComponent
          lat={coordinates.lat}
          lng={coordinates.lng}
          zoom={zoom}
          onLocationSelect={handleMapClick}
        />
      </Box>

      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {weather && (
        <Box sx={{ marginTop: 2 }}>
          <h2>Forecast</h2>
          {weather.periods?.map((period, index) => (
            <Box key={index} sx={{ marginBottom: 1 }}>
              <h3>{period.name}</h3>
              <p>{period.detailedForecast}</p>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  )
}

export default Weather
