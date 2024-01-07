import { Link } from 'react-router-dom'
import { useAuth } from '../contex/AuthContext'

import GuidedEntryIcon from '../icons/guided-entry-icon.svg'
import BoxesIcon from '../icons/boxes-icon.svg'
import PatientsIcon from '../icons/patients.svg'
import StatsIcon from '../icons/stats-icon.svg'
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

  // TODO GET DB
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

  return (
    <div className='bg-gray-800 text-white h-full flex flex-col w-56'>
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
  )
}

export default Sidebar
