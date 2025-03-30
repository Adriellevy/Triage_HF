export async function getUUIdDashboard(yourAuthToken) {
  const url = 'http://localhost:8088/api/v1/dashboard/1/embedded'

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Accept-Encoding': 'gzip, deflate, br, zstd',
      'Accept-Language': 'es-419,es;q=0.9',
      Connection: 'keep-alive',
      Origin: 'http://localhost:8088',
      Referer:
        'http://localhost:8088/superset/dashboard/1/?native_filters_key=NENK4RebqLJ2yjiXGljp2ttEJYYxQa8R8NJdjyiyJ0STgEo6ewY6zXByoai-ZXUn',
      'Sec-CH-UA': '"Not A(Brand";v="8", "Chromium";v="132", "Opera GX";v="117"',
      'Sec-CH-UA-Mobile': '?0',
      'Sec-CH-UA-Platform': '"Windows"',
      'Sec-Fetch-Dest': 'empty',
      'Sec-Fetch-Mode': 'same-origin',
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

export interface LoginResponse {
  success: boolean
  redirectUrl?: string
  error?: string
}

export const loginServiceObtencionDatos = async (
  username: string,
  password: string
): Promise<LoginResponse> => {
  try {
    const response = await fetch('http://localhost:8088/login/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
        'Accept-Encoding': 'gzip, deflate, br, zstd',
        'Accept-Language': 'es-419,es;q=0.9',
        'Cache-Control': 'max-age=0',
        Connection: 'keep-alive',
        Origin: 'http://localhost:8088',
        Referer: 'http://localhost:8088/login/',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'same-origin',
        'Sec-Fetch-User': '?1',
        'Upgrade-Insecure-Requests': '1',
        'sec-ch-ua': '"Not A(Brand";v="8", "Chromium";v="132", "Opera GX";v="117"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"'
      },
      credentials: 'include', // Permite manejar cookies de sesión
      body: new URLSearchParams({
        username,
        password
      }).toString()
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
