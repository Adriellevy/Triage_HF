import { Box, BoxStatus } from '@/interfaces/Boxes'
import { Button } from '../ui'
import { Link } from 'react-router-dom'
import Counter from '../Counter'
import { useTranslation } from 'react-i18next'

interface PropsBoxItem {
  box: Box
  index: number
}

function BoxItem({ box, index }: PropsBoxItem) {
  const { t } = useTranslation('BoxItem')
  const { patient_id, patient_name, box_code, box_type, box_status, box_time } = box
  const isOdd = index % 2 !== 0
  const bgClass = isOdd ? 'bg-white' : 'bg-gray-100'

  return (
    <tr className={`${bgClass} text-sm lg:text-base`}>
    <td className="border p-2 font-semibold">{box_code}</td>
    <td className="border p-2 hidden lg:table-cell">{box_type}</td>
      <td className="border p-2">
        <div
          className={`rounded-md p-1 text-white text-xs lg:text-sm font-bold text-center ${
            box_status !== BoxStatus.OCUPADO ? 'bg-green-500 shadow-md' : 'bg-red-500 shadow-md'
          }`}
        >
          {t(`BoxStatus.${box_status}`)}
        </div>
      </td>

      {/* Nombre del Paciente (solo si el box está ocupado) */}
      <td className="border p-2">{box_status !== BoxStatus.OCUPADO ? '-' : patient_name}</td>

      {/* Tiempo del Box (solo visible en pantallas grandes) */}
      <td className="border p-2 hidden md:table-cell">
        {box_status !== BoxStatus.OCUPADO ? null : <Counter initialTime={box_time} />}
      </td>

      {/* Botón para ver al paciente */}
      <td className="border p-2 text-center">
        {box_status !== BoxStatus.OCUPADO ? null : (
          <Link to={`/patients/${patient_id}`}>
            <Button color="green" className="w-full md:w-auto text-xs md:text-sm">
              {t('PatientInfoButton')}
            </Button>
          </Link>
        )}
      </td>
    </tr>
  )
}

export default BoxItem
