import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { Provider as ReduxProvider } from 'react-redux'
import store from './redux/store/store.ts'
import { AuthProvider } from './contex/AuthContext.tsx'
import { SocketProvider } from './contex/SocketContext.tsx'
import { RoleProvider } from './contex/RoleContext.tsx'
import { I18nextProvider } from 'react-i18next'
import i18n from './i18n/i18n.ts'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ReduxProvider store={store}>
      <AuthProvider>
        <SocketProvider>
          <RoleProvider>
            <I18nextProvider i18n={i18n}>
              <BrowserRouter>
                <App />
              </BrowserRouter>
            </I18nextProvider>
          </RoleProvider>
        </SocketProvider>
      </AuthProvider>
    </ReduxProvider>
  </React.StrictMode>
)
