import { Link } from 'react-router-dom'
import PatientForm from '@/components/PatientForm'

function GuidedEntry() {
  return (
    <div>
      <PatientForm />
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 justify-between my-14 max-w-6xl mx-auto'>
        <Link
          className='max-w-xs mx-auto bg-white hover:bg-slate-300 p-6 rounded-lg shadow-md text-center w-full'
          to='/patients'
        >
          <p className='text-4xl font-bold mb-2'>150</p>
          <p className='text-lg text-gray-600'>Pacientes Totales</p>
        </Link>

        <Link
          className='max-w-xs mx-auto bg-white hover:bg-slate-300 p-6 rounded-lg shadow-md text-center w-full'
          to='/ruta-pacientes-afuera'
        >
          <p className='text-4xl font-bold mb-2'>20</p>
          <p className='text-lg text-gray-600'>Pacientes Afuera</p>
        </Link>

        <Link
          className='max-w-xs mx-auto bg-white hover:bg-slate-300 p-6 rounded-lg shadow-md text-center w-full'
          to='/boxes'
        >
          <p className='text-4xl font-bold mb-2'>4 / 20</p>
          <p className='text-lg text-gray-600'>Boxes Disponibles</p>
        </Link>

        <Link
          className='max-w-xs mx-auto bg-white hover:bg-slate-300 p-6 rounded-lg shadow-md text-center w-full'
          to='/patients/?triage=2'
        >
          <p className='text-4xl font-bold mb-2'>6</p>
          <p className='text-lg text-gray-600'>Triage II</p>
        </Link>
      </div>
    </div>
  )
}

export default GuidedEntry
