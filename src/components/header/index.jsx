import { Link } from "react-router-dom"
import React from "react"
import HomeSharpIcon from "@mui/icons-material/HomeSharp"
import RamenDiningIcon from "@mui/icons-material/RamenDining"
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter"
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch"
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
    icon: <HomeSharpIcon fontSize="small" />
  },
  {
    id: 1,
    name: "Calculators",
    path: "/calculators",
    icon: <RamenDiningIcon fontSize="small" />
  },
  {
    id: 2,
    name: "Hevy Log",
    path: "/fitness",
    icon: <FitnessCenterIcon fontSize="small" />
  },
  {
    id: 3,
    name: "Space",
    path: "/space",
    icon: <RocketLaunchIcon fontSize="small" />
  },
  {
    id: 4,
    name: "Send It",
    path: "/trebuchet",
    icon: <RocketLaunchIcon fontSize="small" />
  },
  {
    id: 5,
    name: "404",
    path: "/404",
    icon: <HomeSharpIcon fontSize="small" />
  }
]

const Header = () => {
  return (
    <header className="bg-background-dark py-2">
      <NavigationMenu className="mx-auto">
        <NavigationMenuList>
          {links.map((link) => (
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
