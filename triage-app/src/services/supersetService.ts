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
