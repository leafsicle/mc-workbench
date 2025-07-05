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
import Weather from "../pages/weather/index"
import { DateTime } from "luxon"
import { useState, useEffect } from "react"
import { styled } from "@mui/material/styles"

import TrebuchetTool from "../pages/trebuchet"

const Wrapper = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.dark,
  minHeight: "100vh",
  maxWidth: "100vw"
}))

const Main = () => {
  const outlet = useOutlet()

  const [time, setTime] = useState(
    DateTime.fromObject({ day: 22, hour: 12 }, { zone: "America/New_York" }).toLocaleString(
      DateTime.TIME_SIMPLE
    )
  )

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(DateTime.now().toLocaleString(DateTime.TIME_SIMPLE))
    }, 1000)
    return () => clearInterval(interval)
  }, [])
  return (
    <Wrapper>
      <Header />
      {/*Note: outlet renders the child routes */}
      <Outlet />
      {!outlet && (
        <Box className="flex flex-col items-center justify-center p-4 bg-cover bg-center bg-no-repeat bg-image-background">
          <Typography variant="h4" className="text-white">
            Hey, Y&apos;all!
          </Typography>
          <br />
          <Typography variant="h6" className="text-white">
            I&apos;m Matt, a software engineer and breaker of things.
          </Typography>
          <Typography variant="body1" className="text-white">
            It is currently {time}
          </Typography>
        </Box>
      )}
    </Wrapper>
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
            <Route path="/weather" element={<Weather />} />
            <Route path="/trebuchet" element={<TrebuchetTool />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </ThemeProvider>
    </BrowserRouter>
  )
}
