// FUNCIONES COMPLEMENTARIAS
export async function supersetLogin() {
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
      body: JSON.stringify(payload),
      credentials: 'include'
    })

    if (!response.ok) {
      throw new Error('Login failed')
    }

    const data = await response.json()
    return data.access_token
  } catch (error) {
    console.error('Login error:', error)
    throw error
  }
}

async function getCsrfToken(accessToken: string) {
  const CSRF_URL = 'http://127.0.0.1:8088/api/v1/security/csrf_token/'

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

//   FUNCION PRINCIPAL PARA REUTILIZAR
export async function createGuestToken(DashboardUUID: string, access_token: string) {
  try {
    // Obtener CSRF token
    const csrfToken = await getCsrfToken(access_token)
    if (!csrfToken) {
      console.error('Error: No se obtuvo csrfToken de getCsrfToken')
      throw new Error('Missing csrfToken')
    }
    //console.log('CSRF Token obtenido:', csrfToken)

    //console.log('Dashboards obtenido:', dashboards)

    // Preparar el payload para la solicitud del guest token
    const payload = {
      user: {
        username: 'guest',
        first_name: 'Guest',
        last_name: 'User'
      },
      resources: [
        {
          type: 'dashboard',
          id: DashboardUUID // Your dashboard ID
        }
      ],
      rls: [],
      roles: ['Gamma', 'Public']
    }

    //console.log('Payload para guest token:', payload)

    // Definir la URL para la solicitud del guest token
    const GUEST_TOKEN_URL = 'http://127.0.0.1:8088/api/v1/security/guest_token/'

    // Realizar la solicitud
    const response = await fetch(GUEST_TOKEN_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${access_token}`,
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken,
        Referer: GUEST_TOKEN_URL
      },
      body: JSON.stringify(payload)
    })

    // Validar la respuesta
    if (!response.ok) {
      const errorBody = await response.json()
      console.error('Guest token error:', errorBody)
      throw new Error('Failed to create guest token')
    }

    const data = await response.json()
    //console.log('Guest token obtenido:', data.token)
    return data.token
  } catch (error) {
    console.error('Create guest token error:', error)
    throw error
  }
}
