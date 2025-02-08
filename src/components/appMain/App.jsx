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
import CardComponent from "../cards/card"
import SpaceStuff from "../pages/spaceStuff/index"
import ModalComponent from "../modal/modal"
const CurrentHomePage = () => {
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
            minHeight: "100vh",
            padding: "2rem",
          }}
        >
          {spaceData && (
            <>
              <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2 }}>
                <CardComponent title={spaceData.title} image={spaceData.url} explanation={spaceData.explanation} hdVersion={spaceData.hdurl} />
                <ModalComponent image={spaceData.url} explanation={spaceData.explanation} />
              </Box>
            </>
          )}
        </Box>
      )}
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
          <Route path="/" exact element={<CurrentHomePage />}>
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
