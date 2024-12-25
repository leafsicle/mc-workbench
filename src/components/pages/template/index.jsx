import React, { useState } from "react"
import { Container, Typography, Paper, CssBaseline, ThemeProvider, createTheme } from "@mui/material"
import { styled } from "@mui/material/styles"

// Create a dark theme
const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#90caf9", // A lighter blue for better contrast in dark mode
    },
    background: {
      default: "#303030",
      paper: "#424242",
    },
  },
})

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginTop: theme.spacing(3),
  backgroundColor: theme.palette.background.paper,
}))

const Template = ({ pageTitle = "Template", children }) => {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline /> {/* This normalizes styles and applies the theme's background */}
      <Container maxWidth="md">
        <Typography variant="h4" gutterBottom align="center" sx={{ mt: 4, color: "primary.main" }}>
          {pageTitle}
        </Typography>
        {children && (
          <StyledPaper elevation={3}>
            <Typography variant="h6" gutterBottom color="primary">
              {children}
            </Typography>
          </StyledPaper>
        )}
      </Container>
    </ThemeProvider>
  )
}

export default Template
