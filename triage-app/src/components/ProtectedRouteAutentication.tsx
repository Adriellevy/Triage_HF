import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '@/contex/AuthContext'
import Cookies from 'js-cookie' // Para manejar cookies
import { getUserIdByToken } from '@/services/userService'
import TimeExpireModalAndErrors from './TimeExpireModalAndErrors'
import { isTokenExpired } from '@/helpers/HelperAuthentication'

interface ProtectedRouteAutenticationProps {
  children: React.ReactNode
}

function ProtectedRouteAutentication({ children }: ProtectedRouteAutenticationProps) {
  const { isAuthenticated, logout, refreshAuthToken } = useAuth()

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
            // Verificar si el token de refresh está vencido
            const verificationToken = Cookies.get('verificationToken')

            console.log('verfication', verificationToken)

            if (!verificationToken) {
              logout()
              setShowWarning(false)
            }
            if (verificationToken && isTokenExpired(verificationToken)) {
              logout()
              setShowWarning(false)
            }
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
  }, [isAuthenticated, Cookies.get('authToken'), Cookies.get('verificationToken')])

  // Verificar periódicamente la expiración de la cookie de verificación mientras el modal está abierto
  useEffect(() => {
    if (showWarning) {
      const interval = setInterval(() => {
        const verificationToken = Cookies.get('verificationToken')
        if (!verificationToken || isTokenExpired(verificationToken)) {
          logout()
          setShowWarning(false)
        }
      }, 1000) // Verificar cada segundo

      return () => clearInterval(interval)
    }
  }, [showWarning, logout])

  const OnRefresh = () => {
    console.log('entree')
    refreshAuthToken()
    window.location.reload()
  }

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
            onrefresh={OnRefresh} // Solo permitir refrescar si el token no está vencido
          />
        )}
      </>
    )
  return <>{children}</>
}

export default ProtectedRouteAutentication
