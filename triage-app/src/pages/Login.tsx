import Loginform from '@/components/LoginForm'

interface LoginProps {
  handleUserChange: (newUser: string) => void
  user: string
}

export default function Login({ handleUserChange, user }: LoginProps) {
  return (
    <div className='bg-gray-100'>
      <Loginform handleUserChange={handleUserChange} user={user} />
    </div>
  )
}
