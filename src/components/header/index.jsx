import { Outlet, Link } from 'react-router-dom'
import React, { useState } from 'react'
import LunchDiningIcon from '@mui/icons-material/LunchDining'
import IconButton from '@mui/material/IconButton'
import SystemSecurityUpdateWarningIcon from '@mui/icons-material/SystemSecurityUpdateWarning'
import GrassIcon from '@mui/icons-material/Grass'
const links = [
  {
    id: 1,
    name: 'Garden',
    path: '/',
    icon: <GrassIcon />
  },
  {
    id: 2,
    name: 'Contact',
    path: '/contact',
    icon: <SystemSecurityUpdateWarningIcon />
  }
]

const Header = () => {
  // create a state for the nav collapse
  const [navCollapse, setNavCollapse] = useState(false)
  return (
    <div className='header'>
      <nav>
        <ul
          style={{
            display: 'flex',
            justifyContent: 'space-evenly',
            alignItems: 'center',
            listStyle: 'none',
            '&:visited': {
              style: 'none'
            }
          }}
        >
          {links.map(link => {
            return (
              <li key={link.id} hidden={navCollapse}>
                <Link to={link.path}>
                  <IconButton
                    variant='contained'
                    color='primary'
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
              variant='contained'
              color='primary'
              onClick={() => setNavCollapse(!navCollapse)}
              children={<LunchDiningIcon />}
            />
          </li>
        </ul>
      </nav>
      <hr />
      {/* An <Outlet> renders whatever child route is currently active,
            so you can think about this <Outlet> as a placeholder for
            the child routes we defined above. */}
      <Outlet />
    </div>
  )
}
export default Header
