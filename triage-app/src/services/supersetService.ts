import { json } from "stream/consumers"

export async function getUUIdDashboard(yourAuthToken) {
  const url = 'http://localhost:8088/api/v1/dashboard/1/embedded'

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Connection: 'keep-alive',
      Origin: 'http://localhost:8088',
      Referer:
        'http://localhost:8088/superset/dashboard/1/?native_filters_key=NENK4RebqLJ2yjiXGljp2ttEJYYxQa8R8NJdjyiyJ0STgEo6ewY6zXByoai-ZXUn',
      Cookie: 'session=.' + yourAuthToken,
      'x-csrftoken': '' // Add CSRF token header
    },
    credentials: 'include', // Para enviar cookies y autenticación
    body: JSON.stringify({ allowed_domains: ['http://localhost:5173'] })
  })

  const data = await response.json()
  console.log('Response from API:', data) // Log de la respuesta de la API
  return data.result.uuid
}



export const loginServiceObtencionDatos = async (
  username: string,
  password: string
) => {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Accept", "application/json");
  myHeaders.append("Origin", 'http://localhost:5173',)
  
  const raw = JSON.stringify({
    "password": password,
    "provider": "db",
    "refresh": true,
    "username": username
  });

  try {
    const response = await fetch("http://localhost:8088/api/v1/security/login", {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    })

    if (response.status === 302) {
      return { success: true, redirectUrl: response.url }
    }

    const textResponse = await response.text()
    return { success: false, error: textResponse }
  } catch (error) {
    return { success: false, error: 'Error en la conexión con el servidor' }
  }
}
