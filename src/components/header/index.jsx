import { Outlet, Link } from 'react-router-dom'
import React, { useState } from 'react'
import Box from '@mui/material/Box'
import LunchDiningIcon from '@mui/icons-material/LunchDining'
import IconButton from '@mui/material/IconButton'

const links = [
  {
    id: 1,
    name: 'Garden',
    path: '/'
  },
  {
    id: 2,
    name: 'About',
    path: '/about'
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
                <Link to={link.path}>{link.name}</Link>
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
