import { BrowserRouter, Routes, Route } from "react-router-dom"
// import Garden from '../garden/Garden'
import ContactForm from "../contactForm/ContactForm"
import { Outlet, useOutlet } from "react-router-dom"
import Darkness from "../darkness/Darkness"
import Header from "../header"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { ThemeProvider } from "@mui/material"
import theme from "../appMain/themes"
import Calculators from "../pages/calculators/index"
import Fitness from "../pages/fitness/index"
import NotFound from "../404/index"
import { Box, Typography, Card, CardMedia, CardContent } from "@mui/material"
import { useState, useEffect } from "react"
import { toast } from "react-toastify"
import CardComponent from "../cards/card"

const CurrentHomePage = () => {
  const outlet = useOutlet()
  const [spaceData, setSpaceData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSpaceData = async () => {
      try {
        const response = await fetch(
          `https://api.nasa.gov/planetary/apod?api_key=${import.meta.env.VITE_NASA_API_KEY || 'DEMO_KEY'}`
        )
        if (!response.ok) {
          throw new Error(`NASA API responded with status: ${response.status}`)
        }
        const data = await response.json()
        setSpaceData(data)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching space data:", error)
        toast.error(`Failed to load NASA space data ${error.message || ''}`)
        setLoading(false)
      }
    }

    fetchSpaceData()
  }, [])

  return (
    <div className="main-container">
      <Header />
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
          {loading ? (
            <Typography variant="h4">Loading space data...</Typography>
          ) : spaceData ? (
            <CardComponent title={spaceData.title} image={spaceData.url} explanation={spaceData.explanation} />
          ) : (
            <Typography variant="h4" color="error">
              Failed to load space data
            </Typography>
          )}
          <Typography variant="h2" sx={{ mt: 4 }}>
            Check out the calculators
          </Typography>
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
