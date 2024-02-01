import { useState, FormEvent } from 'react'
import { useAuth } from '../contex/AuthContext'
import { loginService } from '../services/authService'
import Cookies from 'js-cookie'

interface LoginFormProps {
  handleUserChange: (user: string) => void // Replace UserType with the actual type of your user object
  user: string // Replace UserType with the actual type of your user object
}

function LoginForm({ handleUserChange, user }: LoginFormProps) {
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [loginError, setLoginError] = useState<string | null>(null)
  const { login } = useAuth()

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    try {
      const authResponse = await loginService(email, password)
      if (authResponse.success) {
        if (authResponse.serverRes) {
          Cookies.set('authToken', authResponse.serverRes)
          handleUserChange(authResponse.serverRes)
          setEmail('')
          setPassword('')
          login(user)
        } else {
          // Handle the case where serverRes is undefined
          console.error('Authentication response does not contain a valid token.')
        }
      }
      if (!authResponse.success) {
        setLoginError(authResponse.error || 'Error durante el inicio de sesión')
      }
    } catch (e) {
      console.log('algo se rompio en LoginForm: ' + e)
    }
  }

  return (
    <div className='min-h-screen flex items-center justify-center'>
      <form className='bg-white p-8 shadow-md rounded-md' onSubmit={handleSubmit}>
        <h2 className='text-2xl font-semibold mb-6'>Login</h2>
        {loginError && <div className='mb-4 text-red-500'>{loginError}</div>}
        <div className='mb-4'>
          <label htmlFor='email' className='block text-gray-700 text-sm font-bold mb-2'>
            User Name
          </label>
          <input
            type='text'
            id='username'
            className='w-full p-2 border rounded-md'
            placeholder='username'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className='mb-4'>
          <label htmlFor='password' className='block text-gray-700 text-sm font-bold mb-2'>
            Password
          </label>
          <input
            type='password'
            id='password'
            className='w-full p-2 border rounded-md'
            placeholder='Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type='submit' className='w-full bg-blue-500 text-white p-2 rounded-md'>
          Log In
        </button>
      </form>
    </div>
  )
}

export default LoginForm
