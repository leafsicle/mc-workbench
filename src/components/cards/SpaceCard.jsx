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
        maxWidth: "50%",
        paddingBottom: "2rem"
      }}>
      <Box
        sx={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "2rem" }}>
        <Card title={title} sx={{ width: "100%", height: "100%" }} onClick={handleOpen}>
          <CardMedia component="img" image={image} alt={title} style={{ objectFit: "contain" }} />
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
      <Typography variant="body1">{date}</Typography>
      <Link
        href={hdVersion}
        target="_blank"
        rel="noopener noreferrer"
        sx={{ marginTop: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}
        title="View HD">
        <HdIcon />
        <Typography title="View in HD on NASA's website" variant="body1">
          View HD
        </Typography>
      </Link>
    </Box>
  )
}

export default SpaceCard
