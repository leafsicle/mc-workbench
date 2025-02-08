// This is the space stuff page.
// we 're goint to use it to dump json data.
// from each of the NASA API endpoints.
// because more data is gooder data.

import { Box, Typography } from "@mui/material"
import { CircularProgress } from "@mui/material"
import CardComponent from "../../cards/card"
import useNasaAPOD from "../../../hooks/useNasaAPOD"

const SpaceStuff = () => {
  const { spaceData, loading } = useNasaAPOD()


  if (loading) {
    return <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <CircularProgress />
    </Box>
  }

  if (!spaceData) {
    return <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <Typography variant="h1">No space data</Typography>
    </Box>
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: "fit-content" }}>
      <Typography variant="h1">Space Stuff</Typography>
      <Typography variant="h2">APOD</Typography>
      <Typography variant="h3">NASA Picture of the Day</Typography>

      <Typography variant="body1">
        {spaceData.explanation}
      </Typography>

      <Typography variant="body1">
        {spaceData.title}
      </Typography>

      <Typography variant="body1">
        {spaceData.url}
      </Typography>
    </Box>
  )
}

export default SpaceStuff