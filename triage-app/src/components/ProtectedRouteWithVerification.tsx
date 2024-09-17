import { useState, useEffect } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contex/AuthContext'
import { UserRole } from '@/interfaces/User'
import VerifyUser from '@/components/VerifyUser'
import Cookies from 'js-cookie' // Para manejar cookies

interface ProtectedRouteWithVerificationProps {
  Username: string
  role: UserRole
  allowedRole: UserRole
  children: React.ReactNode
}

function ProtectedRouteWithVerification({
  Username,
  role,
  allowedRole,
  children
}: ProtectedRouteWithVerificationProps) {
  const { isAuthenticated } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [verified, setVerified] = useState<boolean>(false)

  // Verificamos si existe la cookie de verificación cuando se monta el componente
  useEffect(() => {
    const verificationToken = Cookies.get('verificationToken')
    //TODO ver de como hacer para proteger el acceso a todas estas rutas es una posible forma de no tener que hacer muchos cambios
    if (isAuthenticated && verificationToken) {
      setVerified(true)
    } else {
      setVerified(false)
    }
  }, [isAuthenticated, Cookies.get('verificationToken')])

  if (!isAuthenticated) {
    return <Navigate to='/login' replace />
  }

  if (role !== allowedRole) {
    return <Navigate to='/notfound' replace />
  }

  if (!verified) {
    return (
      <VerifyUser
        username={Username}
        onSuccessRedirect={location.pathname} // Redirige a la página actual si la verificación es exitosa
        onCancelRedirect={() => navigate(-1)} // Redirige a una página previa si se cancela
      />
    )
  }

  return <>{children}</>
}

export default ProtectedRouteWithVerification
