import { Outlet, Link } from 'react-router-dom'
const Header = () => {
  return (
    <div className='header'>
      {/* A "layout route" is a good place to put markup you want to
            share across all the pages on your site, like navigation. */}
      <nav>
        <ul>
          <li>
            <Link to='/'>Dashboard</Link>
          </li>
          <li>
            <Link to='/about'>About</Link>
          </li>
          <li>
            <Link to='/contact'>Contact</Link>
          </li>
          <li>
            <Link to='/nothing-here'>Click to see 404 for debug</Link>
          </li>
        </ul>
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
