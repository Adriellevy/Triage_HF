/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { SetStateAction, useEffect, useState } from 'react'
import Select from 'react-select'
import { Button } from './ui'
import { executeShiftChange, getFilteredPatients } from '@/services/patientService'
import { Patient } from '@/interfaces/Patinet'
import PatientsListTurnExchange from './PatientList/PatientListShiftExchange'
import { Checkbox } from '@mui/material'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store/store'
import { toast } from 'sonner'
import { set } from 'lodash'

const ShiftExchangeModal = ({ onClose }) => {
  const [doctorOptions, setDoctorOptions] = useState<ColourOption[]>([])
  const [nurseOptions, setNurseOptions] = useState<ColourOption[]>([])
  const [patients, setPatients] = useState<Patient[]>([])
  const [createReport, setCreateReport] = useState(false)
  const [invalidPatients, setInvalidPatients] = useState<Patient[]>([])

  const selectedDoctors = useSelector((state: RootState) => state.shiftSelections.doctorSelections)
  const selectedNurses = useSelector((state: RootState) => state.shiftSelections.nurseSelections)
  const observations = useSelector((state: RootState) => state.shiftSelections.observations)
  const procedures = useSelector((state: RootState) => state.shiftSelections.procedures)
  const record = useSelector((state: RootState) => state.shiftSelections.record)

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
    const patientsMap = {}
    const invalidPatientsTemp = []

    // Mapeo de Doctores
    Object.keys(selectedDoctors).forEach((patientID) => {
      const doctor = selectedDoctors[patientID]
      if (!patientsMap[patientID]) {
        patientsMap[patientID] = { patientID }
      }
      patientsMap[patientID].role = 'doctor'
      patientsMap[patientID].newDoctorID = doctor?.newValue
      patientsMap[patientID].lastDoctorID = doctor?.previousValue
    })

    // Mapeo de Enfermeros
    Object.keys(selectedNurses).forEach((patientID) => {
      const nurse = selectedNurses[patientID]
      if (!patientsMap[patientID]) {
        patientsMap[patientID] = { patientID }
      }
      patientsMap[patientID].role = 'nurse'
      patientsMap[patientID].newNurseID = nurse?.newValue
      patientsMap[patientID].lastNurseID = nurse?.previousValue
    })

    // Mapeo de Observaciones
    Object.keys(observations).forEach((patientID) => {
      const observation = observations[patientID]
      if (!patientsMap[patientID]) {
        patientsMap[patientID] = { patientID }
      }
      patientsMap[patientID].observations = observation?.newValue
    })

    // Mapeo de Procedimientos
    Object.keys(procedures).forEach((patientID) => {
      const procedure = procedures[patientID]
      if (!patientsMap[patientID]) {
        patientsMap[patientID] = { patientID }
      }
      patientsMap[patientID].procedures = procedure?.newValue
    })

    // Mapeo de Registros
    Object.keys(record).forEach((patientID) => {
      const rec = record[patientID]
      if (!patientsMap[patientID]) {
        patientsMap[patientID] = { patientID }
      }
      patientsMap[patientID].records = rec?.newValue
    })

    // Crear el array final de pacientes
    const patients = Object.values(patientsMap)

    // Validación de pacientes inválidos (mismo doctor y enfermero)
    Object.keys(patientsMap).forEach((patientID) => {
      const patient = patientsMap[patientID]
      if (
        patient.newDoctorID === patient.lastDoctorID && // Mismo doctor
        patient.newNurseID === patient.lastNurseID // Mismo enfermero
      ) {
        invalidPatientsTemp.push(patientID)
      }
    })
    if (invalidPatientsTemp.length > 0) {
      setInvalidPatients(invalidPatientsTemp)
      console.log('invalidPatientsTemp:', invalidPatientsTemp)
      toast.error('Algunos pacientes no tienen cambios en doctor o enfermero', { duration: 2000 })
      return
    }

    console.log('Patients:', patients, 'Create Report?:', createReport)

    try {
      await executeShiftChange(patients, createReport)
      //console.log('Shift Exchange Result:', shiftExchange)
      onClose()
    } catch (error) {
      toast.error('Hubo un error en el cambio de turno', { duration: 2000 })
      console.error('Error executing shift exchange:', error)
    }
  }

  return (
    <div className='fixed top-0  left-0 h-full w-full flex items-start justify-center bg-black bg-opacity-35 z-50 '>
      <div className=' flex  flex-col bg-blue-900 rounded-lg mt-10 ml-14  max-w-2xl md:max-w-screen-2xl w-full z-60'>
        <div className='flex  my-4 justify-between'>
          <h3 className='text-2xl font-bold mx-2 my-2 mr-20'>Cambio de turno</h3>
          <Button color='grey' onClick={onClose} className='text-sm py-0 px-2 font-bold '>
            Cancelar
          </Button>
        </div>

        {/* <div>
          <h4>Registros:</h4>
          <ul>
            {Object.entries(record).map(([patientID, { previousValue, newValue }]) => (
              <li key={patientID}>
                Paciente {patientID}: {previousValue} → {newValue}
              </li>
            ))}
          </ul>
        </div> */}
        <div className='bg-white w-full rounded-lg p-4'>
          <div className='text-black flex justify-center'>
            <PatientsListTurnExchange
              patients={patients}
              mode={'doctor'}
              lastDoctor={'yo'}
              invalidPatients={invalidPatients}
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
