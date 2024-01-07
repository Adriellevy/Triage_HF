interface AuthResponse {
  success: boolean
  error?: string
}

// TODO email api
export const loginservice = async (email: string, password: string): Promise<AuthResponse> => {
  const url = `${import.meta.env.VITE_API_URL}/auth/login`

  const data = {
    user_name: email,
    user_password: password
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })

    if (response.ok) {
      const responseData = await response.json()
      console.log(responseData)
      // TODO TOKEN
      return { success: true }
    } else {
      return { success: false, error: 'Usuario o contraseña incorrectos' }
    }
  } catch (error) {
    console.error('Error durante el inicio de sesión:', error)
    return { success: false, error: 'Error durante el inicio de sesión' }
  }
}
