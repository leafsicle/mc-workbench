import { Routes, Route, Outlet, Link } from 'react-router-dom'
import './App.css'
import Dashboard from '../dashboard'
import NotFound from '../404'
import Header from '../header'
import About from '../about'
import ContactForm from '../contactForm'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default function App () {
  return (
    <div>
      <ToastContainer />

      {/* Routes nest inside one another. Nested route paths build upon
            parent route paths, and nested route elements render inside
            parent route elements. See the note about <Outlet> below. */}
      <Routes>
        <Route path='/' element={<Header />}>
          <Route index element={<Dashboard />} />
          <Route path='/about' element={<About />} />
          <Route path='/contact' element={<ContactForm />} />

          {/* Using path="*"" means "match anything", so this route
                acts like a catch-all for URLs that we don't have explicit
                routes for. */}
          <Route path='*' element={<NotFound />} />
        </Route>
      </Routes>
    </div>
  )
}
