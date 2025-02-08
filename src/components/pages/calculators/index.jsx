import React, { useState } from "react"
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  List,
  ListItem,
  ListItemText,
  Paper,
  Grid,
  ThemeProvider,
  createTheme
} from "@mui/material"
import { styled } from "@mui/material/styles"
import useToast from "../../../hooks/useToast"

// Create a dark theme
const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#90caf9" // A lighter blue for better contrast in dark mode
    },
    background: {
      default: "#303030",
      paper: "#424242"
    }
  }
})

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginTop: theme.spacing(3),
  backgroundColor: theme.palette.background.paper
}))

const Calculators = () => {
  const [rawWeight, setRawWeight] = useState("")
  const [cookedWeight, setCookedWeight] = useState("")
  const [targetRawOz, setTargetRawOz] = useState("")
  const [result, setResult] = useState("")
  const [history, setHistory] = useState([])
  const showToast = useToast()

  const calculateWeight = () => {
    const rawWeightNum = parseFloat(rawWeight)
    const cookedWeightNum = parseFloat(cookedWeight)
    const targetRawOzNum = parseFloat(targetRawOz)

    if (!rawWeightNum || !cookedWeightNum || !targetRawOzNum) {
      showToast("Please enter a valid number", "error")
      return
    } else if (rawWeightNum < cookedWeightNum) {
      showToast("Cooked weight cannot be more than raw weight", "error")
      return
    }

    const cookedPercentage = (cookedWeightNum / rawWeightNum) * 100
    const targetRawWeight = targetRawOzNum * 28.35
    const targetCookedWeight = (targetRawWeight * cookedPercentage) / 100

    const resultText = `For ${targetRawOzNum.toFixed(
      0
    )}oz raw , you should take ${targetCookedWeight.toFixed(1)}g of cooked.`

    setResult(resultText)
    setHistory((prevHistory) => [...prevHistory, targetCookedWeight.toFixed(1)])
    showToast(resultText, "info")
  }

  return (
    <ThemeProvider theme={darkTheme}>
      {/* This normalizes styles and applies the theme's background */}
      <Container maxWidth="md">
        <Typography variant="h4" gutterBottom align="center" sx={{ mt: 4, color: "primary.main" }}>
          Calculator
        </Typography>
        <StyledPaper elevation={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Raw Weight (g)"
                type="number"
                value={rawWeight}
                onChange={(e) => setRawWeight(e.target.value)}
                variant="outlined"
                InputProps={{
                  style: { color: darkTheme.palette.text.primary }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Cooked Weight (g)"
                type="number"
                value={cookedWeight}
                onChange={(e) => setCookedWeight(e.target.value)}
                variant="outlined"
                InputProps={{
                  style: { color: darkTheme.palette.text.primary }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Target Raw Weight (oz)"
                type="number"
                value={targetRawOz}
                onChange={(e) => setTargetRawOz(e.target.value)}
                variant="outlined"
                InputProps={{
                  style: { color: darkTheme.palette.text.primary }
                }}
              />
            </Grid>
          </Grid>
          <Box sx={{ mt: 3, display: "flex", justifyContent: "center" }}>
            <Button variant="contained" color="primary" onClick={calculateWeight} size="large">
              Calculate
            </Button>
          </Box>
        </StyledPaper>
        {result && (
          <StyledPaper elevation={3}>
            <Typography variant="h6" gutterBottom color="primary">
              Result
            </Typography>
            <Typography color="text.primary">{result}</Typography>
          </StyledPaper>
        )}
        {history.length > 0 && (
          <StyledPaper elevation={3}>
            <Typography variant="h6" gutterBottom color="primary">
              History
            </Typography>
            <List>
              {history.map((item, index) => (
                <ListItem key={index}>
                  <ListItemText
                    primary={`${item}g of cooked`}
                    primaryTypographyProps={{ color: "text.primary" }}
                  />
                </ListItem>
              ))}
            </List>
          </StyledPaper>
        )}
      </Container>
    </ThemeProvider>
  )
}

export default Calculators
