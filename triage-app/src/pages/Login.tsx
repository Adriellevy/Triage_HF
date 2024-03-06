import Loginform from '@/components/LoginForm'

interface LoginProps {
  handleUserChange: (newUser: string) => void
  user: string
}

export default function Login({ handleUserChange, user }: LoginProps) {
  return (
    <div className='bg-gradient-to-b from-blue-900 to-blue-600 h-screen flex items-center justify-center'>
      <Loginform handleUserChange={handleUserChange} user={user} />
    </div>
  )
}
