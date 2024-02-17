import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './contex/AuthContext.tsx'
import { SocketProvider } from './contex/SocketContext.tsx'
import { RoleProvider } from './contex/RoleContext.tsx'

import './CSS/main.css'


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <SocketProvider>
        <RoleProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </RoleProvider>
      </SocketProvider>
    </AuthProvider>
  </React.StrictMode>
)
