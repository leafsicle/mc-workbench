import React from "react"
import { ThemeProvider } from "@mui/material"
import { darkTheme } from "./themes"

const DarkThemeWrapper = ({ children }) => {
  return <ThemeProvider theme={darkTheme}>{children}</ThemeProvider>
}

export default DarkThemeWrapper
