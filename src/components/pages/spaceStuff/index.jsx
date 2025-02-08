// This is the space stuff page.
// we 're goint to use it to dump json data.
// from each of the NASA API endpoints.
// because more data is gooder data.

import React, { memo } from "react"
import { Box, Typography } from "@mui/material"
import { CircularProgress } from "@mui/material"
import useNasaAPOD from "../../../hooks/useNasaAPOD"
import SpaceCard from "../../../components/cards/spaceCard"

const SpaceContent = memo(({ spaceData }) => (
  <Box sx={{ 
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    }}>
  {/*  title, image, explanation, hdVersion */}
    <SpaceCard title={spaceData.title} image={spaceData.url} explanation={spaceData.explanation} hdVersion={spaceData.hdurl} date={spaceData.date}/>
  </Box>
))

const SpaceStuff = () => {
  const { spaceData, loading, error } = useNasaAPOD()

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </Box>
    )
  }

  if (!spaceData) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <Typography variant="h1">No space data</Typography>
      </Box>
    )
  }

  return (
    <SpaceContent spaceData={spaceData} />
  )
}

export default memo(SpaceStuff)