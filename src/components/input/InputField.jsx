import { TextField, styled } from "@mui/material"

const InputField = styled(TextField)(({ theme }) => ({
  "& .MuiInputBase-input": {
    // text color
    color: theme.palette.text.darkBackground
  },
  "& .MuiInputLabel-root": {
    // label color
    color: theme.palette.primary.main
  },
  "& .MuiOutlinedInput-root": {
    // border color
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: theme.palette.primary.main
    }
  }
}))

export default InputField
