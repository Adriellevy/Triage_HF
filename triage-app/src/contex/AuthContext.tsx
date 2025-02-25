import React, { createContext, useContext, useState, ReactNode } from 'react'
import Cookies from 'js-cookie'
import { logout_petition } from '@/services/authService'
interface AuthContextProps {
  isAuthenticated: boolean
  login: (token: string) => void
  logout: () => void
  setAutenticationCookie: (Verification_token: string) => void
  setVerificationCookie: (Verification_token: string) => void // Nueva función para manejar la cookie de verificación
  refreshAuthToken: () => void
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setAuthenticated] = useState(false)

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const login = (_token: string) => {
    // Store the token in a cookie token: string
    //document.cookie = `authToken=${token}; path=/`;
    //aqui se podría hacer la request o el authservice hablarlo con luquitas
    setAuthenticated(true)
    setVerificationCookie(_token)
  }

  const logout = async () => {
    await logout_petition()
    document.cookie = 'authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
    document.cookie = 'verificationToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
    setAuthenticated(false)
  }

  const setAutenticationCookie = (Verification_token: string) => {
    // console.log('holaaaaa')
    // Cookies.set('authToken', Verification_token,   { expires: new Date(Date.now() + 10 * 1000) }) // 10 minutos
    Cookies.set('authToken', Verification_token, { expires: 1 / 144 }) // 10 minutos
    const cookieData = Cookies.get('authToken')
    if (cookieData) {
      const { value, expires } = JSON.parse(cookieData)
      console.log('Expira en:', new Date(expires))
    }
  }

  const setVerificationCookie = (Verification_token: string) => {
    Cookies.set('verificationToken', Verification_token, { expires: 1 / 144 }) // 10 minutos
  }

  const refreshAuthToken = () => {
    const verificationToken = Cookies.get('verificationToken')
    if (verificationToken) {
      setAutenticationCookie(verificationToken)
    } else {
      console.warn('No verification token found in cookies')
    }
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        login,
        logout,
        setAutenticationCookie,
        setVerificationCookie,
        refreshAuthToken
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
