import { Link } from "react-router-dom"
import React, { useState } from "react"
import LunchDiningIcon from "@mui/icons-material/LunchDining"
import IconButton from "@mui/material/IconButton"
import HomeSharpIcon from "@mui/icons-material/HomeSharp"
import RamenDiningIcon from "@mui/icons-material/RamenDining"
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter"
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch"
import { Box } from "@mui/material"

const links = [
  {
    id: 0,
    name: "Home",
    path: "/",
    icon: <HomeSharpIcon />
  },
  {
    id: 1,
    name: "Calculators",
    path: "/calculators",
    icon: <RamenDiningIcon />
  },
  {
    id: 2,
    name: "Fitness",
    path: "/fitness",
    icon: <FitnessCenterIcon />
  },
  {
    id: 3,
    name: "Space",
    path: "/space",
    icon: <RocketLaunchIcon />,
    actionable: true
  }
]

const Header = () => {
  const [navCollapse, setNavCollapse] = useState(false)
  return (
    <Box className="header">
      <nav>
        <Box
          component="ul"
          sx={{
            display: "flex",
            justifyContent: "space-evenly",
            alignItems: "center",
            listStyle: "none",
            padding: ".5rem 0",
            "& a": {
              textDecoration: "none",
              color: "inherit",
              display: "flex",
              alignItems: "center",
              gap: 1,
              "&:visited": {
                color: "inherit"
              }
            }
          }}>
          {links.map((link) => (
            <li key={link.id} hidden={navCollapse}>
              <Link to={link.path}>
                <IconButton color="primary" onClick={() => setNavCollapse(!navCollapse)}>
                  {link.icon}
                </IconButton>
                {link.name}
              </Link>
            </li>
          ))}
          <li hidden={!navCollapse}>
            <IconButton color="primary" onClick={() => setNavCollapse(!navCollapse)}>
              <LunchDiningIcon />
            </IconButton>
          </li>
        </Box>
      </nav>
      <hr style={{ margin: "0" }} />
    </Box>
  )
}

export default Header
