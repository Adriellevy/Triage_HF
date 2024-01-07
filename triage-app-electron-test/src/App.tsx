import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import NotFound from './pages/NotFound'
import GuidedEntry from './pages/GuidedEntry'
import Stats from './pages/Stats'
import Patients from './pages/Patients'
import Boxes from './pages/Boxes'
import Sidebar from './components/Sidebar'
import { useAuth } from './contex/AuthContext'
import PatientDetail from './pages/PatientDetail'

function App() {
  const { isAuthenticated } = useAuth()

  return (
    <Routes>
      {isAuthenticated ? (
        <Route
          path='*'
          element={
            <div className='flex h-screen'>
              <Sidebar />
              <div className='flex-1 overflow-y-auto h-screen bg-gray-100'>
                <Routes>
                  <Route path='/' element={<GuidedEntry />} />
                  <Route path='/guidedentry' element={<GuidedEntry />} />
                  <Route path='/patients' element={<Patients />} />
                  <Route path='/patients/:patient_id' element={<PatientDetail />} />
                  <Route path='/stats' element={<Stats />} />
                  <Route path='/boxes' element={<Boxes />} />
                  <Route path='*' element={<NotFound />} />
                </Routes>
              </div>
            </div>
          }
        />
      ) : (
        <Route path='*' element={<Navigate to='/login' />} />
      )}
      <Route path='/login' element={isAuthenticated ? <Navigate to='/' /> : <Login />} />
    </Routes>
  )
}

export default App
