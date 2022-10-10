import React from 'react'
import { Link } from 'react-router-dom'

const NavigationLink = ({ pageName }) => {
  return (
    <Link
      to={pageName}
      className='text-base 
      font-medium 
      py-2
      contrast
      transition-all 
      hover:text-active 
      hover:bg-red
      hover:rounded
      px-5 
      '
    >
      {pageName}
    </Link>
  )
}

export default NavigationLink
