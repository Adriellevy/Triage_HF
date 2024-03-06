import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './contex/AuthContext.tsx'
import { SocketProvider } from './contex/SocketContext.tsx'
import { RoleProvider } from './contex/RoleContext.tsx'
import { I18nextProvider } from 'react-i18next'
import i18n from './i18n'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <SocketProvider>
        <RoleProvider>
          <BrowserRouter>
            <I18nextProvider i18n={i18n}>
              <App />
            </I18nextProvider>
          </BrowserRouter>
        </RoleProvider>
      </SocketProvider>
    </AuthProvider>
  </React.StrictMode>
)
