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

const links = [
  {
    id: 0,
    name: "Home",
    path: "/",
    icon: <HomeSharpIcon fontSize="small" />,
    skip: false
  },
  {
    id: 1,
    name: "Calculators",
    path: "/calculators",
    icon: <RamenDiningIcon fontSize="small" />,
    skip: false
  },
  {
    id: 2,
    name: "Hevy Log",
    path: "/fitness",
    icon: <FitnessCenterIcon fontSize="small" />,
    skip: false
  },
  {
    id: 3,
    name: "Space",
    path: "/space",
    icon: <RocketLaunchIcon fontSize="small" />,
    skip: false
  },
  {
    id: 4,
    name: "Send It",
    path: "/trebuchet",
    icon: <RocketLaunchIcon fontSize="small" />,
    skip: true
  },
  {
    id: 5,
    name: "404",
    path: "/404",
    icon: <HomeSharpIcon fontSize="small" />,
    skip: false
  },
  {
    id: 6,
    name: "Garden",
    path: "/garden",
    icon: <GrassIcon fontSize="small" />,
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
            .map((link) => (
              <NavigationMenuItem key={link.id}>
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
