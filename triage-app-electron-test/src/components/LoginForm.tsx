import { useState, FormEvent } from 'react'
import { useAuth } from '../contex/AuthContext'
import { loginservice } from '../services/authService'

function Loginform() {
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [loginError, setLoginError] = useState<string | null>(null)
  const { login } = useAuth()

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const authResponse = await loginservice(email, password)
    if (authResponse.success) {
      login()
    }
    if (!authResponse.success) {
      setLoginError(authResponse.error || 'Error durante el inicio de sesión')
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

export default Loginform
