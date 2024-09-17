import { Suspense, useEffect, useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Cookies from 'js-cookie'
import { Toaster } from 'sonner'
import { useAuth } from '@/contex/AuthContext'
import { useRoleContext } from '@//contex/RoleContext'
import Login from '@/pages/Login'
import NotFound from '@/pages/NotFound'
import GuidedEntry from '@/pages/GuidedEntry'
import Patients from '@/pages/Patients'
import Boxes from '@/pages/Boxes'
import PatientDetail from '@/pages/PatientDetail'
import UserDetail from '@/pages/UserDetail'
import Sidebar from '@/components/Sidebar'
import { UserRole, User } from '@/interfaces/User'
import { getUserById, getUserIdByToken } from '@/services/userService'
import StatsPatinet from './pages/stats/StatsPatinet'
import StatsTopConsultas from './pages/stats/StatsTopConsultas'
import BoxSettings from './pages/settings/BoxSettings'
import UserSettings from './pages/settings/UserSettings'
import PatientEdit from './pages/PatientEdit'
import StatsPatientTriage from './pages/stats/StatsPatientTriage'
import PatientsMeanTimeNurse from './pages/stats/PatientsMeanTimeNurse'
import PatientsMeanAge from './pages/stats/PatientsMeanAge'
import Settings from './pages/settings/Settings'
import ProtectedRouteWithVerification from './components/ProtectedRouteWithVerification'
import TimeExpireModalAndErrors from './components/TimeExpireModalAndErrors'

function App() {
  const { isAuthenticated, login, logout } = useAuth()
  const { role, setRole } = useRoleContext()
  const [User, setUser] = useState<string>('')
  const [Actual_user, setActualUser] = useState<User>()
  const [showWarning, setShowWarning] = useState(false) // Estado para controlar el modal
  const [errorMessage, setErrorMessage] = useState('') // Estado para almacenar el mensaje de error

  useEffect(() => {
    const valor_token = Cookies.get('authToken')
    if (valor_token) {
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
          setActualUser(user)
        }
      } catch (error: any) {
        if (error.message === 'Cerrar sesion') {
          logout()
        } else {
          // Mostrar el modal con el error
          setErrorMessage(error.message || 'Unknown error occurred')
          setShowWarning(true)
          console.error('el error que llego es: ', error)
        }
      }
    }
    fetchData()
  }, [User, setRole])

  return (
    <Suspense>
      <Toaster richColors closeButton visibleToasts={7} />
      {/* Mostrar el modal si hay un error */}
      {showWarning && (
        <TimeExpireModalAndErrors
          message={errorMessage}
          onClose={() => {
            logout()
            setShowWarning(false)
          }} // Cierra el modal al hacer clic en el botón
        />
      )}

      <Routes>
        {isAuthenticated ? (
          <Route
            path='*'
            element={
              <div className='flex sm:h-screen'>
                <Sidebar />
                <div className='flex-1 overflow-y-auto bg-gray-100 mt-16 md:mt-0 lg:mt-0'>
                  <Routes>
                    <Route path='/' element={<GuidedEntry />} />
                    <Route path='/guidedentry' element={<GuidedEntry />} />
                    {Actual_user && (
                      <Route
                        path='/patients'
                        element={<Patients actual_user={Actual_user} role={role} />}
                      />
                    )}
                    <Route path='/patients/:patient_id' element={<PatientDetail />} />
                    <Route
                      path='/edit_patient/:edditingPatientID'
                      element={<PatientEdit user_tipe={role} />}
                    />
                    <Route path='/users' element={<UserDetail />} />
                    <Route path='/users/:user_id' element={<UserDetail />} />
                    <Route path='/boxes' element={<Boxes />} />
                    {role === UserRole.HOSPITAL && (
                      <>
                        <Route
                          path='/stats/cant_pacientes_fecha'
                          element={
                            <ProtectedRouteWithVerification
                              Username={Actual_user?.user_name ? Actual_user.user_name : ''}
                              role={role}
                              allowedRole={UserRole.HOSPITAL}
                            >
                              <StatsPatinet />
                            </ProtectedRouteWithVerification>
                          }
                        />
                        <Route
                          path='/stats/top_consultas_fecha'
                          element={
                            <ProtectedRouteWithVerification
                              Username={Actual_user?.user_name ? Actual_user.user_name : ''}
                              role={role}
                              allowedRole={UserRole.HOSPITAL}
                            >
                              <StatsTopConsultas />
                            </ProtectedRouteWithVerification>
                          }
                        />
                        <Route
                          path='/stats/patients_mean_time_doctor'
                          element={
                            <ProtectedRouteWithVerification
                              Username={Actual_user?.user_name ? Actual_user.user_name : ''}
                              role={role}
                              allowedRole={UserRole.HOSPITAL}
                            >
                              <StatsPatientTriage />
                            </ProtectedRouteWithVerification>
                          }
                        />
                        <Route
                          path='/stats/patients_mean_time_nurse'
                          element={
                            <ProtectedRouteWithVerification
                              Username={Actual_user?.user_name ? Actual_user.user_name : ''}
                              role={role}
                              allowedRole={UserRole.HOSPITAL}
                            >
                              <PatientsMeanTimeNurse />
                            </ProtectedRouteWithVerification>
                          }
                        />
                        <Route
                          path='/stats/number_patients_date/age'
                          element={
                            <ProtectedRouteWithVerification
                              Username={Actual_user?.user_name ? Actual_user.user_name : ''}
                              role={role}
                              allowedRole={UserRole.HOSPITAL}
                            >
                              <PatientsMeanAge />
                            </ProtectedRouteWithVerification>
                          }
                        />
                        <Route
                          path='/settings/user'
                          element={
                            <ProtectedRouteWithVerification
                              Username={Actual_user?.user_name ? Actual_user.user_name : ''}
                              role={role}
                              allowedRole={UserRole.HOSPITAL}
                            >
                              <UserSettings />
                            </ProtectedRouteWithVerification>
                          }
                        />
                        <Route
                          path='/settings/box'
                          element={
                            <ProtectedRouteWithVerification
                              Username={Actual_user?.user_name ? Actual_user.user_name : ''}
                              role={role}
                              allowedRole={UserRole.HOSPITAL}
                            >
                              <BoxSettings />
                            </ProtectedRouteWithVerification>
                          }
                        />
                        <Route
                          path='/settings/'
                          element={
                            <ProtectedRouteWithVerification
                              Username={Actual_user?.user_name ? Actual_user.user_name : ''}
                              role={role}
                              allowedRole={UserRole.HOSPITAL}
                            >
                              <Settings />
                            </ProtectedRouteWithVerification>
                          }
                        />
                      </>
                    )}
                    <Route path='*' element={<NotFound />} />
                  </Routes>
                </div>
              </div>
            }
          />
        ) : (
          <Route path='*' element={<Login handleUserChange={setUser} user={User} />} />
        )}
      </Routes>
    </Suspense>
  )
}

export default App
