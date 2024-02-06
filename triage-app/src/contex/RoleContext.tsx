import React, { createContext, useContext, useState, ReactNode } from 'react'
import { UserRole } from '@/interfaces/User'

interface IUserRole {
  role: UserRole
  setRole: (role: UserRole) => void
}

const RoleContext = createContext<IUserRole | undefined>(undefined)

interface RoleProviderProps {
  children: ReactNode
}

export const RoleProvider: React.FC<RoleProviderProps> = ({ children }) => {
  const [role, setRole] = useState<UserRole>(UserRole.DOCTOR)

  const contextValue: IUserRole = {
    role,
    setRole
  }

  return <RoleContext.Provider value={contextValue}>{children}</RoleContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export const useRoleContext = () => {
  const context = useContext(RoleContext)

  if (!context) {
    throw new Error('useRoleContext must be used within a RoleProvider')
  }

  return context
}
