import { Box, Typography } from "@mui/material"
import ConstructionIcon from "@mui/icons-material/Construction"

const UnderRepair = () => {
  return (
    <Box className="flex flex-col items-center justify-center min-h-[60vh] p-8">
      <ConstructionIcon sx={{ fontSize: 64, color: "warning.main", mb: 2 }} />
      <Typography variant="h4" className="text-white mb-2">
        Under Repair
      </Typography>
      <Typography variant="body1" className="text-white text-center max-w-md">
        This page is currently under maintenance. Please check back soon!
      </Typography>
    </Box>
  )
}

export default UnderRepair
