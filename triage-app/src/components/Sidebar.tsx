import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contex/AuthContext'

import GuidedEntryIcon from '../icons/guided-entry-icon.svg'
import BoxesIcon from '../icons/boxes-icon.svg'
import PatientsIcon from '../icons/patients.svg'
import StatsIcon from '../icons/stats-icon.svg'
import HamburgerIcon from '../icons/hamburger-icon.svg'
import HamburgerCloseIcon from '../icons/hamburger-close-icon.svg'

// TODO: Change LOGO
import Logo from '../icons/stats-icon.svg'
// Todo: DB img
import DoctorImg from '../assets/doctor.jpeg'

interface MenuItem {
  icon?: string
  title: string
  linkUrl: string
}

function Sidebar() {
  const { logout } = useAuth()
  const [menuVisible, setMenuVisible] = useState(false)

  // TODO: GET DB
  const UserName = 'Dr. Smith'
  const UserRol = 'DOCTOR'
  const UserProfileImage = DoctorImg

  const menuitems: MenuItem[] = [
    {
      icon: GuidedEntryIcon,
      title: 'Guided Entry',
      linkUrl: '/guidedentry'
    },
    {
      icon: BoxesIcon,
      title: 'Boxes',
      linkUrl: '/boxes'
    },
    {
      icon: PatientsIcon,
      title: 'Patients',
      linkUrl: '/patients'
    },
    {
      icon: StatsIcon,
      title: 'Stats',
      linkUrl: '/stats'
    }
  ]

  const handleLogout = () => {
    logout()
  }

  const toggleMenu = () => {
    setMenuVisible(!menuVisible)
  }

  const closedMenu = () => {
    setMenuVisible(false)
  }

  return (
    <div>
      <div className='hidden md:flex lg:flex flex-col w-56 bg-gray-800 text-white h-full'>
        <div className='p-4 flex items-center'>
          <img src={Logo} alt='Logo' className='w-8 h-8 mr-2' />
          <div className='text-3xl font-bold'>Triage App</div>
        </div>
        <nav className='flex-1'>
          {menuitems.map((item, index) => (
            <Link to={item.linkUrl} key={index} className='block p-3 hover:bg-gray-700 text-lg'>
              {item.icon && (
                <img src={item.icon} alt={item.title} className='inline-block w-5 h-5 mr-2' />
              )}
              {item.title}
            </Link>
          ))}
        </nav>
        <div className='flex items-center p-4'>
          <img src={UserProfileImage} alt='Profile' className='w-10 h-10 rounded-full mr-2' />
          <div>
            {/*TODO: Use jsonwebtoken id for user info */}
            <Link to={`/users/${'1'}`} className=' hover:underline'>
              <div className='font-semibold'>{UserName}</div>
            </Link>
            <div className=' text-gray-400'>{UserRol}</div>
          </div>
        </div>
        <div className='mt-auto p-4'>
          <button onClick={handleLogout} className='bg-red-500 text-white p-2 rounded-md w-full'>
            Logout
          </button>
        </div>
      </div>

      <div className='md:hidden'>
        <div
          className={` ${
            menuVisible ? 'flex' : 'hidden'
          } absolute z-20 flex-col items-center self-end py-8 mt-16 space-y-6 font-bold  dark:text-white bg-gray-50 dark:bg-slate-800 drop-shadow md w-full`}
        >
          <nav className='flex-1'>
            {menuitems.map((item, index) => (
              <Link to={item.linkUrl} key={index} className='block p-3 hover:bg-gray-700 text-lg'>
                <button onClick={closedMenu}>
                  {item.icon && (
                    <img src={item.icon} alt={item.title} className='inline-block w-5 h-5 mr-2' />
                  )}
                  {item.title}
                </button>
              </Link>
            ))}
          </nav>
          <div className='mt-auto p-4'>
            <button onClick={handleLogout} className='bg-red-500 text-white p-2 rounded-md w-full'>
              Logout
            </button>
          </div>
        </div>

        <div className='md:hidden fixed z-50 top-0 bg-gray-800 text-white w-full p-4 text-center'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center'>
              <img src={Logo} alt='Logo' className='w-8 h-8 mr-2' />
              <span className='text-lg font-bold mx-auto'>Triage App</span>
            </div>
            <button onClick={toggleMenu} className='text-lg font-bold'>
              {menuVisible ? (
                <img src={HamburgerCloseIcon} alt='Close Icon' className='w-8 h-8' />
              ) : (
                <img src={HamburgerIcon} alt='Menu Icon' className='w-8 h-8' />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
