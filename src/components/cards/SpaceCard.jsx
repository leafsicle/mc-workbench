import React, { useState } from "react"
import { Card, CardContent, CardMedia, Typography, Box } from "@mui/material"

const SpaceCard = ({ title, image, explanation, hdVersion, date, media_type }) => {
  // State for toggling the details visibility (only used for images)
  const [showDetails, setShowDetails] = useState(false)
  // State for toggling the HD version (if available)
  const [useHD, setUseHD] = useState(false)

  // Handler for clicking on the image to toggle details
  const handleImageClick = () => {
    setShowDetails((prev) => !prev)
  }

  // Handler to toggle between HD and standard image.
  // Prevents the click from toggling the details.
  const handleToggleHD = (e) => {
    e.stopPropagation() // Do not propagate click event to handleImageClick
    setUseHD((prev) => !prev)
  }

  return (
    <Card sx={{ maxWidth: 800, m: 2 }}>
      {media_type === "video" ? (
        <>
          <Box sx={{ position: "relative", paddingTop: "56.25%" /* 16:9 aspect ratio */ }}>
            <iframe
              src={image}
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
        </>
      ) : (
        <>
          <CardMedia
            component="img"
            height="500"
            image={useHD && hdVersion ? hdVersion : image}
            alt={title}
            sx={{ objectFit: "contain", cursor: "pointer" }}
            onClick={handleImageClick}
          />
          {showDetails && (
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
              {hdVersion && (
                <Typography
                  variant="caption"
                  color="primary"
                  onClick={handleToggleHD}
                  sx={{ cursor: "pointer", mt: 1, display: "block" }}>
                  {useHD ? "Switch to Standard" : "View HD"}
                </Typography>
              )}
            </CardContent>
          )}
        </>
      )}
    </Card>
  )
}

export default SpaceCard
