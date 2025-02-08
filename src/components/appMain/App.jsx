import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Outlet, useOutlet } from "react-router-dom"
import Header from "../header"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { ThemeProvider } from "@mui/material"
import theme from "../appMain/themes"
import Calculators from "../pages/calculators/index"
import Fitness from "../pages/fitness/index"
import NotFound from "../404/index"
import { Box } from "@mui/material"
import SpaceStuff from "../pages/spaceStuff/index"
import Typography from "@mui/material/Typography"

const Main = () => {
  const outlet = useOutlet()

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
            width: "100%",
            backgroundImage: "url(/images/background.jpg)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat"
          }}>
          <Typography variant="h4">Howdy, Nerd!</Typography>
          <Typography variant="body1">
            Welcome to the nerd cave. Select a category to get started.
          </Typography>
          <Typography variant="body1">
            I&apos;m a software engineer and a fitness enthusiast. I&apos;m also a huge nerd.
            I&apos;m currently working on a few projects to help me learn more about software
            development and fitness.
          </Typography>
        </Box>
      )}
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <ToastContainer />
        {/* Routes nest inside one another. Nested route paths build upon
            parent route paths, and nested route elements render inside
            parent route elements.  <Outlet> is child. */}
        <Routes>
          <Route path="/" exact element={<Main />}>
            <Route path="/fitness" element={<Fitness />} />
            <Route path="/calculators" element={<Calculators />} />
            <Route path="/space" element={<SpaceStuff />} />
            <Route path="/weather" element={<p>Weather</p>} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </ThemeProvider>
    </BrowserRouter>
  )
}
