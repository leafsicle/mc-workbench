import React from "react"
import { Button } from "@/components/ui/button"

const DefaultButton = ({ children, onClick }) => {
  return <Button onClick={onClick}>{children}</Button>
}

export default DefaultButton
