import { Outlet, Link } from 'react-router-dom'
import React, { useState } from 'react'
import Box from '@mui/material/Box'
import LunchDiningIcon from '@mui/icons-material/LunchDining'
import IconButton from '@mui/material/IconButton'

const Header = () => {
  // create a state for the nav collapse
  const [navCollapse, setNavCollapse] = useState(false)
  return (
    <div className='header'>
      <nav>
        {navCollapse && (
          <ul
            style={{
              display: 'flex',
              justifyContent: 'space-evenly',
              listStyle: 'none'
            }}
          >
            <li>
              <Link to='/'>Garden</Link>
            </li>
            <li>
              <Link to='/about'>About</Link>
            </li>
            {/* <li>
              <Link to='/nothing-here'> </Link>
            </li> */}
            <li>
              <IconButton
                variant='contained'
                color='primary'
                onClick={() => setNavCollapse(!navCollapse)}
                children={<LunchDiningIcon />}
              />
            </li>
          </ul>
        )}
        {!navCollapse && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <IconButton
              variant='contained'
              color='primary'
              onClick={() => setNavCollapse(!navCollapse)}
              children={<LunchDiningIcon />}
            />
          </Box>
        )}
      </nav>
      <hr style={{ margin: '2rem 0' }} />
      {/* An <Outlet> renders whatever child route is currently active,
            so you can think about this <Outlet> as a placeholder for
            the child routes we defined above. */}
      <Outlet />
    </div>
  )
}
export default Header
