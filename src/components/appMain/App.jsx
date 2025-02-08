import { BrowserRouter, Routes, Route } from "react-router-dom"
// import Garden from '../garden/Garden'
// import ContactForm from "../contactForm/ContactForm"
import { Outlet, useOutlet } from "react-router-dom"
// import Darkness from "../darkness/Darkness"
import Header from "../header"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { ThemeProvider } from "@mui/material"
import theme from "../appMain/themes"
import Calculators from "../pages/calculators/index"
import Fitness from "../pages/fitness/index"
import NotFound from "../404/index"
import { Box } from "@mui/material"
import { CircularProgress } from "@mui/material"
import useNasaAPOD from "../../hooks/useNasaAPOD"
import SpaceStuff from "../pages/spaceStuff/index"

const HomePage = () => {
  const outlet = useOutlet()
  const { spaceData, loading } = useNasaAPOD()

  if (loading) {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%" }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <div className="main-container">
      <Header />
       {/*Note: outlet renders the child routes */}
      <Outlet />
      {!outlet && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: "2rem",
          }}
        >
        </Box>
      )}
      Go check out the space stuff?
         {/* put what ever you need for a footer down here  but outside of this !outlet div */}
         {/* <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", marginTop: "2rem", width: "100%"}}>
            <Typography variant="h6">Howdy</Typography>
          </Box> */}
    </div>
  )
}

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
          <Route path="/" exact element={<HomePage />}>
            <Route path="/fitness" element={<Fitness />} />
            <Route path="/calculators" element={<Calculators />} />
            <Route path="/space" element={<SpaceStuff />} />
            {/* <Route path="/darkness" element={<Darkness />} /> */}
            {/* <Route path='/garden' element={<Garden />} /> */}
            {/* <Route path='/contact' element={<ContactForm />} /> */}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </ThemeProvider>
    </BrowserRouter>
  )
}
