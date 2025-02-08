import { Link } from "react-router-dom"
import React, { useState } from "react"
import LunchDiningIcon from "@mui/icons-material/LunchDining"
import IconButton from "@mui/material/IconButton"
import HomeSharpIcon from "@mui/icons-material/HomeSharp"
import RamenDiningIcon from "@mui/icons-material/RamenDining"
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter"
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
const links = [
  {
    id: 0,
    name: "Home",
    path: "/",
    icon: <HomeSharpIcon />,
  },
  {
    id: 1,
    name: "Calculators",
    path: "/calculators",
    icon: <RamenDiningIcon />,
  },
  {
    id: 2,
    name: "Fitness",
    path: "/fitness",
    icon: <FitnessCenterIcon />,
  },
  {
    id: 3,
    name: "Space",
    path: "/space",
    icon: <RocketLaunchIcon />,
    actionable: true,
  }
]

const Header = () => {
  const [navCollapse, setNavCollapse] = useState(false)
  return (
    <div className="header">
      <nav>
        <ul
          style={{
            display: "flex",
            justifyContent: "space-evenly",
            alignItems: "center",
            listStyle: "none",
            padding: ".5rem 0",
            "&:visited": {
              style: "none",
            },
          }}
        >
          {links.map(link => {
            return (
              <li key={link.id} hidden={navCollapse}>
                <Link to={link.path}>
                  <IconButton
                    variant="contained"
                    color="primary"
                    onClick={() => setNavCollapse(!navCollapse)}
                    children={link.icon}
                  />
                  {link.name}
                </Link>
              </li>
            )
          })}
          <li hidden={!navCollapse}>
            <IconButton
              variant="contained"
              color="primary"
              onClick={() => setNavCollapse(!navCollapse)}
              children={<LunchDiningIcon />}
            />
          </li>
        </ul>
      </nav>
      <hr style={{ margin: "0" }} />
    </div>
  )
}
export default Header
