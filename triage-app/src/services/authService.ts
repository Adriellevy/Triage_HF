interface AuthResponse {
  serverRes?: string
  success: boolean
  error?: string
}

export const loginService = async (email: string, password: string): Promise<AuthResponse> => {
  const url = `${import.meta.env.VITE_API_URL}/auth/login`
  const data = {
    user_name: email,
    user_password: password
  }
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Incluir esta línea para enviar cookies al servidor
        credentials: 'include'
      },
      body: JSON.stringify(data)
    })
    if (response.ok) {
      const responseData = await response.json()
      const { token } = responseData
      return { success: true, serverRes: token }
    } else {
      // Elimina el token almacenado en caso de error
      //document.cookie = 'authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; samesite=strict; secure; path=/; HttpOnly';
      return { success: false, error: 'Usuario o contraseña incorrectos' }
    }
  } catch (error) {
    console.error('Error durante el inicio de sesión:', error)
    // Elimina el token almacenado en caso de error
    document.cookie =
      'authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; samesite=strict; secure; path=/; HttpOnly'
    return { success: false, error: 'Error durante el inicio de sesión' }
  }
}

export const verifyToken = async (token: string): Promise<AuthResponse> => {
  const url = `${import.meta.env.VITE_API_URL}/auth/renewToken`

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        credentials: 'include' // Enviar cookies al servidor
      }
    })

    if (response.ok) {
      const responseData = await response.json()
      // Retorna el nuevo token al llamador
      return { success: true, serverRes: responseData }
    } else {
      return { success: false, error: response }
    }
  } catch (error) {
    console.error('Error al intentar renovar el token:', error)

    // Elimina el token almacenado en caso de error
    document.cookie =
      'authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; samesite=strict; secure; path=/; HttpOnly'

    return { success: false, error: 'Error al intentar renovar el token' }
  }
}
