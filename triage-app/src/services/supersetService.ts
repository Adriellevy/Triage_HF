import { config } from '../config/env'
export const getDashboardId = async (dashboardSlug) => {
  const response = await fetch(`http://${config.SUPERSET_DOMAIN}/api/v1/dashboard/`)
  const data = await response.json()

  const dashboard = data.result.find((d) => d.slug === dashboardSlug)

  return dashboard ? dashboard.id : null
}

// export const getAllDashboardsIds = async (yourAccessToken) => {
//   console.log('Fetching dashboards with token:', yourAccessToken) // Log del token de acceso

//   const response = await fetch(`http://127.0.0.1:8088/api/v1/dashboard/`, {
//     method: 'GET',
//     headers: {
//       Authorization: `Bearer ${yourAccessToken}`, // Reemplaza con tu token
//       'Content-Type': 'application/json'
//     }
//   })

//   const data = await response.json()
//   console.log('Response from API:', data) // Log de la respuesta de la API

//   return data
// }

export const getAllDashboardsIds = async (yourAccessToken, crfsToken) => {
  const query = {
    select_columns: ['id']
  }

  const response = await fetch(
    `http://127.0.0.1:8088/api/v1/dashboard/?q=${encodeURIComponent(JSON.stringify(query))}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${yourAccessToken}`, // Reemplaza con tu token
        'Content-Type': 'application/json',
        Cookie: `session=.${crfsToken}` // Reemplaza con tu session id
      }
    }
  )

  const data = await response.json()
  console.log('Response from API:', data) // Log de la respuesta de la API
  return data.result.map((dashboard) => dashboard.id)
}
