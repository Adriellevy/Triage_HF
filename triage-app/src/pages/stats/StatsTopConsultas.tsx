import { useState, useEffect } from 'react'
import { embedDashboard } from '@superset-ui/embedded-sdk'
import { createGuestToken, supersetLogin } from './utils/supersetInitialConfig'
import { getUUIdDashboard } from '@/services/supersetService'
import { access } from 'fs'

function Dashboard() {
  const [isTokenReady, setIsTokenReady] = useState(false)
  const [guestToken, setGuestToken] = useState<string | null>(null)

  useEffect(() => {
    const fetchAndEmbedDashboard = async () => {
      try {
        const SuperSetUserToken = await supersetLogin() // Accede a la propiedad accessToken
        console.log('token', SuperSetUserToken)
        if (!SuperSetUserToken) {
          console.log('No se obtuvo el token de usuario')
          throw new Error('No se obtuvo el token de usuario')
        }
        const uuid_dashbaord = await getUUIdDashboard(SuperSetUserToken)
        console.log('uuid dashbaord', uuid_dashbaord)
        // Fetch the guest token first
        const token = await createGuestToken(uuid_dashbaord, SuperSetUserToken)
        setGuestToken(token)

        // Define fetchGuestToken to be used by embedDashboard
        const fetchGuestTokenFunc = async (): Promise<string> => {
          if (!token) {
            throw new Error('Guest token not available')
          }
          return token
        }
        // Embed the dashboard only after token is fetched
        embedDashboard({
          id: uuid_dashbaord,
          supersetDomain: 'http://localhost:8088',
          mountPoint: document.getElementById('my-superset-container'),
          fetchGuestToken: fetchGuestTokenFunc,
          dashboardUiConfig: {
            hideTitle: true,
            filters: {
              expanded: false
            }
          },
          iframeSandboxExtras: ['allow-top-navigation', 'allow-popups-to-escape-sandbox']
        })

        setIsTokenReady(true)
      } catch (error) {
        console.error('Error fetching or embedding dashboard:', error)
        setIsTokenReady(false)
      }
    }

    fetchAndEmbedDashboard()
  }, [])

  useEffect(() => {
    if (!isTokenReady) return // Evita que el efecto se ejecute si el token aún no está listo

    const container = document.getElementById('my-superset-container')

    if (container) {
      const iframe = container.children[0] // Asegura que el iframe ya está presente
      if (iframe) {
        iframe.style.width = '1000px'
        iframe.style.height = '1000px'
      }
    }
  }, [isTokenReady]) // Se ejecuta solo cuando isTokenReady cambia a true

  // Conditional rendering to show loading state
  if (!isTokenReady) {
    return (
      <div>
        <h1>Loading Dashboard...</h1>
        <div id='my-superset-container'></div>
      </div>
    )
  }

  return (
    <div>
      <h1>My Superset Dashboard</h1>
      <div id='my-superset-container'></div>
    </div>
  )
}
//<!--<iframe src="http://localhost:8088/superset/dashboard/p/Zo9k2QE2RXn/" frameborder="0" height="1000px" width="100%"></iframe>
export default Dashboard
