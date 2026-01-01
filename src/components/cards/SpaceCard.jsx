import React, { useState } from "react"
import { Card, CardContent, CardMedia, Typography, Box, useTheme } from "@mui/material"
import ModalComponent from "../modal/modal"

const SpaceCard = ({ title, image, explanation, hdVersion, date, media_type }) => {
  // State for toggling the HD version (if available)
  const [useHD, setUseHD] = useState(false)
  // State for modal open status
  const [open, setOpen] = useState(false)
  const theme = useTheme()

  // Handler for opening the modal
  const handleOpen = () => setOpen(true)
  // Handler for closing the modal
  const handleClose = () => setOpen(false)

  // Handler to toggle between HD and standard image.
  // Stops propagation to prevent also opening the modal.
  const handleToggleHD = (e) => {
    e.stopPropagation()
    setUseHD((prev) => !prev)
  }

  // For videos, maintain the current inline behavior.
  if (media_type === "video") {
    return (
      <Card sx={{ maxWidth: 800, m: 2 }}>
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
      </Card>
    )
  }

  // Determine which image to display based on the HD toggle state
  const displayImage = useHD && hdVersion ? hdVersion : image

  return (
    <>
      <Card
        sx={{
          maxWidth: 800,
          m: 2,
          cursor: "pointer",
          borderRadius: "10px",
          backgroundColor: theme.palette.background.dark
        }}
        onClick={handleOpen}>
        <CardMedia
          component="img"
          height="500"
          image={displayImage}
          alt={title}
          sx={{ objectFit: "contain" }}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {date}
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
      </Card>
      <ModalComponent
        open={open}
        onClose={handleClose}
        title={title}
        image={displayImage}
        explanation={explanation}
        hdVersion={hdVersion}
      />
    </>
  )
}

export default SpaceCard
