import { useEffect } from "react"

const ExternalRedirect = ({ to }) => {
  useEffect(() => {
    window.location.replace(to)
  }, [to])

  return (
    <p className="p-8 text-center text-white">
      Heading to <a href={to}>{to}</a>…
    </p>
  )
}

export default ExternalRedirect
