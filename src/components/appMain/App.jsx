import { Routes, Route } from 'react-router-dom'
// import Garden from '../garden/Garden'
import ContactForm from '../contactForm/ContactForm'
import Darkness from '../darkness/Darkness'
import Header from '../header'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { ThemeProvider } from '@mui/material'
import theme from '../appMain/themes'
import About from '../about/About'
import Calculators from '../pages/calculators/index'

export default function App () {
  return (
    <div>
      <ThemeProvider theme={theme}>
        <ToastContainer />
        {/* Routes nest inside one another. Nested route paths build upon
            parent route paths, and nested route elements render inside
            parent route elements.  <Outlet> is child. */}
        <Router basename='/mc-workbench'>
          <Routes>
            <Route path='/' element={<Header />}>
              <Route index element={<About />} />
              {/* <Route path='/garden' element={<Garden />} /> */}
              <Route path='/contact' element={<ContactForm />} />
              <Route path='/calculators' element={<Calculators />} />
              <Route path='*' element={<Darkness />} />
            </Route>
          </Routes>
        </Router>
      </ThemeProvider>
    </div>
  )
}
