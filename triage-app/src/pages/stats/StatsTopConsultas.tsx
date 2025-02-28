import { embedDashboard } from '@superset-ui/embedded-sdk'
import { useEffect, useState } from 'react'
import { getAllDashboardsIds, getDashboardId } from '../../services/supersetService'

async function supersetLogin() {
  // Mover a un archivo de configuracion
  const LOGIN_URL = 'http://localhost:8088/api/v1/security/login'

  const payload = {
    username: 'admin', // Your Superset admin username
    password: 'admin', // Your Superset admin password
    provider: 'db',
    refresh: true
  }

  try {
    const response = await fetch(LOGIN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })

    if (!response.ok) {
      throw new Error('Login failed')
    }

    const data = await response.json()

    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token
    }
  } catch (error) {
    console.error('Login error:', error)
    throw error
  }
}

async function getCsrfToken(accessToken: string) {
  const CSRF_URL = 'http://localhost:8088/api/v1/security/csrf_token/'

  try {
    const response = await fetch(CSRF_URL, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })

    if (!response.ok) {
      throw new Error('Failed to fetch CSRF token')
    }

    const data = await response.json()
    return data.result
  } catch (error) {
    console.error('CSRF token error:', error)
    throw error
  }
}

async function createGuestToken() {
  try {
    // Login and get access token
    const { accessToken } = await supersetLogin()

    // Get CSRF token
    const csrfToken = await getCsrfToken(accessToken)

    // const dashboardIds = await getAllDashboardsIds(accessToken, csrfToken)
    // console.log('DashboardIds', dashboardIds)

    // Prepare guest token request
    const GUEST_TOKEN_URL = 'http://localhost:8088/api/v1/security/guest_token/'
    const payload = {
      user: {
        username: 'guest',
        first_name: 'Guest',
        last_name: 'User'
      },
      resources: [
        {
          type: 'dashboard',
          id: '4aa22d8e-96e4-4513-baf5-bc9b6af1c4cc' // Your dashboard ID
        }
      ],
      rls: [],
      roles: ['Gamma', 'Public']
    }

    // Make guest token request
    const response = await fetch(GUEST_TOKEN_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken,
        Referer: GUEST_TOKEN_URL
      },
      body: JSON.stringify(payload)
    })

    if (!response.ok) {
      const errorBody = await response.json()
      console.error('Guest token error:', errorBody)
      throw new Error('Failed to create guest token')
    }

    const data = await response.json()
    return data.token
  } catch (error) {
    console.error('Create guest token error:', error)
    throw error
  }
}

function Dashboard() {
  // const fetchGuestToken = async (): Promise<string> => {
  //   try {
  //     const body = {
  //       resources: [
  //         {
  //           id: "f23c569a-d1fd-4f52-9a4d-18a271f4da2f",
  //           type: "dashboard"
  //         }
  //       ],
  //       rls: [],
  //       user: {
  //         first_name: "Guest",
  //         last_name: "User",
  //         username: "guest",
  //         roles: ["Public", "Gamma"]
  //       }
  //     }

  //     const response = await fetch('http://localhost:8088/api/v1/security/guest_token/', {
  //       method: 'POST',
  //       credentials: 'include',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'Accept': 'application/json',
  //         'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6dHJ1ZSwiaWF0IjoxNzM4NDMwODAxLCJqdGkiOiI2YzgzOTE2MC04ZmEyLTQwMTAtYjY4Ni1hZDdlYWUwMTU5ZWIiLCJ0eXBlIjoiYWNjZXNzIiwic3ViIjoxLCJuYmYiOjE3Mzg0MzA4MDEsImNzcmYiOiIwMmNjNzg4MC1kZjgyLTQ5ZGEtYWU5YS0yZTQwNTU1YjZlYzUiLCJleHAiOjE3Mzg0MzE3MDF9.okk7F0u042mltpHUrvrVBmNYtTJOy-g1HXD8QFrEM1Y`
  //       },
  //       body: JSON.stringify(body)
  //     });
  //     const data = await response.json();
  //     if (!data.token) {
  //       console.error('Guest token response:', data);
  //       throw new Error('No token in response');
  //     }
  //     return data.guestToken;
  //   } catch (error) {
  //     console.error('Error fetching Settings:', error);
  //     throw error;
  //   }
  // }

  const [isTokenReady, setIsTokenReady] = useState(false)
  const [guestToken, setGuestToken] = useState<string | null>(null)

  useEffect(() => {
    const fetchAndEmbedDashboard = async () => {
      try {
        // Fetch the guest token first
        const token = await createGuestToken()
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
          id: '4aa22d8e-96e4-4513-baf5-bc9b6af1c4cc',
          supersetDomain: 'http://localhost:8088',
          mountPoint: document.getElementById('my-superset-container'),
          fetchGuestToken: fetchGuestTokenFunc,
          dashboardUiConfig: {
            hideTitle: true,
            filters: {
              expanded: true
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

  /* This is just a hack to make your dashboard full screen */
  useEffect(() => {
    const container = document.getElementById('my-superset-container')
    if (container && container.children[0]) {
      container.children[0].width = '1000px'
      container.children[0].height = '1000px'
    }
  }, [isTokenReady])

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
