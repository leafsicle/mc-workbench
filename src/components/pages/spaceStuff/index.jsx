import React, { memo, useMemo } from "react"
import { Box, Typography, Card, CardContent, CardMedia } from "@mui/material"
import { CircularProgress } from "@mui/material"
import useNasaAPOD from "@/hooks/useNasaAPOD"

// Separate video component to optimize rendering
const VideoDisplay = memo(({ url, title }) => (
  <Box sx={{ position: "relative", paddingTop: "56.25%" }}>
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
))

VideoDisplay.displayName = "VideoDisplay"

// Separate image component to optimize rendering
const ImageDisplay = memo(({ url, title }) => (
  <CardMedia component="img" height="500" image={url} alt={title} sx={{ objectFit: "contain" }} />
))

ImageDisplay.displayName = "ImageDisplay"

// Memoized media display component
const MediaDisplay = memo(({ media_type, url, title }) =>
  media_type === "video" ? (
    <VideoDisplay url={url} title={title} />
  ) : (
    <ImageDisplay url={url} title={title} />
  )
)

MediaDisplay.displayName = "MediaDisplay"

const SpaceCard = memo(({ title, url, explanation, date, media_type }) => {
  // Memoize the card style
  const cardStyle = useMemo(
    () => ({
      maxWidth: 800,
      m: 2,
      width: "100%"
    }),
    []
  )

  return (
    <Card sx={cardStyle}>
      <MediaDisplay media_type={media_type} url={url} title={title} />
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
  )
})

SpaceCard.displayName = "SpaceCard"

const SpaceContent = memo(({ spaceData }) => {
  // Memoize the container style
  const containerStyle = useMemo(
    () => ({
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: 2,
      width: "100%"
    }),
    []
  )

  return (
    <Box sx={containerStyle}>
      <SpaceCard
        title={spaceData.title}
        url={spaceData.url}
        explanation={spaceData.explanation}
        date={spaceData.date}
        media_type={spaceData.media_type}
      />
    </Box>
  )
})

SpaceContent.displayName = "SpaceContent"

const LoadingDisplay = memo(() => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh"
    }}>
    <CircularProgress />
  </Box>
))

LoadingDisplay.displayName = "LoadingDisplay"

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

const SpaceStuff = () => {
  const { spaceData, loading, error } = useNasaAPOD()

  if (loading) {
    return <LoadingDisplay />
  }

  if (error) {
    return <ErrorDisplay error={error} />
  }

  if (!spaceData) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh"
        }}>
        <Typography variant="h6">No space data available</Typography>
      </Box>
    )
  }

  return <SpaceContent spaceData={spaceData} />
}

export default memo(SpaceStuff)
