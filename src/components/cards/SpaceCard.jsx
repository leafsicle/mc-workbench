import React from "react"
import { Card, CardContent, Typography, CardMedia, Box, Link } from "@mui/material"
import ModalComponent from "../modal/modal"
import { useState } from "react"
import HdIcon from "@mui/icons-material/Hd"
import { DateTime } from "luxon"

const SpaceCard = ({
  title,
  image,
  explanation,
  hdVersion,
  date = DateTime.now().toFormat("yyyy-MM-dd")
}) => {
  const [open, setOpen] = useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem"
      }}
    >
      <Box
        sx={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "2rem" }}
      >
        <Card sx={{ width: "500px" }} onClick={handleOpen}>
          <CardMedia component="img" image={image} alt={title} style={{ objectFit: "contain" }} />
          <CardContent>
            <Typography variant="h5">{title}</Typography>sdf
            <Typography variant="body1">{explanation}</Typography>
          </CardContent>
        </Card>
        <ModalComponent
          open={open}
          onClose={handleClose}
          title={title}
          explanation={explanation}
          image={image}
          hdVersion={hdVersion}
        />
      </Box>
      <Typography variant="h3">{title}</Typography>
      {/* date */}
      <Typography variant="body1">{date}</Typography>
      <Link
        href={hdVersion}
        target="_blank"
        rel="noopener noreferrer"
        sx={{ marginTop: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}
        title="View HD"
      >
        <HdIcon /> View HD
      </Link>
    </Box>
  )
}

export default SpaceCard
