import { Routes, Route, Outlet, Link } from 'react-router-dom'
import './App.css'
import Dashboard from '../dashboard'
import About from '../about'
import NotFound from '../404'

export default function App () {
  return (
    <div>
      {/* Routes nest inside one another. Nested route paths build upon
            parent route paths, and nested route elements render inside
            parent route elements. See the note about <Outlet> below. */}
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route index element={<About />} />
          <Route path='dashboard' element={<Dashboard />} />

          {/* Using path="*"" means "match anything", so this route
                acts like a catch-all for URLs that we don't have explicit
                routes for. */}
          <Route path='*' element={<NotFound />} />
        </Route>
      </Routes>
    </div>
  )
}

function Layout () {
  return (
    <div className='layout'>
      {/* A "layout route" is a good place to put markup you want to
          share across all the pages on your site, like navigation. */}
      <nav>
        <ul>
          <li>
            <Link to='/'>Home</Link>
          </li>
          <li>
            <Link to='/dashboard'>Dashboard</Link>
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
