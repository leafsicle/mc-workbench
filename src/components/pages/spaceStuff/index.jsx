import React, { memo } from "react"
import { Box, Typography, Card, CardContent, useTheme } from "@mui/material"
import { CircularProgress } from "@mui/material"
import useNasaAPOD from "@/hooks/useNasaAPOD"
import SpaceCard from "@/components/cards/SpaceCard"
import DefaultButton from "@/components/buttons/Button"
import { isThisToday } from "@/lib/utils"

// VideoCard component for video media types
const VideoCard = memo(({ title, url, explanation, date }) => (
  <Card sx={{ maxWidth: 800, m: 2, height: "auto" }}>
    <Box
      sx={{
        position: "relative",
        height: 0,
        paddingTop: "56.25%" // Maintains the 16:9 aspect ratio.
      }}>
      <iframe
        src={url}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          border: 0
        }}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title={title}
      />
    </Box>
    <CardContent>
      <Typography gutterBottom variant="h5" component="div">
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        {date}
      </Typography>
      <Typography variant="body1" color="text.primary">
        {explanation}
      </Typography>
    </CardContent>
  </Card>
))
VideoCard.displayName = "VideoCard"

// Loading display component
const LoadingDisplay = memo(() => (
  <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
    <CircularProgress />
  </Box>
))
LoadingDisplay.displayName = "LoadingDisplay"

// Error display component
const ErrorDisplay = memo(({ error }) => (
  <Box
    sx={{
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      padding: 2
    }}>
    <Typography variant="h6" color="error">
      Error loading space data
    </Typography>
    <Typography variant="body1" color="error">
      {error.message}
    </Typography>
  </Box>
))
ErrorDisplay.displayName = "ErrorDisplay"

// SpaceContent renders either the SpaceCard (with modal behavior) or the VideoCard
const SpaceContent = memo(({ spaceData }) => {
  const theme = useTheme()
  return (
    <>
      {spaceData.media_type === "video" ? (
        <VideoCard
          title={spaceData.title}
          url={spaceData.url}
          explanation={spaceData.explanation}
          date={spaceData.date}
        />
      ) : (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "80%",
            margin: "0 auto"
          }}>
          <SpaceCard
            title={spaceData.title}
            image={spaceData.url}
            explanation={spaceData.explanation}
            hdVersion={spaceData.hdVersion}
            date={spaceData.date}
          />
          <Typography variant="body2" color={theme.palette.text.darkBackground} gutterBottom>
            {spaceData.date}
          </Typography>
          <Typography variant="body1" color={theme.palette.text.darkBackground}>
            {spaceData.title}
          </Typography>
          <Typography variant="body1" color={theme.palette.text.darkBackground}>
            {spaceData.explanation}
          </Typography>
        </Box>
      )}
    </>
  )
})
SpaceContent.displayName = "SpaceContent"

// Main component
const SpaceStuff = () => {
  const { spaceData, loading, error, previousDay, nextDay } = useNasaAPOD()

  if (loading) {
    return <LoadingDisplay />
  }

  if (error) {
    return <ErrorDisplay error={error} />
  }

  if (!spaceData) {
    return (
      <Box
        sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <Typography variant="h6">No space data available</Typography>
      </Box>
    )
  }
  const lastSlide = isThisToday(spaceData.date)

  return (
    <Box name="slider-navigation">
      <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 1 }}>
        <DefaultButton name="go-back" onClick={previousDay}>
          Previous Day
        </DefaultButton>
        <DefaultButton name="go-forward" onClick={nextDay} disabled={lastSlide}>
          Next Day
        </DefaultButton>
      </Box>
      <SpaceContent spaceData={spaceData} />
    </Box>
  )
}

export default memo(SpaceStuff)
