import React from "react"
import { Card, CardContent, CardMedia, Typography, Box } from "@mui/material"

const SpaceCard = ({ title, image, explanation, hdVersion, date, media_type }) => {
  return (
    <Card sx={{ maxWidth: 800, m: 2 }}>
      {media_type === "video" ? (
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
      ) : (
        <CardMedia
          component="img"
          height="500"
          image={image}
          alt={title}
          sx={{ objectFit: "contain" }}
        />
      )}

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

export default SpaceCard
