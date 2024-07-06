import { Outlet, Link } from 'react-router-dom'
import React, { useState } from 'react'
import LunchDiningIcon from '@mui/icons-material/LunchDining'
import IconButton from '@mui/material/IconButton'
import SystemSecurityUpdateWarningIcon from '@mui/icons-material/SystemSecurityUpdateWarning'
import HomeSharpIcon from '@mui/icons-material/HomeSharp'
import RamenDiningIcon from '@mui/icons-material/RamenDining'

const links = [
  {
    id: 0,
    name: 'Home',
    path: '/',
    icon: <HomeSharpIcon />
  },
  {
    id: 2,
    name: 'Form',
    path: '/contact',
    icon: <SystemSecurityUpdateWarningIcon />
  },
  {
    id: 3,
    name: 'Calculators',
    path: '/calculators',
    icon: <RamenDiningIcon />
  }
]

const Header = () => {
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
            padding: '.5rem 0',
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
      <hr style={{ margin: '0' }} />
      {/* An <Outlet> renders whatever child route is currently active,
            so you can think about this <Outlet> as a placeholder for
            the child routes we defined above. */}
      <Outlet />
    </div>
  )
}
export default Header
