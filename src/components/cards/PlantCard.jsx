import React from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Typography } from "@mui/material"

const PlantCard = ({ plant }) => {
  const navigate = useNavigate()
  // <Card
  //   key={plant.id}
  //   tabIndex={plant.id}
  //   onMouseEnter={handleMouseEnter}
  //   onMouseLeave={handleMouseLeave}
  //   onClick={() => setHideDescription(!hideDescription)}
  //   <CardMedia
  //     sx={{
  //       height: hideDescription ? "80%" : "10%"
  //     }}
  //     image={plant.image}
  //     title={plant.name}
  //     alt={plant.name}
  //   />
  //   <CardContent>
  //     <Typography variant="h5" component="div">
  //       {plant.name}
  //     </Typography>
  //     <Typography
  //       variant="body2"
  //       style={{
  //         maxHeight: "40%",
  //         transition: "all 0.3s ease-in-out",
  //         overflow: "hidden",
  //         padding: "1.5rem 0"
  //       }}>
  //       {!hideDescription && plant.description}
  //     </Typography>
  //   </CardContent>
  // </Card>
  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="flex-col gap-2">
        <CardTitle>404</CardTitle>
        <CardDescription>Page not found</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-center items-center flex-col h-full">
          <img
            src={plant.image}
            alt={plant.name}
            style={{
              minWidth: "100px",
              minHeight: "100px",
              maxWidth: "200px",
              maxHeight: "200px"
            }}
          />
          <Typography variant="h5" component="div">
            {plant.name}
          </Typography>
        </div>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button type="submit" className="w-full" onClick={() => navigate("/")}>
          Home
        </Button>
        <Button disabled variant="neutral" className="w-full">
          Go somewhere weird
        </Button>
      </CardFooter>
    </Card>
  )
}
export default PlantCard
