/* eslint-disable @typescript-eslint/no-unused-vars */
import { Patient } from '@/interfaces/Patinet'
import { toast } from 'sonner'
import { User } from '@/interfaces/User'
import { Box } from '@/interfaces/Boxes'
import { addNewPatient, updateAnyPatient } from '@/services/patientService'
import { getAllDoctors, getAllNurses } from '@/services/userService'
import { getAvailableBoxes, getAllBoxes } from '@/services/boxService'
import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import { Button, Input, Label, Select } from '@/components/ui'
import { DatePickerMUI } from '../DatePickerMUI'
import { Link, useParams } from 'react-router-dom'
import { getPatientById } from '@/services/patientService'
import dayjs from 'dayjs'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Checkbox } from '@mui/material'
import React from 'react'
import _ from 'lodash'
import { getAgeNumber } from '../../helpers/HelperFechas'

function PatientForm() {
  const [BoxesOptions, setBoxesOptions] = useState<Box[] | null>(null)
  const [BoxOcupiedByPatient, setBoxOcupiedByPatient] = useState<Box[] | null>(null)
  const [DoctorOptions, setDoctorOptions] = useState<User[] | null>(null)
  const [NurseOptions, setNurseOptions] = useState<User[] | null>(null)
  const [checked, setChecked] = React.useState(false)
  const { t } = useTranslation('PatientForm')

  const navigate = useNavigate()

  // Edit states
  const { edditingPatientID } = useParams()
  const [edditingPatient, setedditingPatient] = useState<Patient | null>(null)
  //-----------------------------------  SETEO FORMULARIOS ---------------------------------
  // Formulario estandar tiene como objetivo ser la plantilla
  const Forumario_estandar = {
    patient_name: '',
    patient_age: null,
    patient_entry_time: '',
    patient_exit_time: null,
    patient_triage_time: new Date(),
    patient_triage_level: '',
    patient_isolated: false,
    patient_status: 'AFUERA',
    patient_symptom: '',
    patient_healthcare_system: 'default',
    //patient_medication: '',
    doctor_id: '',
    nurse_id: '',
    box_id: null,
    nurse_coment: ''
  }
  // Formulario interfaz tiene como objetivo guardar los valores de los elementos selecionados y no los id
  // ya que los valores no se mandan a la base de datos
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [formInterfaz, setformInterfaz] = useState<any>(Forumario_estandar)

  // Formulario Data tiene como objetivo guardar los id's de los elementos selecionados y no los valores
  // ya que los id's son los que se mandan a la base de datos
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [formData, setFormData] = useState<any>(Forumario_estandar)
  //-----------------------------------  USE EFFECTS ---------------------------------
  // Function to fetch patient data by ID
  const fetchPatientById = async (id: string) => {
    try {
      const data = await getPatientById(id)
      console.log('getting patient', data)
      setedditingPatient(data)
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error al obtener pacientes:', error.message)
      } else {
        console.error('Error desconocido al obtener pacientes:', error)
      }
    }
  }

  // Function to fetch all options (doctors, nurses, boxes)
  const fetchAllOptions = async () => {
    try {
      const [docs, nurses, boxes, allBoxes] = await Promise.all([
        getAllDoctors(),
        getAllNurses(),
        getAvailableBoxes(),
        getAllBoxes()
      ])
      setDoctorOptions(docs)
      setNurseOptions(nurses)
      setBoxesOptions(boxes)

      return { docs, nurses, allBoxes }
    } catch (error) {
      console.error('Error al obtener opciones:', error)
      return { docs: [], nurses: [], allBoxes: [] }
    }
  }

  // Function to set form data based on patient data and fetched options
  const setFormDataFromPatient = (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    patient: any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    options: { docs: any[]; nurses: any[]; allBoxes: any[] }
  ) => {
    const { docs, nurses, allBoxes } = options

    const box = allBoxes.find((box) => patient?.box_code.includes(box.box_code))
    if (box) setBoxOcupiedByPatient([box])

    const doctor = docs.find((doctor) => doctor.user_name === patient?.doctor_name)
    const nurse = nurses.find((nurse) => nurse.user_name === patient?.nurse_name)

    const updatedFormInterfaz = {
      ...formInterfaz,
      doctor_id: doctor ? doctor.user_name : '',
      nurse_id: nurse ? nurse.user_name : '',
      box_id: box ? box.box_id : '',
      patient_name: patient.patient_name || '',
      patient_age: String(patient.patient_age).slice(0, 10) || '',
      patient_entry_time: patient.patient_entry_time || '',
      patient_exit_time: patient.patient_exit_time || null,
      patient_triage_time: patient.patient_triage_time || '',
      patient_triage_level: patient.patient_triage_level || '',
      patient_isolated: Boolean(patient.patient_isolated),
      patient_status: patient.patient_status || '',
      patient_healthcare_system: patient.patient_healthcare_system || '',
      patient_symptom: patient.patient_symptom || '',
      nurse_coment: patient.nurse_coment || ''
    }

    setformInterfaz(updatedFormInterfaz)

    const updatedFormData = {
      ...formData,
      doctor_id: doctor ? doctor.user_id : '',
      nurse_id: nurse ? nurse.user_id : '',
      box_id: box ? box.box_id : '',
      patient_name: patient.patient_name || '',
      patient_age: patient.patient_age || '',
      patient_entry_time: patient.patient_entry_time || '',
      patient_exit_time: patient.patient_exit_time || null,
      patient_triage_time: patient.patient_triage_time || '',
      patient_triage_level: patient.patient_triage_level || '',
      patient_isolated: Boolean(patient.patient_isolated),
      patient_status: patient.patient_status || '',
      patient_healthcare_system: patient.patient_healthcare_system || '',
      patient_symptom: patient.patient_symptom || '',
      nurse_coment: patient.nurse_coment || ''
    }

    setFormData(updatedFormData)
    setChecked(Boolean(patient.patient_isolated))

    const newDate = dayjs(patient.patient_age)
    setSelectedDate(newDate.toDate())
  }

  useEffect(() => {
    if (edditingPatientID) {
      fetchPatientById(edditingPatientID)
    }
  }, [edditingPatientID])

  useEffect(() => {
    if (edditingPatient) {
      fetchAllOptions().then((options) => {
        setFormDataFromPatient(edditingPatient, options)
      })
    }
  }, [edditingPatient])

  useEffect(() => {
    fetchAllOptions()
  }, [])

  //-----------------------------------  VARIABLES OBTENIBLES DE BD ---------------------------------
  //TODO estos const deberían levantarse de la base de datos
  const PatientProblems = [
    { _id: 1, name: 'Convulsiones' },
    { _id: 2, name: 'Trauma de Cráneo' },
    { _id: 3, name: 'Dolor torácico / dorsal' },
    { _id: 4, name: 'Dolor abdominal / lumbar' },
    { _id: 5, name: 'Cefalea' },
    { _id: 6, name: 'Déficit motor' },
    { _id: 7, name: 'Disartria - afasia' },
    { _id: 8, name: 'Pérdida aguda de visión' },
    { _id: 9, name: 'Disnea' },
    { _id: 10, name: 'Otro dolor en curso' },
    { _id: 11, name: 'Sobredosis de fármacos / Ingesta de tóxicos' },
    { _id: 12, name: 'Sangrado Digestivo' },
    { _id: 13, name: 'Fiebre >38°' }
  ]
  const TriageLevels = [
    { _id: 1, name: 'I', color: '153, 153, 153' },
    { _id: 2, name: 'II', color: '255,51,0' },
    { _id: 3, name: 'III', color: '255,255,102' },
    { _id: 4, name: 'IV', color: '105,168,79' }
  ]

  //-----------------------------------  HANDLRES ---------------------------------
  const handleButtonClick: React.MouseEventHandler<HTMLButtonElement> = (_event) => {
    formInterfaz.patient_triage_time = new Date()
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [oldFormData] = useState<any>(formData)

  const handleCheckbox = () => {
    setChecked(!checked)

    setformInterfaz({ ...formInterfaz, patient_isolated: Boolean(!checked) })
    setFormData({ ...formData, patient_isolated: Boolean(!checked) })
    setErrorsForm({
      ...ErrorsForm,
      patient_isolated: {
        ...ErrorsForm.patient_isolated,
        value: false
      }
    })
    console.log('Chequed: ' + !checked)
  }

  //Triage level buttons
  const handleTriageLevelClick = (level: number) => {
    setformInterfaz({
      ...formInterfaz,
      patient_triage_level: level
    })
    setFormData({
      ...formData,
      patient_triage_level: level
    })
    setErrorsForm({
      ...ErrorsForm,
      patient_triage_level: {
        ...ErrorsForm.patient_triage_level,
        value: false
      }
    })
  }

  //Date Picker
  const handleDateChange = (newDate: Date | null) => {
    setformInterfaz({ ...formInterfaz, patient_age: newDate })
    setFormData({ ...formData, patient_age: newDate })
    setErrorsForm({
      ...ErrorsForm,
      patient_age: {
        ...ErrorsForm.patient_age,
        value: false
      }
    })
    setSelectedDate(newDate)
  }

  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  // only Age
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value: rawValue } = e.target
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let value: any = rawValue

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateFormData = (newFormData: any) => {
      setFormData(newFormData)
      setErrorsForm({
        ...ErrorsForm,
        [name]: {
          ...ErrorsForm[name],
          value: false
        }
      })
      ObjetoconDatosCambiados(newFormData, oldFormData)
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleOptionChange = (options: any[], idKey: string, nameKey: string) => {
      const selectedOption = options.find((option) => option[nameKey] === value)
      const itemId = selectedOption ? selectedOption[idKey] : ''
      const itemValue = selectedOption ? selectedOption[nameKey] : ''
      setformInterfaz({
        ...formInterfaz,
        [name]: itemValue
      })
      updateFormData({
        ...formData,
        [name]: itemId
      })
    }

    switch (name) {
      case 'doctor_id':
        if (DoctorOptions) handleOptionChange(DoctorOptions, 'user_id', 'user_name')
        break

      case 'nurse_id':
        if (NurseOptions) handleOptionChange(NurseOptions, 'user_id', 'user_name')
        break

      case 'box_id':
        if (value === '' || value === 'AFUERA') {
          setformInterfaz({
            ...formInterfaz,
            [name]: null,
            patient_status: 'AFUERA'
          })
          updateFormData({
            ...formData,
            [name]: null,
            patient_status: 'AFUERA'
          })
        } else {
          const boxId = BoxesOptions?.find((box) => box.box_id == value)?.box_id || ''
          setformInterfaz({
            ...formInterfaz,
            [name]: boxId,
            patient_status: 'EN OBSERVACION'
          })
          updateFormData({
            ...formData,
            [name]: boxId,
            patient_status: 'EN OBSERVACION'
          })
        }
        break

      case 'patient_triage_level':
        value = Number(value)
        setformInterfaz({
          ...formInterfaz,
          [name]: value
        })
        updateFormData({
          ...formData,
          [name]: value
        })
        break

      case 'patient_age':
        if (!edditingPatient) {
          value = getAgeNumber(Number(value))
          setformInterfaz({
            ...formInterfaz,
            [name]: Number(rawValue)
          })
          updateFormData({
            ...formData,
            [name]: value
          })
        } else {
          console.log('revisar error')
        }
        break

      default:
        setformInterfaz({
          ...formInterfaz,
          [name]: value
        })
        updateFormData({
          ...formData,
          [name]: value
        })
        setErrorsForm({
          ...ErrorsForm,
          [name]: {
            ...ErrorsForm[name],
            value: value ? false : true
          }
        })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const formDataNoID = { ...formData }
      delete formDataNoID.patient_id
      formDataNoID.patient_isolated = Boolean(formDataNoID.patient_isolated)
      if (!formDataNoID.patient_triage_time) formDataNoID.patient_triage_time = new Date()
      if (formDataNoID.patient_entry_time)
        formDataNoID.patient_entry_time = new Date(formDataNoID.patient_entry_time)
      else formDataNoID.patient_entry_time = new Date()
      formDataNoID.patient_age = new Date(formDataNoID.patient_age)
      const token = Cookies.get('authToken')
      if (token) {
        if (edditingPatient) {
          await updateAnyPatient(edditingPatient.patient_id, formDataNoID)
          toast.success('Paciente actualizado', { duration: 2000 })
          navigate('/patients')
        } else {
          const { data, errors } = await addNewPatient(formDataNoID)
          if (errors) {
            console.error('Errores en el formulario al agregar nuevo paciente:', errors)
            toast.error('Error al intentar agregar un nuevo paciente', { duration: 2000 })
            resetErrors()
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            setErrorsForm((prevErrorsForm: any) => {
              let updatedErrorsForm = { ...prevErrorsForm }
              errors.forEach((error) => {
                updatedErrorsForm = {
                  ...updatedErrorsForm,
                  [error.path]: { ...updatedErrorsForm[error.path], value: true }
                }
              })
              return updatedErrorsForm
            })
          } else {
            console.log('Nuevo paciente agregado:', data)
            toast.success('Nuevo paciente agregado', { duration: 2000 })
            resetForm()
          }
        }
      }
    } catch (error) {
      toast.error('Error al intentar agregar un nuevo paciente', { duration: 2000 })
      console.error('Error al intentar agregar un nuevo paciente:', error)
    }
  }

  const resetForm = () => {
    setformInterfaz(Forumario_estandar)
    setFormData(Forumario_estandar)
    setChecked(false)
    setSelectedDate(null)
    resetErrors()
  }
  //-----------------------------------  Console Log datos cambiados ---------------------------------
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function ObjetoconDatosCambiados(proxy: any, oldFormData: any) {
    if (edditingPatient) {
      const datosCambiados = _.omitBy(proxy, (value, key) => {
        // Omitir si el valor es igual al valor antiguo, o si es un campo vacío
        return (
          _.isEqual(value, oldFormData[key]) || (typeof value === 'string' && value.trim() === '')
        )
      })
      cancelBoxPreviousSelected
      console.log('Los datos cambiados son: \n')
      console.log(datosCambiados)
      // si se desea averiguar el nombre en vez del id hay que cambiar el let de value y ponerlo como otra var
      // Aquí puedes enviar datosCambiados al backend
    }
  }

  //----------------------------------------------  Deseleccion Box ---------------------------------
  // Función para cancelar el cambio de box y agregar el box previo a la lista
  const cancelBoxPreviousSelected = () => {
    // Verificar que BoxesOptions y formData.box_id tengan valores válidos
    if (BoxesOptions && formData.box_id) {
      // Agregar el box previo a la lista solo si no está ya en la lista
      if (!BoxesOptions.includes(formData.box_id)) {
        setBoxesOptions([...BoxesOptions, formData.box_id])
      }
    }
  }

  //--------------------------------------  Handler Errores -----------------------------------------
  const [ErrorsForm, setErrorsForm] = useState<{
    [key: string]: { value: boolean | null; message: string }
  }>({
    patient_name: { value: null, message: 'Escriba un nombre válido' },
    patient_age: {
      value: null,
      message: `${edditingPatient ? 'Seleccione una fecha válida' : 'Seleccione una edad válida'}`
    },
    patient_triage_level: { value: null, message: 'Seleccione un nivel de triage' },
    patient_status: { value: null, message: 'Seleccione un estado válido' },
    patient_symptom: { value: null, message: 'Escriba el sintoma  del paciente' },
    patient_isolated: { value: null, message: 'Error en Chekbox' },
    //patient_medication: { value: null, message: 'Escriba la medicación del paciente' },
    doctor_id: { value: null, message: 'Seleccione un doctor válido' },
    nurse_id: { value: null, message: 'Seleccione un enfermero válido' },
    box_id: { value: null, message: 'Seleccione un box válido' },
    patient_healthcare_system: { value: null, message: 'Detalle Cobertura Médica' }
  })
  const resetErrors = () => {
    setErrorsForm({
      patient_name: { value: null, message: 'Escriba un nombre válido' },
      patient_age: {
        value: null,
        message: `${edditingPatient ? 'Seleccione una fecha válida' : 'Seleccione una edad válida'}`
      },
      patient_triage_level: { value: null, message: 'Seleccione un nivel de triage' },
      patient_status: { value: null, message: 'Seleccione un estado válido' },
      patient_symptom: { value: null, message: 'Escriba el sintoma del paciente' },
      patient_isolated: { value: null, message: '' },
      //patient_medication: { value: null, message: 'Escriba la medicación del paciente' },
      doctor_id: { value: null, message: 'Seleccione un doctor válido' },
      nurse_id: { value: null, message: 'Seleccione un enfermero válido' },
      box_id: { value: null, message: 'Seleccione un box válido' },
      patient_healthcare_system: { value: null, message: 'Detalle Cobertura Médica' },
      nurse_coment: { value: null, message: 'No debería aparecer este mensaje' }
    })
  }

  //-----------------------------------  Componente ---------------------------------
  return (
    <div className='max-w-6xl mx-auto mt-5 p-6 bg-white shadow-md rounded-md'>
      {edditingPatient ? (
        <h2 className='text-2xl font-semibold mb-5'>{t('title.EditMode')}</h2>
      ) : (
        <h2 className='text-2xl font-semibold mb-5'>{t('title.AddMode')}</h2>
      )}
      <form
        onSubmit={handleSubmit}
        className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'
      >
        <div>
          <Label htmlFor='patient_name'>{t('NameLabel')}</Label>
          <Input
            error_active={ErrorsForm.patient_name}
            type='text'
            id='patient_name'
            name='patient_name'
            value={formInterfaz.patient_name}
            onChange={handleInputChange}
            // required
          />
        </div>

        <div>
          <Label htmlFor='patient_age'>
            {edditingPatient ? t('DateOfBirthLabel') : t('AgeLabel')}
          </Label>
          {/* <DatePickerMUI
            //@ts-expect-error no se handlea el vento
            onChangeExt={handleDateChange}
            //@ts-expect-error no se handlea el vento
            selectedDateExt={selectedDate}
            error_active={ErrorsForm.patient_age}
          /> */}
          {edditingPatient ? (
            <DatePickerMUI
              //@ts-expect-error no se handlea el vento
              onChangeExt={handleDateChange}
              //@ts-expect-error no se handlea el vento
              selectedDateExt={selectedDate}
              error_active={ErrorsForm.patient_age}
            />
          ) : (
            <Input
              error_active={ErrorsForm.patient_age}
              type='number'
              id='patient_age'
              name='patient_age'
              value={formInterfaz.patient_age}
              onChange={handleInputChange}
              // required
            />
          )}
        </div>

        <div>
          <Label htmlFor='patient_symptom'>{t('PatientSymptom')}</Label>
          <Input
            error_active={ErrorsForm.patient_symptom}
            type='text'
            id='patient_symptom'
            name='patient_symptom'
            value={formInterfaz.patient_symptom}
            onChange={handleInputChange}
            autoComplete='off'
            list='patientSymptoms'
          />
          <datalist
            id='patientSymptoms'
            className='absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg'
          >
            {PatientProblems?.map((option) => (
              <option key={option._id} value={option.name} data-id={option._id} />
            ))}
          </datalist>
        </div>

        <div>
          <Label htmlFor='patient_triage_level'>{t('TriageLevelLabel')}</Label>
          <div
            className={`flex gap-3 p-0.5 ${
              ErrorsForm.patient_triage_level.value ? 'border border-red-500' : ''
            }`}
          >
            {TriageLevels.map((level) => (
              <button
                key={level._id}
                onClick={() => handleTriageLevelClick(level._id)}
                type='button'
                className={`py-1  flex-grow border-4 ${
                  formInterfaz.patient_triage_level == level._id
                    ? ' border-black'
                    : 'border-transparent'
                }`}
                style={{ backgroundColor: `rgba(${level.color}, 0.6)` }}
              >
                {level.name}
              </button>
            ))}
          </div>
          <div>
            {ErrorsForm.patient_triage_level.value && (
              <span className='text-red-500'>{ErrorsForm.patient_triage_level.message}</span>
            )}
          </div>
        </div>

        <div>
          <Label htmlFor='patient_isolated'>{t('PatientIsolation')}</Label>
          <Checkbox
            id='patient_isolated'
            name='patient_isolated'
            color='success'
            checked={checked}
            sx={{ '& .MuiSvgIcon-root': { fontSize: 28 } }}
            onChange={handleCheckbox}
          />
        </div>
        <div>
          <Label htmlFor='patient_healthcare_system'>{t('patient_healthcare_system')}</Label>
          <Input
            error_active={ErrorsForm.patient_healthcare_system}
            type='text'
            id='patient_healthcare_system'
            name='patient_healthcare_system'
            value={formInterfaz.patient_healthcare_system}
            onChange={handleInputChange}
            // required
          />
        </div>

        <div>
          <Label htmlFor='box_id'>{t('BoxIDLabel')}</Label>
          <Select
            error_active={ErrorsForm.box_id}
            id='box_id'
            name='box_id'
            value={formInterfaz.box_id ? formInterfaz.box_id : ''}
            onChange={handleInputChange}
          >
            <option value='' disabled className='bg-white opacity-100'>
              Seleccionar box
            </option>
            <option value='' className='bg-white opacity-100'>
              AFUERA
            </option>
            {BoxOcupiedByPatient?.map((option) => (
              <option
                key={option.box_id}
                value={option.box_id}
                disabled
                className='bg-white opacity-100'
              >
                {option.box_code + ': ' + option.box_type}
              </option>
            ))}

            {BoxesOptions?.map((option) => (
              <option key={option.box_id} value={option.box_id} className='bg-white opacity-100'>
                {option.box_code + ': ' + option.box_type}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <Label htmlFor='doctor_id'>{t('DoctorNameLabel')}</Label>
          <Select
            error_active={ErrorsForm.doctor_id}
            id='doctor_id'
            name='doctor_id'
            value={formInterfaz.doctor_id}
            onChange={handleInputChange}
          >
            <option value='' disabled className='bg-white opacity-100'>
              Seleccionar doctor
            </option>
            {DoctorOptions?.map((option) => (
              <option
                key={option.user_id}
                value={option.user_name}
                className='bg-white opacity-100'
              >
                {option.user_name}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <Label htmlFor='nurse_id'>{t('NurseNameLabel')}</Label>
          <Select
            error_active={ErrorsForm.nurse_id}
            id='nurse_id'
            name='nurse_id'
            value={formInterfaz.nurse_id}
            onChange={handleInputChange}
          >
            <option value='' disabled className='bg-white opacity-100'>
              Seleccionar enfermero
            </option>
            {NurseOptions?.map((option) => (
              <option
                key={option.user_id}
                value={option.user_name}
                className='bg-white opacity-100'
              >
                {option.user_name}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <Label htmlFor='nurse_comment'>{t('NurseComent')}</Label>
          <Input
            error_active={ErrorsForm.nurse_comment}
            type='text'
            id='nurse_comment'
            name='nurse_comment'
            value={formInterfaz.nurse_comment}
            onChange={handleInputChange}
            // required
          />
        </div>

        <div className='flex items-end gap-4 '>
          <Button type='submit' color='green' onClick={handleButtonClick}>
            {edditingPatient ? t('SavePatientButton') : t('AddNewPatientButton')}
          </Button>
          {edditingPatient && (
            <Link to={`/patients`}>
              <Button type='button' color='grey'>
                {t('CancelButton')}
              </Button>
            </Link>
          )}
        </div>
      </form>
    </div>
  )
}

export default PatientForm
