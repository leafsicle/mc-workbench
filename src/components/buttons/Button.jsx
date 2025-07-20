import React from "react"
import { Button } from "@/components/ui/button"

const DefaultButton = ({ children, onClick, disabled, reverse }) => {
  return (
    <Button disabled={disabled} onClick={onClick} variant={reverse ? "reverse" : "default"}>
      {children}
    </Button>
  )
}

export default DefaultButton
