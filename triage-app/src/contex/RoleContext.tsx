import React, { createContext, useContext, useState, ReactNode } from 'react'
import { Role } from '@/interfaces/UserRole'

interface IUserRole {
  role: Role
  setRole: (role: Role) => void
}

const RoleContext = createContext<IUserRole | undefined>(undefined)

interface RoleProviderProps {
  children: ReactNode
}

export const RoleProvider: React.FC<RoleProviderProps> = ({ children }) => {
  const [role, setRole] = useState<Role>(Role.DOCTOR)

  const contextValue: IUserRole = {
    role,
    setRole
  }

  return <RoleContext.Provider value={contextValue}>{children}</RoleContext.Provider>
}

export const useRoleContext = () => {
  const context = useContext(RoleContext)

  if (!context) {
    throw new Error('useRoleContext must be used within a RoleProvider')
  }

  return context
}
