import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Outlet } from "react-router-dom"
import Header from "../header"
import { links } from "../header/navbarLinks"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { ThemeProvider } from "@mui/material"
import theme from "../appMain/themes"
import DarkThemeWrapper from "../appMain/DarkThemeWrapper"
import Calculators from "../pages/calculators/index"
import Fitness from "../pages/fitness/index"
import NotFound from "../404/index"
import { Box } from "@mui/material"
import SpaceStuff from "../pages/spaceStuff/index"
import Weather from "../pages/weather/index"
import { styled } from "@mui/material/styles"
import Contact from "../pages/contact"
import TrebuchetTool from "../pages/trebuchet"
import UnderRepair from "../underRepair"
import Garden from "../garden/Garden"
import Home from "../pages/home"
import Scrapyard from "../pages/scrapyard"
import "../pages/home/home.css"
import "../pages/scrapyard/scrapyard.css"

const Wrapper = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.dark,
  minHeight: "100vh",
  maxWidth: "100vw"
}))

const Main = () => {
  return (
    <Wrapper>
      <Header />
      <Outlet />
    </Wrapper>
  )
}

// Helper function to check if a route is under repair
const getRouteElement = (path, defaultElement) => {
  const link = links.find((l) => l.path === path)
  if (link?.underRepair === true) {
    return <UnderRepair />
  }
  return defaultElement
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
          <Route path="/" element={<Main />}>
            <Route index element={<Home />} />
            <Route path="/scrapyard" element={<Scrapyard />} />
            <Route path="/404" element={getRouteElement("/404", <NotFound />)} />
            <Route
              path="/fitness"
              element={getRouteElement(
                "/fitness",
                <DarkThemeWrapper>
                  <Fitness />
                </DarkThemeWrapper>
              )}
            />
            <Route
              path="/calculators"
              element={getRouteElement(
                "/calculators",
                <DarkThemeWrapper>
                  <Calculators />
                </DarkThemeWrapper>
              )}
            />
            <Route
              path="/space"
              element={getRouteElement(
                "/space",
                <DarkThemeWrapper>
                  <SpaceStuff isThisToday />
                </DarkThemeWrapper>
              )}
            />
            <Route path="/weather" element={getRouteElement("/weather", <Weather />)} />
            <Route
              path="/trebuchet"
              element={getRouteElement(
                "/trebuchet",
                <DarkThemeWrapper>
                  <TrebuchetTool />
                </DarkThemeWrapper>
              )}
            />
            <Route path="/contact" element={getRouteElement("/contact", <Contact />)} />
            <Route path="/garden" element={getRouteElement("/garden", <Garden />)} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </ThemeProvider>
    </BrowserRouter>
  )
}
