import { useState, FormEvent } from 'react'
import Cookies from 'js-cookie'
import { useAuth } from '@/contex/AuthContext'
import { loginService } from '@/services/authService'
import { Button, Input, Label } from '@/components/ui'

interface LoginFormProps {
  handleUserChange: (user: string) => void
  user: string
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
    <div>
      <form className='bg-white min-w-72 p-8 shadow-md rounded-md' onSubmit={handleSubmit}>
        <h2 className='text-2xl font-semibold mb-6'>Login</h2>
        {loginError && <div className='mb-4 text-red-500'>{loginError}</div>}
        <div className='mb-4'>
          <Label htmlFor='username'>User Name</Label>
          <Input
            type='text'
            id='username'
            placeholder='username'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className='mb-4'>
          <Label htmlFor='password'>Password</Label>
          <Input
            type='password'
            id='password'
            placeholder='*********'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <Button wfull type='submit' color='blue'>
          Log In
        </Button>
      </form>
    </div>
  )
}

export default LoginForm
