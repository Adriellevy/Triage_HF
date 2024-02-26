import { useState } from 'react'
import { Button } from './ui'
import LoaderSpin from './LoaderSpin'
import { consulta } from '@/services/openai-test'
import { PatientData, PatientStatus } from '@/interfaces/Patinet'

interface PropsPatientInformIA {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Patient: PatientData | null
}
const solicitud =
  'Toma el rol de un médico cardiólogo que escribe de forma resumida las evoluciones de sus pacientes. Crea un resumen de 5 líneas en primera persona del singular. Muy resumido. Únicamente puntos importantes:  Paciente masculino 47 años Trabaja en comercio  Antec: IAM con SDST 2021. PTCA a ADA prox con un DES. FE 40%. Hipertensión arterial, Hipotiroidismo, Insulinoresistencia, Alergias: -, Tabaco: -  AAFF: Hermano IAM reciente  Medicamentos: AAS 100x1, Clop 75x1, Atorvastatina 20x4, Eutirox 75, bisoprolol 2.5x1, espironolactona 12.5x1, Metformina XR 750x1, Clotiazepam 5x1, Ezetimibe 10x1, Setralina 50x1,Hospitalizacion reciente por COVID Desde el alta con dolor torácico, constanteAl examen: EVA 0/10 PA 100/60 FC 80  Yug planas, sin soplos carotideos  RR2TSS  MP+SRA  Abd: BDI, no palpo masas ni visceromegalias, Ao impresiona de tamaño normal  Piel tibia a distal sin edema, pulsos simétricosPlan: Suspender clopidogrel Eco y test esfuerzo Control con resultado. Ahora cambia lo que creas necesario por la informacion de este paciente:'

function PatientInformIA({ Patient }: PropsPatientInformIA) {
  const [loadingInform, setLoadingInform] = useState<boolean>(false)
  const [Inform, setInform] = useState<string>('')

  const isPatientStatusAlta = Patient?.patient_status === PatientStatus.DISCHARGED

  const handleRequestButtonClick = () => {
    setLoadingInform(true)
    const patientProvisional = { ...Patient }
    if (patientProvisional) {
      patientProvisional.doctor_name = ''
      patientProvisional.patient_name = ''
      patientProvisional.box_id = ''
    }
    const prompt = solicitud + patientProvisional
    handleRequestOpenAi(prompt)
  }

  const handleRequestOpenAi = async (prompt: string) => {
    const result = await consulta(prompt)
    setLoadingInform(false)
    const requestInfo = result && result.message && result.message.content
    if (requestInfo) {
      setInform(requestInfo)
    } else {
      console.error('Element with class "text-gray-700" not found')
    }
  }

  return (
    <div className='mt-8'>
      <div className='flex justify-between items-center mt-4 mb-4'>
        <h2 className={`text-xl  font-bold mt-4 mb-4`}>Patinet Inform:</h2>
        <div className=''>
          <Button color='blue' onClick={handleRequestButtonClick} disabled={!isPatientStatusAlta}>
            Generate with IA
          </Button>
        </div>
      </div>

      {loadingInform ? (
        <div className='flex justify-center items-center'>
          <LoaderSpin />
        </div>
      ) : (
        <>
          <textarea
            value={Inform}
            onChange={(e) => setInform(e.target.value)}
            disabled={!isPatientStatusAlta}
            placeholder='Escribe algo...'
            className='w-full h-32 resize-y border rounded p-2 focus:outline-none focus:ring focus:border-blue-300'
          />
          <div className='flex justify-end mt-4'>
            <Button color='green' disabled={!isPatientStatusAlta}>
              Save Inform
            </Button>
          </div>
        </>
      )}
    </div>
  )
}

export default PatientInformIA
