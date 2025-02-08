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

  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: "fit-content" }}>
      <Typography variant="h1">Space Stuff</Typography>
        <CardComponent title={spaceData.title} image={spaceData.url} explanation={spaceData.explanation} hdVersion={spaceData.hdurl} />
      <p>{JSON.stringify(spaceData, null, 2)}</p>
    </Box>
  )
}

export default SpaceStuff