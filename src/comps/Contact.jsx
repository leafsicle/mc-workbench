import React from 'react'
import ExternalLink from './ExternalLink'

let socials = [
  {
    name: 'linkedin',
    url: 'https://www.linkedin.com/in/cookem529/',
    alt: 'External link to linkedin',
    icon: 'fa-brands fa-linkedin '
  },
  {
    name: 'Discord',
    url: 'https://discordapp.com/users/Leafsicle#7877',
    alt: 'External link to Discord',
    icon: 'fa-brands fa-discord '
  },
  {
    name: 'Github',
    url: 'https://github.com/leafsicle',
    alt: 'External link to GitHub',
    icon: 'fa-brands fa-github '
  },
  {
    name: 'Twitter',
    url: 'https://twitter.com/M__cooke',
    alt: 'External link to Twitter',
    icon: 'fa-brands fa-twitter '
  },
  {
    name: 'Email',
    url:
      'mailto:cookem529@gmail.com?subject= You have a greate looking site!&body=I was checking out your portfolio page and wanted to say hi!',
    alt: 'External link to open email client',
    icon: 'fa-solid fa-envelope '
  }
]
const Contact = () => {
  return (
    <div className='contrast text-white  text-2xl font-sans'>
      <main className=''>
        {socials.map((social, index) => (
          <ExternalLink socialInfo={social} key={index} />
        ))}
      </main>
    </div>
  )
}

export default Contact
