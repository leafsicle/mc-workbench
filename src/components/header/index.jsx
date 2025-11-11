import { Link } from "react-router-dom"
import React from "react"
import HomeSharpIcon from "@mui/icons-material/HomeSharp"
import RamenDiningIcon from "@mui/icons-material/RamenDining"
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter"
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch"
import GrassIcon from "@mui/icons-material/Grass"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle
} from "@/components/ui/navigation-menu"
import WbSunnyIcon from "@mui/icons-material/WbSunny"
import EmailIcon from "@mui/icons-material/Email"

const links = [
  {
    name: "Home",
    path: "/",
    icon: <HomeSharpIcon fontSize="small" />,
    skip: false
  },
  {
    name: "Garden",
    path: "/garden",
    icon: <GrassIcon fontSize="small" />,
    skip: true
  },
  {
    name: "Calculators",
    path: "/calculators",
    icon: <RamenDiningIcon fontSize="small" />,
    skip: false
  },
  {
    name: "Hevy Log",
    path: "/fitness",
    icon: <FitnessCenterIcon fontSize="small" />,
    skip: true
  },
  {
    name: "Space",
    path: "/space",
    icon: <RocketLaunchIcon fontSize="small" />,
    skip: true
  },
  {
    name: "Send It",
    path: "/trebuchet",
    icon: <RocketLaunchIcon fontSize="small" />,
    skip: true
  },
  {
    name: "404",
    path: "/404",
    icon: <HomeSharpIcon fontSize="small" />,
    skip: true
  },
  {
    name: "contact",
    path: "/contact",
    icon: <EmailIcon fontSize="small" />,
    skip: false
  }
]

const Header = () => {
  return (
    <header className="bg-background-dark py-2">
      <NavigationMenu className="mx-auto">
        <NavigationMenuList>
          {links
            .filter((link) => link.skip !== true)
            .map((link, idx) => (
              <NavigationMenuItem key={idx}>
                <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                  <Link to={link.path} className="flex items-center space-x-2">
                    {link.icon}
                    <span>{link.name}</span>
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
        </NavigationMenuList>
      </NavigationMenu>
    </header>
  )
}

export default Header
