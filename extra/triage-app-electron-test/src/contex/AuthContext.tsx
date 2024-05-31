import React, { createContext, useContext, useState, ReactNode } from 'react'

interface AuthContextProps {
  isAuthenticated: boolean
  login: (token: string) => void
  logout: () => void
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
    if (_token) {
      setAuthenticated(true)
    }
  }

  const logout = () => {
    document.cookie = 'authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
    setAuthenticated(false)
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
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
