import { Routes, Route, Outlet, Link } from 'react-router-dom'
import Garden from '../garden/Garden'
import NotFound from '../404'
import Darkness from '../darkness'
import Header from '../header'
import ContactForm from '../contactForm'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { ThemeProvider } from '@mui/material'
import theme from '../appMain/themes'
export default function App () {
  return (
    <div>
      <ThemeProvider theme={theme}>
        <ToastContainer />
        {/* Routes nest inside one another. Nested route paths build upon
            parent route paths, and nested route elements render inside
            parent route elements.  <Outlet> is child. */}
        <Routes>
          <Route path='/' element={<Header />}>
            <Route index element={<Garden />} />
            <Route path='/contact' element={<ContactForm />} />
            <Route path='/darkness' element={<Darkness />} />
            <Route path='*' element={<NotFound />} />
          </Route>
        </Routes>
      </ThemeProvider>
    </div>
  )
}
