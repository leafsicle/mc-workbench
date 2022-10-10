import NavigationLink from './NavigationLink'
import { Link } from 'react-router-dom'
import { Disclosure } from '@headlessui/react'
import { MenuIcon, XIcon } from '@heroicons/react/outline'

const Header = () => {
  const navigation = [
    { name: 'About', pageName: '/About', current: true },
    { name: 'Projects', pageName: '/Projects', current: false }
  ]

  return (
    <Disclosure
      as='nav'
      className='bg-primary 
      text-white
      font-sans
      hover:text-active
      border-indigo-100
      border-b-2
      '
    >
      {({ open }) => (
        <>
          <div className=' mx-auto px-2 sm:px-6 lg:px-8'>
            <div className='relative flex items-center justify-between h-16'>
              <div className='inset-y-0 left-0 flex items-center sm:hidden'>
                {/* Mobile menu button*/}
                <Disclosure.Button
                  className='inline-flex 
                  items-center 
                  justify-center 
                  p-2 
                  rounded-md 
                  focus:outline-none 
                  focus:ring-2 
                  focus:ring-inset 
                  focus:ring-white 
                  focus:decoration-dashed'
                >
                  <span className='sr-only'>Open main menu</span>
                  {open ? (
                    <XIcon className='block h-6 w-6' aria-hidden='true' />
                  ) : (
                    <MenuIcon className='block h-6 w-6' aria-hidden='true' />
                  )}
                </Disclosure.Button>
              </div>
              <div className='flex-1 flex items-center justify-center sm:justify-start md:justify-start '>
                <div className='flex-shrink-0 flex items-center'>
                  <Link
                    className='text-3xl sm:text-4xl md:text-5xl mr-3'
                    to='/'
                  >
                    🚀
                  </Link>
                </div>
                <div className='hidden sm:block sm:ml-6'>
                  <div className='flex space-x-4'>
                    {navigation.map(navLink => (
                      <NavigationLink
                        key={navLink.name}
                        pageName={navLink.pageName}
                        aria-current={navLink.current ? 'page' : undefined}
                      ></NavigationLink>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Disclosure.Panel className='sm:hidden '>
            <div className='px-2 pt-2 pb-3 space-y-4'>
              {navigation.map(item => (
                <NavigationLink
                  key={item.name}
                  pageName={item.pageName}
                  aria-current={item.current ? 'page' : undefined}
                ></NavigationLink>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  )
}

export default Header
