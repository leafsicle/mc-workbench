import { BrowserRouter, Routes, Route } from "react-router-dom"
// import Garden from '../garden/Garden'
import ContactForm from "../contactForm/ContactForm"
import Darkness from "../darkness/Darkness"
import Header from "../header"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { ThemeProvider } from "@mui/material"
import theme from "../appMain/themes"
import Calculators from "../pages/calculators/index"
import Fitness from "../pages/fitness/index"
import NotFound from "../404/index"

export default function App() {
  const boolFlip = Math.random() > 0.5
  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <ToastContainer />
        {/* Routes nest inside one another. Nested route paths build upon
            parent route paths, and nested route elements render inside
            parent route elements.  <Outlet> is child. */}
        <Routes>
          <Route path="/" element={<Header />}>
            <Route path="/fitness" element={<Fitness />} />
            {/* <Route path='/garden' element={<Garden />} /> */}
            {/* <Route path='/contact' element={<ContactForm />} /> */}
            <Route path="/calculators" element={<Calculators />} />
            <Route path="/darkness" element={boolFlip ? <Darkness /> : <NotFound />} />
          </Route>
        </Routes>
      </ThemeProvider>
    </BrowserRouter>
  )
}
