import { useState, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginService } from '@/services/authService' // Servicio de verificación de contraseña
import { Button, Input, Label } from '@/components/ui'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/contex/AuthContext'
interface VerifyUserProps {
  username: string
  onSuccessRedirect: string
  onCancelRedirect: () => void // Cambiamos el tipo a una función
}

function VerifyUser({ username, onSuccessRedirect, onCancelRedirect }: VerifyUserProps) {
  const { t } = useTranslation('VerifyUser')
  const [password, setPassword] = useState<string>('')
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()
  const { setVerificationCookie } = useAuth()

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    try {
      const authResponse = await loginService(username, password)
      if (authResponse.success && authResponse.serverRes) {
        setVerificationCookie(authResponse.serverRes)
        console.log('Ruta: ', onSuccessRedirect)
        navigate(onSuccessRedirect)
      } else {
        setError(authResponse.error || t('error'))
      }
    } catch (e) {
      console.log('Error during verification: ', e)
      setError(t('error'))
    }
  }

  const handleCancel = () => {
    onCancelRedirect()
  }

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div className='bg-white p-8 shadow-md rounded-md relative'>
        <h2 className='text-2xl font-semibold mb-6'>{t('confirm_identity')}</h2>
        {error && <div className='mb-4 text-red-500'>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className='mb-4'>
            <Label htmlFor='password'>{t('user')}</Label>
            <Label className='pl-4'> {username ? username : 'Error Usuario'}</Label>
          </div>
          <div className='mb-4'>
            <Label htmlFor='password'>{t('password_label')}</Label>
            <Input
              type='password'
              id='password'
              placeholder='*********'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className='flex justify-between'>
            <Button type='button' color='red' onClick={handleCancel}>
              {t('cancel')}
            </Button>
            <Button type='submit' color='green'>
              {t('confirm')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default VerifyUser
