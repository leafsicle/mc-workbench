import React, { useState, useEffect } from 'react'
import { plants } from '../../data/plants'
import PlantCard from '../cards/plantCard/PlantCard'

const NotFound = () => {
  useEffect(() => {
    document.title = 'Danger Zone'
  }, [])

  const chosenOne = () => {
    const plant = plants[Math.floor(Math.random() * plants.length)]
    return plant
  }
  const plant = chosenOne()

  return (
    <div>
      <h1>404</h1>
      <h2>Page not found</h2>
      <PlantCard plant={plant} useGlow={false} />
    </div>
  )
}
export default NotFound
