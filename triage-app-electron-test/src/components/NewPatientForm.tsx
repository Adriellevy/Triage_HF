import { useState } from 'react'

function NewPatientForm() {
  const [Name, setName] = useState('')
  const [DateOfBirth, setDateOfBirth] = useState('')
  const [Reason, setReason] = useState('')
  const [Medic, setMedic] = useState('')
  const [Nurse, setNurse] = useState('')
  const [Box, setBox] = useState('')
  const [Triage, setTriage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
  }
  return (
    <div className='min-h-full flex items-center justify-center mt-5'>
      <form
        className='bg-white p-8 shadow-md rounded-md grid grid-cols-3 gap-4 w-full max-w-screen-lg'
        onSubmit={handleSubmit}
      >
        <div className='col-span-1'>
          <label
            htmlFor='Name'
            className='block text-gray-700 text-sm font-bold mb-2'
          >
            Name
          </label>
          <input
            type='text'
            id='Name'
            className='w-full p-2 border rounded-md'
            placeholder='Name'
            value={Name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <label
            htmlFor='dateofbirth'
            className='block text-gray-700 text-sm font-bold mb-2 mt-4'
          >
            date of birth
          </label>
          <input
            type='text'
            id='dateofbirth'
            className='w-full p-2 border rounded-md'
            placeholder='date of birth'
            value={DateOfBirth}
            onChange={(e) => setDateOfBirth(e.target.value)}
            required
          />
        </div>
        <div className='col-span-1'>
          <label
            htmlFor='reason'
            className='block text-gray-700 text-sm font-bold mb-2'
          >
            Reason
          </label>
          <input
            type='text'
            id='reason'
            className='w-full p-2 border rounded-md'
            placeholder='Reason'
            value={Reason}
            onChange={(e) => setReason(e.target.value)}
            required
          />
          <label
            htmlFor='Medic'
            className='block text-gray-700 text-sm font-bold mb-2 mt-4'
          >
            Medicación Habitual
          </label>
          <input
            type='text'
            id='Medic'
            className='w-full p-2 border rounded-md'
            placeholder='Medicación Habitual'
            value={Medic}
            onChange={(e) => setMedic(e.target.value)}
            required
          />
        </div>

        <div className='col-span-1'>
          <label
            htmlFor='reason'
            className='block text-gray-700 text-sm font-bold mb-2'
          >
            Reason
          </label>
          <input
            type='text'
            id='reason'
            className='w-full p-2 border rounded-md'
            placeholder='Reason'
            value={Reason}
            onChange={(e) => setReason(e.target.value)}
            required
          />
          <label
            htmlFor='medhab'
            className='block text-gray-700 text-sm font-bold mb-2 mt-4'
          >
            Medicación Habitual
          </label>
          <input
            type='text'
            id='medhab'
            className='w-full p-2 border rounded-md'
            placeholder='Medicación Habitual'
            value={Medic}
            onChange={(e) => setMedic(e.target.value)}
            required
          />
        </div>

        <button
          type='submit'
          className='col-span-2 bg-blue-500 text-white p-2 rounded-md mt-4'
        >
          Agregar Paciente
        </button>
      </form>
    </div>
  )
}

export default NewPatientForm
