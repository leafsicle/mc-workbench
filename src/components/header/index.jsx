import { Link } from "react-router-dom"
import React, { useState } from "react"
import LunchDiningIcon from "@mui/icons-material/LunchDining"
import IconButton from "@mui/material/IconButton"
import HomeSharpIcon from "@mui/icons-material/HomeSharp"
import RamenDiningIcon from "@mui/icons-material/RamenDining"
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter"
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch"
import { Box, useTheme, Drawer, List, ListItem } from "@mui/material"
import ThunderstormIcon from "@mui/icons-material/Thunderstorm"
import useIsMobile from "../../hooks/useIsMobile"

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
  },
  // {
  //   id: 4,
  //   name: "Weather",
  //   path: "/weather",
  //   icon: <ThunderstormIcon />
  // },
  {
    id: 5,
    name: "Send It",
    path: "/trebuchet",
    icon: <RocketLaunchIcon />
  }
]

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false)
  const theme = useTheme()
  const isMobile = useIsMobile()

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const drawer = (
    <List>
      {links.map((link) => (
        <ListItem key={link.id}>
          <Link
            to={link.path}
            onClick={handleDrawerToggle}
            style={{ width: "100%", padding: "8px" }}>
            <IconButton color="primary">{link.icon}</IconButton>
            {link.name}
          </Link>
        </ListItem>
      ))}
    </List>
  )

  return (
    <Box className="header" sx={{ backgroundColor: theme.palette.background.dark }}>
      <nav>
        {isMobile ? (
          <>
            <Box sx={{ display: "flex", justifyContent: "flex-end", width: "100%" }}>
              <IconButton
                color="primary"
                aria-label="open drawer"
                edge="end"
                sx={{ mr: 2 }}
                onClick={handleDrawerToggle}>
                <LunchDiningIcon />
              </IconButton>
            </Box>
            <Drawer
              sx={{
                "& .MuiDrawer-paper": {
                  backgroundColor: theme.palette.background.dark
                }
              }}
              variant="temporary"
              anchor="right"
              open={mobileOpen}
              onClose={handleDrawerToggle}
              ModalProps={{
                keepMounted: true // Better mobile performance
              }}>
              {drawer}
            </Drawer>
          </>
        ) : (
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
                "&:visited": {
                  color: "inherit"
                }
              }
            }}>
            {links.map((link) => (
              <li key={link.id}>
                <Link to={link.path}>
                  <IconButton color="primary">{link.icon}</IconButton>
                  {link.name}
                </Link>
              </li>
            ))}
          </Box>
        )}
      </nav>
      <hr style={{ margin: "0" }} />
    </Box>
  )
}

export default Header
