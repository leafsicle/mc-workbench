import { Link } from "react-router-dom"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle
} from "@/components/ui/navigation-menu"
import { links } from "./navbarLinks"

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
