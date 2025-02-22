// this will be the mui app theme
import { createTheme } from "@mui/material/styles"

const theme = createTheme({
  palette: {
    primary: {
      main: "#4caf50"
    },
    secondary: {
      main: "#ff9100"
    },
    error: {
      main: "#f44336"
    },
    warning: {
      main: "#ffeb3b"
    },
    info: {
      main: "#2196f3"
    },
    success: {
      main: "#4caf50"
    },
    background: {
      default: "#fafafa",
      dark: "#121212"
    },
    text: {
      primary: "#000000",
      secondary: "#000000",
      darkBackground: "#fafafa"
    }
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          height: "300px",
          borderRadius: "10px"
        }
      }
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: ".5rem",
          margin: "0px"
        }
      }
    }
  }
})

export default theme
