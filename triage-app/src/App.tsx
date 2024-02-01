import { Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import NotFound from './pages/NotFound'
import GuidedEntry from './pages/GuidedEntry'
import Stats from './pages/Stats'
import Patients from './pages/Patients'
import Boxes from './pages/Boxes'
import Sidebar from '@/components/Sidebar'
import Configuration from './pages/Configuration'
import { useAuth } from './contex/AuthContext' // Corrected the import path
import PatientDetail from './pages/PatientDetail'
import UserDetail from './pages/UserDetail'
import { useEffect, useState } from 'react'

import Cookies from 'js-cookie'

function App() {
  const { isAuthenticated, login } = useAuth()
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

  // Check authentication status on startup
  /*if (isAuthenticated === null) {
    // You might want to display a loading spinner or some indicator here
    return <div>Loading...</div>;
  }*/

  return (
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
                  <Route path='/stats' element={<Stats />} />
                  <Route path='/boxes' element={<Boxes />} />
                  <Route path='/configuration' element={<Configuration />} />
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
  )
}

export default App
