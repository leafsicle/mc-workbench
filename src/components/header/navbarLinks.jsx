import React from "react"
import HomeSharpIcon from "@mui/icons-material/HomeSharp"
import HardwareIcon from "@mui/icons-material/Hardware"
import EmailIcon from "@mui/icons-material/Email"
import RamenDiningIcon from "@mui/icons-material/RamenDining"
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter"
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch"
import GrassIcon from "@mui/icons-material/Grass"
import ArchitectureOutlinedIcon from "@mui/icons-material/ArchitectureOutlined"
import { LINKEDIN_URL } from "@/data/profileLinks"

export const links = [
  {
    name: "Home",
    path: "/",
    icon: <HomeSharpIcon fontSize="small" />,
    skip: false,
    underRepair: false
  },
  {
    name: "Scrapyard",
    path: "/scrapyard",
    icon: <HardwareIcon fontSize="small" />,
    skip: false,
    underRepair: false
  },
  {
    name: "Contact",
    path: "/contact",
    href: LINKEDIN_URL,
    icon: <EmailIcon fontSize="small" />,
    skip: false,
    underRepair: false
  },
  // Tool routes stay available for deep links / scrapyard tabs, hidden from nav
  {
    name: "Garden!",
    path: "/garden",
    icon: <GrassIcon fontSize="small" />,
    skip: true,
    underRepair: false
  },
  {
    name: "Calculators",
    path: "/calculators",
    icon: <RamenDiningIcon fontSize="small" />,
    skip: true,
    underRepair: false
  },
  {
    name: "Hevy Log",
    path: "/fitness",
    icon: <FitnessCenterIcon fontSize="small" />,
    skip: true,
    underRepair: false
  },
  {
    name: "Space",
    path: "/space",
    icon: <RocketLaunchIcon fontSize="small" />,
    skip: true,
    underRepair: false
  },
  {
    name: "Send It",
    path: "/trebuchet",
    icon: <ArchitectureOutlinedIcon fontSize="small" />,
    skip: true,
    underRepair: false
  },
  {
    name: "404",
    path: "/404",
    icon: <HomeSharpIcon fontSize="small" />,
    skip: true,
    underRepair: false
  }
]
