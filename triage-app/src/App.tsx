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
function App() {
  const { isAuthenticated, login } = useAuth()
  const { role, setRole } = useRoleContext()
  const [User, setUser] = useState<string>('')
  const [Actual_user, setActualUser] = useState<User>()

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
          setActualUser(user)
        }
      } catch (error) {
        console.error((error as Error).message)
      }
    }
    fetchData()
  })

  return (
    <Suspense>
      <Toaster richColors closeButton visibleToasts={7} />
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
                    <Route path='/patients/:patient_id' element={<PatientDetail />} />{' '}
                    {
                      //le paso el parametro del tipo de usario para saber que ventana de edicion de paciente cargar
                    }
                    <Route
                      path='/edit_patient/:edditingPatientID'
                      element={<PatientEdit user_tipe={role} />}
                    />
                    <Route path='/users' element={<UserDetail />} />
                    <Route path='/users/:user_id' element={<UserDetail />} />
                    <Route path='/boxes' element={<Boxes />} />
                    {role === UserRole.HOSPITAL && (
                      <>
                        <Route path='/stats/cant_pacientes_fecha' element={<StatsPatinet />} />
                        <Route path='/stats/top_consultas_fecha' element={<StatsTopConsultas />} />
                        <Route
                          path='/stats/patients_mean_time_doctor'
                          element={<StatsPatientTriage />}
                        />
                        <Route
                          path='/stats/patients_mean_time_nurse'
                          element={<PatientsMeanTimeNurse />}
                        />
                        <Route
                          path='/stats/number_patients_date/age/'
                          element={<PatientsMeanAge />}
                        />
                        <Route path='/settings/user' element={<UserSettings />} />
                        <Route path='/settings/box' element={<BoxSettings />} />
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
