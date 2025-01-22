/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { SetStateAction, useEffect, useState } from 'react'
import Select from 'react-select'
import { Button } from './ui'
import { executeShiftChange, getFilteredPatients, } from '@/services/patientService'
import { Patient } from '@/interfaces/Patinet'
import PatientsListTurnExchange from './PatientList/PatientListShiftExchange'
import { Checkbox } from '@mui/material'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store/store'
import { toast } from 'sonner'

const ShiftExchangeModal = ({ onClose }) => {
  const [doctorOptions, setDoctorOptions] = useState<ColourOption[]>([])
  const [nurseOptions, setNurseOptions] = useState<ColourOption[]>([])
  const [patients, setPatients] = useState<Patient[]>([])
  const [createReport, setCreateReport] = useState(false)

  const selectedDoctors = useSelector((state: RootState) => state.shiftSelections.doctorSelections)
  const selectedNurses = useSelector((state: RootState) => state.shiftSelections.nurseSelections)

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setPatients([])
        const patients = await getFilteredPatients([false, ['TODOS MENOS ALTA']])
        console.log(patients)
        setPatients(patients)
      } catch (error) {
        console.error('Error fetching patients:', error)
      }
    }

    fetchPatients()
  }, [])

  const handleShiftExchange = async () => {
    // Mapeo de Doctores
    const mappedDoctors = Object.keys(selectedDoctors).map((patientID) => {
      const doctor = selectedDoctors[patientID]
      const lastDoctorValue = doctor?.previousValue // Último doctor del estado

      return {
        patientID,
        role: 'doctor',
        lastDoctorID: lastDoctorValue,
        newDoctorID: doctor.newValue
      }
    })

    // Mapeo de Enfermeros
    const mappedNurses = Object.keys(selectedNurses).map((patientID) => {
      const nurse = selectedNurses[patientID]
      const lastNurseValue = nurse?.previousValue // Último enfermero del estado

      return {
        patientID,
        role: 'nurse',
        lastNurseID: lastNurseValue,
        newNurseID: nurse.newValue
      }
    })

    const patients = [...mappedDoctors, ...mappedNurses]
    console.log('Patients:', patients, 'Create Report?:', createReport)

    try {
      const shiftExchange = await executeShiftChange(patients, createReport)
      console.log('Shift Exchange Result:', shiftExchange)
      onClose()
      toast.success('Cambio de turno exitoso!', { duration: 2000 })
    } catch (error) {
      toast.error('Hubo un error en el cambio de turno', { duration: 2000 })
      console.error('Error executing shift exchange:', error)
    }
  }


  return (
    <div className='fixed top-0  left-0 h-full w-full flex items-start justify-center bg-black bg-opacity-35 z-50 '>
      <div className=' flex  flex-col bg-blue-900 rounded-lg mt-10 ml-56  max-w-2xl md:max-w-screen-2xl w-full z-60'>
        <div className='flex mx-2 my-4 justify-between'>
          <h3 className='text-2xl font-bold mx-2 my-2 mr-20'>Cambio de turno</h3>
          <Button color='grey' onClick={onClose} className='text-sm py-0 px-2 font-bold '>
            Cancelar
          </Button>
        </div>
        
        <div className='bg-white w-full rounded-lg p-4'>
        <div className='text-black flex justify-center'>
              <PatientsListTurnExchange
                patients={patients}
                mode={'doctor'}
                lastDoctor={'yo'}
              />
          </div>
          {/* BUTTON */}
          <div className='flex justify-end mt-4'>
            <label className='text-black self-center '>Generar informe</label>
            <Checkbox
              name='Generar informe'
              color='success'
              checked={createReport}
              onChange={() => setCreateReport(!createReport)}
            />
            <Button
              color='green'
              onClick={async () => {
                await handleShiftExchange()
              }}
              className='text-lg py-2 px-2 font-bold '
            >
              Cambio de turno
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ShiftExchangeModal
