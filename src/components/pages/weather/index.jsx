// quick and dirty weather list
import { useState, useEffect } from "react"
import { Box, Stack, Slider, Button, Typography } from "@mui/material"
import MapComponent from "../../../components/maps"

const Weather = () => {
  const [location, setLocation] = useState("")
  const [weather, setWeather] = useState(null)
  const [showForecast, setShowForecast] = useState(false)
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
    <Box sx={{ padding: 2, display: "flex", flexDirection: "column", alignItems: "center" }}>
      <h1>Weather</h1>
      <Button onClick={() => setShowForecast(!showForecast)}>
        {showForecast ? "Hide Forecast" : "Show Forecast"}
      </Button>
      {!showForecast && (
        <>
          <Stack direction="row" spacing={2} width="30%" marginBottom={2}>
            <Slider
              value={zoom}
              onChange={(e, value) => setZoom(value)}
              min={1}
              max={20}
              step={1}
            />
          </Stack>
          <Box
            sx={{
              height: "400px",
              width: "50%",
              marginBottom: 2
            }}>
            <Typography variant="h6">🚧 Under Construction 🚧</Typography>
            <MapComponent
              lat={coordinates.lat}
              lng={coordinates.lng}
              zoom={zoom}
              onLocationSelect={handleMapClick}
            />
          </Box>
        </>
      )}

      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}

      {weather && showForecast && (
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
