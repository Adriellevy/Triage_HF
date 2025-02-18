import { Button } from '@/components/ui'

interface ConfirmationModalProps {
  message: string
  onConfirm: () => void
  onCancel: () => void
}

const ConfirmationModal = ({ message, onConfirm, onCancel }: ConfirmationModalProps) => {
  return (
    <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-35'>
      <div className='bg-white p-6 rounded-lg shadow-lg text-center w-80'>
        <p className='text-lg font-medium'>{message}</p>
        <div className='flex justify-center mt-4 gap-3'>
          <Button color='red' onClick={onConfirm}>
            Confirmar
          </Button>
          <Button color='grey' onClick={onCancel}>
            Cancelar
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmationModal
