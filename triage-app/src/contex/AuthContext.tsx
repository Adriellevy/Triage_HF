import React, { createContext, useContext, useState, ReactNode } from 'react'
import Cookies from 'js-cookie'
import { logout_petition } from '@/services/authService'
interface AuthContextProps {
  isAuthenticated: boolean
  login: (token: string) => void
  logout: () => void
  setAutenticationCookie: (Verification_token: string) => void
  setVerificationCookie: (Verification_token: string) => void // Nueva función para manejar la cookie de verificación
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
    Cookies.set('authToken', Verification_token, { expires: 1 / 144 }) // 10 minutos
  }

  const setVerificationCookie = (Verification_token: string) => {
    Cookies.set('verificationToken', Verification_token, { expires: 1 / 144 }) // 10 minutos
  }

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, login, logout, setAutenticationCookie, setVerificationCookie }}
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
