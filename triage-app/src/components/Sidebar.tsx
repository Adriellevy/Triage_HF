import { useContext, useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import Cookies from 'js-cookie'
import { getUserById, getUserIdByToken } from '@/services/userService'
import { SocketContext } from '@/contex/SocketContext'
import { useAuth } from '@/contex/AuthContext'
import { useRoleContext } from '@/contex/RoleContext'
import { PartialUser, User, UserRole } from '@/interfaces/User'
import GuidedEntryIcon from '@/icons/guided-entry-icon.svg'
import BoxesIcon from '@/icons/boxes-icon.svg'
import PatientsIcon from '@/icons/patients.svg'
import StatsIcon from '@/icons/stats-icon.svg'
import HamburgerIcon from '@/icons/hamburger-icon.svg'
import HamburgerCloseIcon from '@/icons/hamburger-close-icon.svg'
import ConfigIcon from '@/icons/settings-2-svgrepo-com.svg'
import Logo from '@/icons/stats-icon.svg'
import ArrowNext from '@/icons/arrow-next.svg'
import ArrowPrev from '@/icons/arrow-prev.svg'
import { Button } from '@/components/ui'
// Todo: DB img
import DoctorImg from '../assets/doctor.jpeg'
import { UpdateEvent } from '@/interfaces/Socket'
import { Patient } from '@/interfaces/Patinet'
import { useTranslation } from 'react-i18next'
import { Box } from '@/interfaces/Boxes'

interface MenuItem {
  icon?: string
  label?: string
  title: string
  linkUrl: string
  submenu?: MenuItem[]
}

function Sidebar() {
  const { t } = useTranslation('Sidebar')
  const { logout } = useAuth()
  const navigate = useNavigate()
  const { role } = useRoleContext()
  const socket = useContext(SocketContext)
  const token = Cookies.get('authToken')
  const location = useLocation()
  const [menuVisible, setMenuVisible] = useState<boolean>(false)
  const [openSubMenu, setOpenSubMenu] = useState<number | null>(null)
  const [UserInfo, setUserInfo] = useState<PartialUser>({
    user_id: '',
    user_name: '',
    user_type: undefined
  })

  // TODO: GET IMG DB
  const UserProfileImage = DoctorImg

  const menuitems: MenuItem[] = [
    {
      icon: GuidedEntryIcon,
      label: t('GuidedEntry'),
      title: 'GuidedEntry',
      linkUrl: '/guidedentry'
    },
    {
      icon: BoxesIcon,
      label: t('Boxes'),
      title: 'Boxes',
      linkUrl: '/boxes'
    },
    {
      icon: PatientsIcon,
      label: t('Patients'),
      title: 'Patients',
      linkUrl: '/patients'
    },
    {
      icon: StatsIcon,
      label: t('Stats'),
      title: 'Stats',
      linkUrl: '/stats',
      submenu: [
        {
          icon: StatsIcon,
          title: t('StatsPatientsDate'),
          linkUrl: '/stats/cant_pacientes_fecha'
        },
        {
          icon: StatsIcon,
          title: t('StatsReasons'),
          linkUrl: '/stats/top_consultas_fecha'
        },
        {
          icon: StatsIcon,
          title: t('MeanTimePatientPerDoctor'),
          linkUrl: '/stats/patients_mean_time_doctor'
        },
        {
          icon: StatsIcon,
          title: t('MeanTimePatientPerNurse'),
          linkUrl: '/stats/patients_mean_time_nurse'
        },
        {
          icon: StatsIcon,
          title: t('StatsPatientsAge'),
          linkUrl: '/stats/number_patients_date/age/'
        }
      ]
    },
    {
      icon: ConfigIcon,
      label: t('Settings'),
      title: 'Settings',
      linkUrl: '/settings',
      submenu: [
        { icon: ConfigIcon, title: t('UsersSettings'), linkUrl: '/settings/user' },
        { icon: ConfigIcon, title: t('BoxesSettings'), linkUrl: '/settings/box' }
      ]
    }
  ]

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const toggleMenu = () => {
    setMenuVisible(!menuVisible)
  }

  const closedMenu = () => {
    setMenuVisible(false)
  }

  const handleSubMenuToggle = (index: number) => {
    setOpenSubMenu(openSubMenu === index ? null : index)
  }

  useEffect(() => {
    setOpenSubMenu(null)
  }, [location.pathname])

  useEffect(() => {
    const handleSocketEvent = (data: {
      user?: User
      patient?: Patient
      message: UpdateEvent
      box?: Box
    }) => {
      if (data.patient) {
        const { patient_id } = data.patient
        console.log(patient_id)

        if (data.message === UpdateEvent.NEW_PATIENT_ASSIGNED) {
          toast.info('Nuevo paciente asignado', {
            action: {
              label: 'Ver datos del paciente',
              onClick: () => {
                navigate(`/patients/${patient_id}`)
              }
            }
          })
        } else if (data.message === UpdateEvent.UPDATE_PATIENT) {
          toast.info('Uno de tus pacientes ha sido editado', {
            action: {
              label: 'Ver datos del paciente',
              onClick: () => {
                navigate(`/patients/${patient_id}`)
              }
            }
          })
        }
      } else if (data.box) {
        //En el caso de que el box lo haya agregado el mismo usuario
        // if (data.box.userAdded !== token) {
        if (data.message === UpdateEvent.BOX_UPDATE) {
          toast.info('Uno de sus Boxes ha sido modificado', {
            action: {
              label: 'Ver la lista de Boxes',
              onClick: () => {
                navigate(`/settings/box`)
              }
            }
          })
          // }
        }
      } else if (data.user) {
        //En el caso de que el box lo haya agregado el mismo usuario
        // if (data.box.userAdded !== token) {
        if (data.message === UpdateEvent.USER_UPDATE) {
          toast.info('Uno de sus Usuarios ha sido modificado', {
            action: {
              label: 'Ver la lista de Boxes',
              onClick: () => {
                navigate(`/settings/box`)
              }
            }
          })
          // }
        }
      } else {
        console.error('LLego una notificacion por socket que no es Box ni Patient')
        console.log('Data recibida del socket:', data)
      }
    }
    const setupSocket = () => {
      try {
        socket.on(`${UserInfo.user_id}`, handleSocketEvent)
      } catch (error) {
        console.error((error as Error).message)
      }
    }
    const cleanupSocket = () => {
      try {
        socket.off(`${UserInfo.user_id}`, handleSocketEvent)
      } catch (error) {
        console.error((error as Error).message)
      }
    }
    setupSocket()
    return cleanupSocket
  }, [token, UserInfo.user_id, socket, navigate])

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (token) {
          const data = await getUserIdByToken()
          const user = await getUserById(String(data))
          setUserInfo(user)
        }
      } catch (error) {
        console.error((error as Error).message)
      }
    }
    fetchData()
  }, [token])

  return (
    <div>
      <div className='hidden md:flex lg:flex flex-col w-56 bg-blue-900 text-white h-full'>
        <div className='p-4 flex items-center'>
          <img src={Logo} alt='Logo' className='w-8 h-8 mr-2' />
          <div className='text-3xl font-bold whitespace-nowrap'>Triage App</div>
        </div>
        <nav className='flex-1'>
          {menuitems.map((item, index) =>
            (item.title !== 'Settings' && item.title !== 'Stats' && role !== UserRole.HOSPITAL) ||
            role === UserRole.HOSPITAL ? (
              item.submenu ? (
                <div key={index} className='relative'>
                  <button
                    className='w-full p-3 hover:bg-blue-800 text-lg text-left flex items-center justify-between'
                    onClick={() => handleSubMenuToggle(index)}
                  >
                    <div className='flex items-center'>
                      <img src={item.icon} alt={item.title} className='inline-block w-5 h-5 mr-2' />
                      {item.label}
                    </div>
                    {openSubMenu === index ? (
                      <img src={ArrowPrev} className='inline-block w-5 h-5 mr-2' />
                    ) : (
                      <img src={ArrowNext} className='inline-block w-5 h-5 mr-2' />
                    )}
                  </button>
                  {openSubMenu === index && (
                    <div className='absolute left-full top-0 mt-2 ml-2 bg-blue-900 rounded-md p-2'>
                      {item.submenu.map((submenuItem, submenuIndex) => (
                        <Link
                          key={submenuIndex}
                          to={submenuItem.linkUrl}
                          className=' block px-3 py-2 hover:bg-blue-800 whitespace-nowrap'
                        >
                          {submenuItem.title}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link to={item.linkUrl} key={index} className='block p-3 hover:bg-blue-800 text-lg'>
                  {item.icon && (
                    <img src={item.icon} alt={item.title} className='inline-block w-5 h-5 mr-2' />
                  )}
                  {item.label}
                </Link>
              )
            ) : null
          )}
        </nav>
        <div className='flex items-center p-4'>
          <img src={UserProfileImage} alt='Profile' className='w-10 h-10 rounded-full mr-2' />
          <div>
            <Link to={`/users/${UserInfo.user_id}`} className=' hover:underline'>
              <div className='font-semibold'>{UserInfo.user_name}</div>
            </Link>
            <div className=' text-gray-400'>{UserInfo.user_type}</div>
          </div>
        </div>
        <div className='mt-auto p-4'>
          <Button wfull color='red' onClick={handleLogout}>
            {t('LogoutButton')}
          </Button>
        </div>
      </div>

      <div className='md:hidden '>
        <div
          className={` ${
            menuVisible ? 'flex' : 'hidden'
          } fixed z-20 flex-col items-center self-end py-8 mt-16 space-y-6 font-bold text-white bg-blue-900 drop-shadow md w-full`}
        >
          <nav className='flex-1'>
            {menuitems.map((item, index) =>
              (item.title !== 'Settings' && item.title !== 'Stats') ||
              role === UserRole.HOSPITAL ? (
                <Link to={item.linkUrl} key={index} className='block p-3 hover:bg-gray-700 text-lg'>
                  <button onClick={closedMenu}>
                    {item.icon && (
                      <img src={item.icon} alt={item.title} className='inline-block w-5 h-5 mr-2' />
                    )}
                    {item.label}
                  </button>
                </Link>
              ) : null
            )}
          </nav>
          <div className='mt-auto p-4'>
            <Button color='red' onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>

        <div className='md:hidden fixed z-50 top-0 bg-blue-900 text-white w-full p-4 text-center'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center'>
              <img src={Logo} alt='Logo' className='w-8 h-8 mr-2' />
              <span className='text-lg font-bold mx-auto'>Triage App</span>
            </div>
            <div className='flex items-center'>
              <img src={UserProfileImage} alt='Profile' className='w-10 h-10 rounded-full mr-2' />
              <div>
                <Link to={`/users/${UserInfo.user_id}`} className=' hover:underline'>
                  <div className='font-semibold'>{UserInfo.user_name}</div>
                </Link>
                <div className=' text-gray-400'>{UserInfo.user_type}</div>
              </div>
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
