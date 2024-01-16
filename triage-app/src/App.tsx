import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import GuidedEntry from './pages/GuidedEntry';
import Stats from './pages/Stats';
import Patients from './pages/Patients';
import Boxes from './pages/Boxes';
import Sidebar from '@/components/Sidebar';
import { useAuth } from './contex/AuthContext'; // Corrected the import path
import PatientDetail from './pages/PatientDetail';
import UserDetail from './pages/UserDetail';

function App() {
  const { isAuthenticated } = useAuth();

  // Check authentication status on startup
  if (isAuthenticated === null) {
    // You might want to display a loading spinner or some indicator here
    return <div>Loading...</div>;
  }

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
                  <Route path='*' element={<NotFound />} />
                </Routes>
              </div>
            </div>
          }
        />
      ) : (
        // Redirect to login if not authenticated
        <Route path='*' element={<Navigate to='/login' />} />
      )}
      <Route
        path='/login'
        element={isAuthenticated ? <Navigate to='/' /> : <Login />}
      />
    </Routes>
  );
}

export default App;
