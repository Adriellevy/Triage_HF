import React from 'react'
import { Button } from '../../components/ui'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom' // Importamos la función navigate para la redirección

function Settings() {
  const { t } = useTranslation('Sidebar')

  const navigate = useNavigate()
  const handleBoxSettingsClick = () => {
    // Redirigimos a la página de configuración de la caja
    navigate('/settings/box')
  }

  const handleUsersSettingsClick = () => {
    // Redirigimos a la página de configuración de usuarios
    navigate('/settings/user')
  }

  return (
    <div className='h-screen p-4 list-item'>
      <div className='p-2'>
        <Button wfull color='green' onClick={handleBoxSettingsClick}>
          {t('BoxSettings')}
        </Button>
      </div>
      <div className='p-2' onClick={handleUsersSettingsClick}>
        <Button wfull color='green'>
          {t('UsersSettings')}
        </Button>
      </div>
    </div>
  )
}

export default Settings
