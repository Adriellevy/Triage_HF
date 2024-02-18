import { useEffect, useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Cookies from 'js-cookie'
import { Toaster } from 'sonner'
import { useAuth } from '@/contex/AuthContext'
import { useRoleContext } from '@//contex/RoleContext'
import Login from '@/pages/Login'
import NotFound from '@/pages/NotFound'
import GuidedEntry from '@/pages/GuidedEntry'
import Stats from '@/pages/Stats'
import Patients from '@/pages/Patients'
import Boxes from '@/pages/Boxes'
import Configuration from '@/pages/Configuration'
import PatientDetail from '@/pages/PatientDetail'
import UserDetail from '@/pages/UserDetail'
import Sidebar from '@/components/Sidebar'
import { UserRole } from '@/interfaces/User'
import { getUserById, getUserIdByToken } from '@/services/userService'

function App() {
  const { isAuthenticated, login } = useAuth()
  const { role, setRole } = useRoleContext()
  const [User, setUser] = useState<string>('')

  useEffect(() => {
    const valor_token = Cookies.get('authToken')
    if (valor_token) {
      //aca se puede mandar la solicitud aca o en login para chequear si el token es bueno o es shit (quiero que se vaya fijando cada vez que se haga algo en la app eso)
      //ver si esto nos generaria algun cuello de botella
      setUser(valor_token)
      login(valor_token)
    }
  }, [login])

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (User) {
          const data = await getUserIdByToken()
          const user = await getUserById(String(data))
          setRole(user.user_type)
        } else {
          // console.log('Error fetch data')
        }
      } catch (error) {
        // console.error('Error al obtener pacientes:', error.message)
      }
    }
    fetchData()
  })

  return (
    <>
      <Toaster richColors closeButton visibleToasts={7} />
      <Routes>
        {isAuthenticated ? (
          <Route
            path='*'
            element={
              <div className='flex h-screen '>
                <Sidebar />
                <div className='flex-1 overflow-y-auto h-screen bg-gray-100 mt-16 md:mt-0 lg:mt-0'>
                  <Routes>
                    <Route path='/' element={<GuidedEntry />} />
                    <Route path='/guidedentry' element={<GuidedEntry />} />
                    <Route path='/patients' element={<Patients />} />
                    <Route path='/patients/:patient_id' element={<PatientDetail />} />
                    <Route path='/users' element={<UserDetail />} />
                    <Route path='/users/:user_id' element={<UserDetail />} />

                    <Route path='/boxes' element={<Boxes />} />
                    {role === UserRole.HOSPITAL && (
                      <>
                        <Route path='/stats' element={<Stats />} />
                        <Route path='/configuration' element={<Configuration />} />
                      </>
                    )}
                    <Route path='*' element={<NotFound />} />
                  </Routes>
                </div>
              </div>
            }
          />
        ) : (
          // Redirect to login if not authenticated
          <Route path='*' element={<Login handleUserChange={setUser} user={User} />} />
        )}
      </Routes>
    </>
  )
}

export default App
