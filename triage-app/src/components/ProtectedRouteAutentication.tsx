import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '@/contex/AuthContext'
import Cookies from 'js-cookie' // Para manejar cookies
import { getUserIdByToken } from '@/services/userService'
import TimeExpireModalAndErrors from './TimeExpireModalAndErrors'

interface ProtectedRouteAutenticationProps {
  children: React.ReactNode
}

function ProtectedRouteAutentication({ children }: ProtectedRouteAutenticationProps) {
  const { isAuthenticated, logout } = useAuth()

  const [showWarning, setShowWarning] = useState(false) // Estado para controlar el modal
  const [errorMessage, setErrorMessage] = useState('') // Estado para almacenar el mensaje de error
  // Verificamos si existe la cookie de verificación cuando se monta el componente
  useEffect(() => {
    if (isAuthenticated) {
      const fetchData = async () => {
        try {
          await getUserIdByToken()
        } catch (error) {
          console.log('llego al route auth')
          if (error.message === 'Cerrar sesion') {
            logout()
            window.location.reload()
          } else {
            // Mostrar el modal con el error
            setErrorMessage(error.message || 'Unknown error occurred')
            setShowWarning(true)
            console.error('el error que llego es: ', error)
          }
        }
      }
      fetchData()
    } else {
      window.location.reload()
    }
  }, [isAuthenticated, Cookies.get('authToken')])

  if (!isAuthenticated) {
    return <Navigate to='/login' replace />
  }
  if (showWarning)
    return (
      <>
        {showWarning && (
          <TimeExpireModalAndErrors
            message={errorMessage}
            onClose={() => {
              logout()
              setShowWarning(false)
            }} // Cierra el modal al hacer clic en el botón
            onrefresh={function (): void {
              throw new Error('Function not implemented.')
            }}
          />
        )}
      </>
    )
  return <>{children}</>
}

export default ProtectedRouteAutentication
