import React, { useState, useEffect } from 'react'
import { plants } from '../../data/plants'

const NotFound = () => {
  useEffect(() => {
    document.title = 'Danger Zone'
  }, [])
  const chosenOne = () => {
    const plant = plants[Math.floor(Math.random() * plants.length)]
    return plant
  }
  const plant = chosenOne()

  const [showFact, setShowFact] = useState(false)
  return (
    <div>
      <h1>404</h1>
      <h2>Page not found</h2>
      <p>Take a plant fact with you!</p>
      {/* <button onClick={() => setShowFact(!showFact)}>Show fact</button> */}
      <p>{plant.name}</p>
      <em>{plant.scientificName}</em>
      <p>{plant.description}</p>
      <img src={plant.image} alt={plant.name} style={{ maxWidth: '40%' }} />
    </div>
  )
}
export default NotFound
