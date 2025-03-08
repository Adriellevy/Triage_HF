import { useState, useEffect } from 'react'
import { embedDashboard } from "@superset-ui/embedded-sdk";

async function supersetLogin() {
  // Mover a un archivo de configuracion
  const LOGIN_URL = 'http://127.0.0.1:8088/api/v1/security/login'

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

async function createGuestToken() {
  try {
    // Login y obtención del access token
    const loginData = await supersetLogin();
    if (!loginData || !loginData.accessToken) {
      console.error('Error: No se obtuvo accessToken de supersetLogin');
      throw new Error('Missing accessToken');
    }
    const { accessToken } = loginData;
    console.log('Access Token obtenido:', accessToken);

    // Obtener CSRF token
    const csrfToken = await getCsrfToken(accessToken);
    if (!csrfToken) {
      console.error('Error: No se obtuvo csrfToken de getCsrfToken');
      throw new Error('Missing csrfToken');
    }
    console.log('CSRF Token obtenido:', csrfToken);

    // Validación extra del dashboard id
    const dashboardId = '4aa22d8e-96e4-4513-baf5-bc9b6af1c4cc';
    if (!dashboardId) {
      console.error('Error: Dashboard ID no está definido');
      throw new Error('Missing dashboard ID');
    }

    // Preparar el payload para la solicitud del guest token
    const payload = {
      user: {
        username: 'guest',
        first_name: 'Guest',
        last_name: 'User'
      },
      resources: [{
        type: "dashboard",
        id: "3a30fc6c-48a4-4fea-ab5d-da010d45483f"  // Your dashboard ID
      }],
      rls: [],
      roles: ['Gamma', 'Public']
    };

    console.log('Payload para guest token:', payload);

    // Definir la URL para la solicitud del guest token
    const GUEST_TOKEN_URL = 'http://127.0.0.1:8088/api/v1/security/guest_token/';

    // Realizar la solicitud
    const response = await fetch(GUEST_TOKEN_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken,
        Referer: GUEST_TOKEN_URL
      },
      body: JSON.stringify(payload)
    });

    // Validar la respuesta
    if (!response.ok) {
      const errorBody = await response.json();
      console.error('Guest token error:', errorBody);
      throw new Error('Failed to create guest token');
    }

    const data = await response.json();
    console.log('Guest token obtenido:', data.token);
    return data.token;
  } catch (error) {
    console.error('Create guest token error:', error);
    throw error;
  }
}

function Dashboard() {
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
          id: "3a30fc6c-48a4-4fea-ab5d-da010d45483f",
          supersetDomain: "http://localhost:8088",
          mountPoint: document.getElementById("my-superset-container"),
          fetchGuestToken: fetchGuestTokenFunc,
          dashboardUiConfig: {
            hideTitle: true,
            filters: {
              expanded: false,
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
    if (!isTokenReady) return; // Evita que el efecto se ejecute si el token aún no está listo
  
    const container = document.getElementById('my-superset-container');
  
    if (container) {
      const iframe = container.children[0]; // Asegura que el iframe ya está presente
      if (iframe) {
        iframe.style.width = '1000px';
        iframe.style.height = '1000px';
      }
    }
  }, [isTokenReady]); // Se ejecuta solo cuando isTokenReady cambia a true
  
  // Conditional rendering to show loading state
  if (!isTokenReady) {
    return (
      <div>
        <h1>Loading Dashboard...</h1>
        <div id='my-superset-container'></div>
      </div>
    );
  }
  
  return (
    <div>
      <h1>My Superset Dashboard</h1>
      <div id='my-superset-container'></div>
    </div>
  );
}
//<!--<iframe src="http://localhost:8088/superset/dashboard/p/Zo9k2QE2RXn/" frameborder="0" height="1000px" width="100%"></iframe>
export default Dashboard
