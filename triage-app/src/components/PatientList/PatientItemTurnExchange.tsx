import { useState, useEffect } from 'react'
import { Patient, PatientStatus } from '../../interfaces/Patinet'
import { updatePatient } from '@/services/patientService'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons'
import { Button } from '@/components/ui'
import  Select  from 'react-select'
import { getAllDoctors, getAllNurses } from '@/services/userService'

interface PropsPatientItem {
  patient: Patient
  setNewDoctor: (_id: number) => void
  setNewNurse: (_id: number) => void
  index: number
  mode: string
}

function PatientItemTurnExchange({ patient, index, mode, setNewDoctor, setNewNurse }: PropsPatientItem) {
    const [doctorOptions, setDoctorOptions] = useState([])
    const [nurseOptions, setNurseOptions] = useState([])
    
    const {
        patient_id,
        patient_name,
        patient_triage_level,
        patient_status,
        doctor_name,
        nurse_name
    } = patient

  const isOdd = index % 2 !== 0

  const bgClass = isOdd ? 'bg-white' : 'bg-gray-100'

  const TriageLevels = [
    { _id: 1, name: 'I', color: '153, 153, 153' },
    { _id: 2, name: 'II', color: '255,51,0' },
    { _id: 3, name: 'III', color: '255,255,102' },
    { _id: 4, name: 'IV', color: '105,168,79' }
  ]

  const getBackgroundColor = (id: number) => {
    const triageLevel = TriageLevels.find((level) => level._id === id)
    return triageLevel ? `rgb(${triageLevel.color}, 0.6)` : 'transparent'
  }


  const [patientToDischarge, setPatientToDischarge] = useState<Patient | null>(null)
  const handleFastDischarge = (id: string) => {
    console.log('fast Discharge in process ' + id)
    setPatientToDischarge(patient)
  }

  const handleSelection = (selectedOption: unknown | null) => {
    if (selectedOption) {
      if (mode === 'doctor') {
        setNewDoctor(selectedOption.value);
      } else if (mode === 'nurse') {
        setNewNurse(selectedOption.value);
      }
    }
  };
  

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const doctors = await getAllDoctors();
        const nurses = await getAllNurses();
        const formattedDoctors = doctors.map(doctor => ({
          value: doctor.user_id,  
          label: doctor.user_name  
        }));
  
        const formattedNurses = nurses.map(nurse => ({
          value: nurse.user_id,    
          label: nurse.user_name  
        }));
  
        setDoctorOptions(formattedDoctors);
        setNurseOptions(formattedNurses);
      } catch (error) {
        console.error("Error fetching doctors or nurses", error);
      }
    };
  
    fetchOptions();
  }, []);


  const handleConfirmFastDischarge = () => {
    console.log('alta confirmada')
    setPatientToDischarge(null)
    if (patient) {
      patient.patient_status = PatientStatus.DISCHARGED
      updatePatient(patient.patient_id, patient)
    } else {
      console.log('Error en dar de ALTA al paciente')
    }
  }
  return (
    <tr className={bgClass}>
          <td className={`border text-sm overflow-hidden text-center `}>{patient_name}</td>
          <td
            className={`border md:p-2 text-center`}
            style={{ backgroundColor: getBackgroundColor(Number(patient_triage_level)) }}
          >
            {patient_triage_level}
          </td>
          {mode === 'doctor' ? (
            <>
                <td className="border p-2 table-cell text-center">{doctor_name}</td>
                <td className="border p-4 table-cell text-center">
                <Select
                    className="w-full text-black"
                    options={doctorOptions}
                    placeholder="Selec. doctor/a"
                    closeMenuOnSelect={true}
                    onChange={(selectedOption) => handleSelection(selectedOption)}
                />
                </td>
            </>
            ) : (
            <>
                <td className="border p-2 table-cell text-center">{nurse_name}</td>
                <td className="border p-4 table-cell text-center">
                <Select
                    className="w-full text-black"
                    options={nurseOptions}
                    placeholder="Selec. enfermero/a"
                    closeMenuOnSelect={true}
                    onChange={(selectedOption) => handleSelection(selectedOption)}
                />
                </td>
            </>
            )}

          <td className='border text-sm  text-center'>{patient_status}</td>
          <td className='border p-2'>
            <div className='flex gap-2'>
              {(patient_status !== 'ALTA' ? (
                <Button wfull color='red' onClick={() => handleFastDischarge(patient_id)}>
                  <FontAwesomeIcon icon={faRightFromBracket} />
                </Button>
              ) : (
                <Button wfull color='grey_disabled' disabled>
                  <FontAwesomeIcon icon={faRightFromBracket} />
                </Button>
              ))}
            </div>
            {patientToDischarge?.patient_id === patient_id && (
              <div className='fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-35'>
                <div className='bg-white p-8 rounded-lg'>
                  <div className='text-center'>
                    Confirmar alta de paciente <strong>{patientToDischarge.patient_name}</strong>?
                  </div>
                  {/* Botones de confirmación */}
                  <div className='flex justify-center mt-4 gap-2'>
                    <Button color='red' onClick={handleConfirmFastDischarge}>
                      Confirmar
                    </Button>
                    <Button color='grey' onClick={() => setPatientToDischarge(null)}>
                      Cancelar
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </td>
    </tr>
  );
  
}

export default PatientItemTurnExchange
