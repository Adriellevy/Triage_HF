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

function PatientForm() {
  const [BoxesOptions, setBoxesOptions] = useState<Box[] | null>(null)
  const [DoctorOptions, setDoctorOptions] = useState<User[] | null>(null)
  const [NurseOptions, setNurseOptions] = useState<User[] | null>(null)
  const [checked, setChecked] = React.useState(false)
  const { t } = useTranslation('PatientForm')

  const navigate = useNavigate()

  // Edit states
  const { edditingPatientID } = useParams()
  const [edditingPatient, setedditingPatient] = useState<Patient | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [data] = await getPatientById(edditingPatientID)
        setedditingPatient(data)
      } catch (error) {
        if (error instanceof Error) {
          console.error('Error al obtener pacientes:', error.message)
        } else {
          console.error('Error desconocido al obtener pacientes:', error)
        }
      }
    }
    edditingPatientID && fetchData() //Only runs if params exists
  }, [edditingPatientID])

  useEffect(() => {
    //Only runs in edit mode
    const asFun = async () => {
      try {
        const docs = await getAllDoctors()
        const nurses = await getAllNurses()
        const boxes = await getAvailableBoxes()
        const allBoxes = await getAllBoxes()
        setDoctorOptions(docs)
        setNurseOptions(nurses)
        setBoxesOptions(boxes)
        const doctor = docs?.find((doctor) => doctor.user_name === edditingPatient?.doctor_name)
        formInterfaz.doctor_id = doctor ? doctor.user_id : ''
        formData.doctor_id = doctor ? doctor.user_id : ''
        const nurse = nurses?.find((nurse) => nurse.user_name === edditingPatient?.nurse_name)
        formInterfaz.nurse_id = nurse ? nurse.user_id : ''
        formData.nurse_id = nurse ? nurse.user_id : ''
        const box = allBoxes?.find((box) => box.box_code === edditingPatient?.box_code)
        formInterfaz.box_id = box ? box.box_id : ''
        formData.box_id = box ? box.box_id : ''
      } catch (error) {
        console.log(error)
      }
    }
    if (edditingPatient) {
      setChecked(Boolean(edditingPatient.patient_isolated))
      formInterfaz.patient_name = edditingPatient.patient_name || ''
      formInterfaz.patient_age = String(edditingPatient.patient_age).slice(0, 10) || ''
      formInterfaz.patient_entry_time = edditingPatient.patient_entry_time || ''
      formInterfaz.patient_exit_time = edditingPatient.patient_exit_time || null
      formInterfaz.patient_triage_time = edditingPatient.patient_triage_time || ''
      formInterfaz.patient_triage_level = edditingPatient.patient_triage_level || ''
      formInterfaz.patient_isolated = edditingPatient.patient_isolated || 'false'
      formInterfaz.patient_status = edditingPatient.patient_status || ''
      formInterfaz.patient_symptom = edditingPatient.patient_symptom || ''
      formInterfaz.box_id = edditingPatient.box_id || ''
      formInterfaz.nurse_id = edditingPatient.nurse_id || ''
      formInterfaz.doctor_id = edditingPatient.doctor_id || ''
      //
      formData.patient_name = edditingPatient.patient_name || ''
      formData.patient_age = edditingPatient.patient_age.slice(0, 10) || ''
      formData.patient_entry_time = edditingPatient.patient_entry_time || ''
      formData.patient_exit_time = edditingPatient.patient_exit_time || null
      formData.patient_triage_time = edditingPatient.patient_triage_time || ''
      formData.patient_triage_level = edditingPatient.patient_triage_level || ''
      formData.patient_isolated = edditingPatient.patient_isolated || 'false'
      formData.patient_status = edditingPatient.patient_status || ''
      formData.patient_symptom = edditingPatient.patient_symptom || ''
      formData.box_id = edditingPatient.box_id || ''
      formData.nurse_id = edditingPatient.nurse_id || ''
      formData.doctor_id = edditingPatient.doctor_id || ''
      //formInterfaz.patient_medication = edditingPatient.patient_medication || ''
      asFun()

      const newDate = dayjs(edditingPatient.patient_age)
      setSelectedDate(newDate.toDate())
    }
  }, [edditingPatient])

  useEffect(() => {
    //bring doctors, nurses, and boxes available
    const fetchDoctors = async () => {
      try {
        const data = await getAllDoctors()
        setDoctorOptions(data)
      } catch (error) {
        // console.error('Error:', error.message)
      }
    }
    const fetchNurses = async () => {
      try {
        const data = await getAllNurses()
        setNurseOptions(data)
      } catch (error) {
        // console.error('Error:', error.message)
      }
    }
    const fetchBoxes = async () => {
      try {
        const data = await getAvailableBoxes()
        setBoxesOptions(data)
      } catch (error) {
        // console.error('Error:', error.message)
      }
    }
    fetchDoctors()
    fetchNurses()
    fetchBoxes()
  }, [])

  //TODO estas 3 const deberian traerse desde api
  const StateOptions = [
    { state_id: 1, state_name: 'EN OBSERVACION' },
    { state_id: 5, state_name: 'AFUERA' }
  ]
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

  // Function to get the current time in the desired format
  const getCurrentTime = () => {
    const now = new Date()
    const formattedTime = `${now.getFullYear()}-${(now.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')} ${now
      .getHours()
      .toString()
      .padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now
      .getSeconds()
      .toString()
      .padStart(2, '0')}`
    return formattedTime
  }

  const handleButtonClick: React.MouseEventHandler<HTMLButtonElement> = (_event) => {
    formInterfaz.patient_triage_time = getCurrentTime()
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [formInterfaz, setformInterfaz] = useState<any>({
    patient_name: '',
    patient_age: null,
    patient_entry_time: '',
    patient_exit_time: null,
    patient_triage_time: getCurrentTime(),
    patient_triage_level: '',
    patient_isolated: false,
    patient_status: '',
    patient_symptom: '',
    //patient_medication: '',
    doctor_id: '',
    nurse_id: '',
    box_id: null
  })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [formData, setFormData] = useState<any>({
    patient_name: '',
    patient_age: null,
    patient_entry_time: '',
    patient_exit_time: null,
    patient_triage_time: getCurrentTime(),
    patient_triage_level: '',
    patient_isolated: false,
    patient_status: '',
    patient_symptom: '',
    patient_healthcare_system: 'default',
    //patient_medication: '',
    doctor_id: '',
    nurse_id: '',
    box_id: null
  })

  const handleCheckbox = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked)
    setformInterfaz({ ...formInterfaz, patient_isolated: Boolean(checked) })
    setFormData({ ...formData, patient_isolated: Boolean(checked) })
    setErrorsForm({
      ...ErrorsForm,
      patient_isolated: {
        ...ErrorsForm.patient_isolated,
        value: false
      }
    })
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
  const getBirthDate = (edad: number) => {
    if (edad) {
      const hoy = new Date()
      const añoActual = hoy.getFullYear()
      const añoNacimiento = añoActual - edad
      return añoNacimiento + '-01-01'
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    // Get the selected option based on the entered value
    // Check if it's the hidden input

    if (name === 'doctor_id') {
      const itemValue = DoctorOptions
        ? DoctorOptions.find((option) => option.user_name === value)?.user_name
        : null
      const itemId = DoctorOptions
        ? DoctorOptions.find((option) => option.user_name === value)?.user_id
        : null
      console.log('user id del doc: ' + itemId)
      setformInterfaz({
        ...formInterfaz,
        [name]: itemValue
      })
      setFormData({
        ...formData,
        [name]: itemId
      })

      setErrorsForm({
        ...ErrorsForm,
        [name]: {
          ...ErrorsForm[name],
          value: false
        }
      })
    } else if (name === 'nurse_id') {
      const itemValue = NurseOptions
        ? NurseOptions.find((option) => option.user_name === value)?.user_name
        : null
      const itemId = NurseOptions
        ? NurseOptions.find((option) => option.user_name === value)?.user_id
        : null
      setformInterfaz({
        ...formInterfaz,
        [name]: itemValue
      })
      setFormData({
        ...formData,
        [name]: itemId
      })
      setErrorsForm({
        ...ErrorsForm,
        [name]: {
          ...ErrorsForm[name],
          value: false
        }
      })
    } else if (name === 'box_id') {
      const itemId = BoxesOptions?.find((box) => box.box_id == value)?.box_id
      setformInterfaz({
        ...formInterfaz,
        [name]: itemId
      })
      setFormData({
        ...formData,
        [name]: itemId
      })
      setErrorsForm({
        ...ErrorsForm,
        [name]: {
          ...ErrorsForm[name],
          value: false
        }
      })
    } else if (name === 'patient_triage_level') {
      setformInterfaz({
        ...formInterfaz,
        [name]: Number(value)
      })
      setFormData({
        ...formData,
        [name]: Number(value)
      })
      setErrorsForm({
        ...ErrorsForm,
        [name]: {
          ...ErrorsForm[name],
          value: false
        }
      })
    } else if (name === 'patient_age') {
      if (edditingPatient) {
        console.log('revisar error')
      } else {
        getBirthDate(Number(value))
        setformInterfaz({
          ...formInterfaz,
          [name]: Number(value)
        })
        setFormData({
          ...formData,
          [name]: getBirthDate(Number(value))
        })
        setErrorsForm({
          ...ErrorsForm,
          [name]: {
            ...ErrorsForm[name],
            value: false
          }
        })
      }
    } else {
      setformInterfaz({
        ...formInterfaz,
        [name]: value
      })
      setFormData({
        ...formData,
        [name]: value
      })
      if (value) {
        setErrorsForm({
          ...ErrorsForm,
          [name]: {
            ...ErrorsForm[name],
            value: false
          }
        })
      } else {
        setErrorsForm({
          ...ErrorsForm,
          [name]: {
            ...ErrorsForm[name],
            value: true
          }
        })
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    //Update patient_entry_time
    const formDataNow = formData
    formDataNow.patient_entry_time = getCurrentTime()
    try {
      //Delete Id
      const formDataNoID = formDataNow
      console.log(formDataNoID)
      formDataNoID.patient_isolated = Boolean(formDataNoID.patient_isolated)
      delete formDataNoID.patient_id
      const token = Cookies.get('authToken')
      if (token) {
        if (edditingPatient) {
          try {
            await updateAnyPatient(edditingPatient.patient_id, formDataNoID)
            toast.success('Paciente actualizado', {
              duration: 2000
            })
            navigate('/patients')
          } catch {
            toast.error('Error al actualizar un paciente', {
              duration: 2000
            })
          }
        } else {
          const { data, errors } = await addNewPatient(formDataNow)
          if (errors) {
            console.error('Errores en el formulario al agregar nuevo paciente:', errors)
            toast.error('Error al intentar agregar un nuevo paciente', {
              duration: 2000
            })
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
            toast.success('Nuevo paciente agregado', {
              duration: 2000
            })

            setformInterfaz({
              patient_name: '',
              patient_age: '2000-01-01',
              patient_entry_time: null,
              patient_exit_time: null,
              patient_triage_time: getCurrentTime(),
              patient_triage_level: '',
              patient_status: '',
              patient_isolated: false,
              patient_symptom: '',
              //patient_medication: '',
              doctor_id: '',
              nurse_id: '',
              box_id: ''
            })
            setFormData({
              patient_name: '',
              patient_age: '2000-01-01',
              patient_entry_time: null,
              patient_exit_time: null,
              patient_triage_time: getCurrentTime(),
              patient_triage_level: '',
              patient_status: '',
              patient_symptom: '',
              patient_isolated: false,
              //patient_medication: '',
              doctor_id: '',
              nurse_id: '',
              box_id: ''
            })
            setChecked(false)
            setSelectedDate(null)
          }
        }
      }
    } catch (error) {
      toast.error('Error al intentar agregar un nuevo paciente', {
        duration: 2000
      })
      console.error('Error al intentar agregar un nuevo paciente:', error)
    }
  }

  // Errors
  const [ErrorsForm, setErrorsForm] = useState<{
    [key: string]: { value: boolean | null; message: string }
  }>({
    patient_name: { value: null, message: 'Escriba un nombre válido' },
    patient_age: { value: null, message: `${edditingPatient?'Seleccione una fecha válida':'Seleccione una edad válida'}` },
    patient_triage_level: { value: null, message: 'Seleccione un nivel de triage' },
    patient_status: { value: null, message: 'Seleccione un estado válido' },
    patient_symptom: { value: null, message: 'Escriba el sintoma  del paciente' },
    patient_isolated: { value: null, message: 'Error en Chekbox' },
    //patient_medication: { value: null, message: 'Escriba la medicación del paciente' },
    doctor_id: { value: null, message: 'Seleccione un doctor válido' },
    nurse_id: { value: null, message: 'Seleccione un enfermero válido' },
    box_id: { value: null, message: 'Seleccione un box válido' }
  })
  const resetErrors = () => {
    setErrorsForm({
      patient_name: { value: null, message: 'Escriba un nombre válido' },
      patient_age: { value: null, message: `${edditingPatient?'Seleccione una fecha válida':'Seleccione una edad válida'}` },
      patient_triage_level: { value: null, message: 'Seleccione un nivel de triage' },
      patient_status: { value: null, message: 'Seleccione un estado válido' },
      patient_symptom: { value: null, message: 'Escriba el sintoma del paciente' },
      patient_isolated: { value: null, message: '' },
      //patient_medication: { value: null, message: 'Escriba la medicación del paciente' },
      doctor_id: { value: null, message: 'Seleccione un doctor válido' },
      nurse_id: { value: null, message: 'Seleccione un enfermero válido' },
      box_id: { value: null, message: 'Seleccione un box válido' }
    })
  }


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
          <Label htmlFor='box_id'>{t('BoxIDLabel')}</Label>
          <Select
            error_active={ErrorsForm.box_id}
            id='box_id'
            name='box_id'
            value={formInterfaz.box_id ? formInterfaz.box_id : ''}
            onChange={handleInputChange}
          >
            <option value='' disabled>
              Seleccionar box
            </option>
            {BoxesOptions?.map((option) => (
              <option key={option.box_id} value={option.box_id}>
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
            <option value='' disabled>
              Seleccionar doctor
            </option>
            {DoctorOptions?.map((option) => (
              <option key={option.user_id} value={option.user_name}>
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
            <option value='' disabled>
              Seleccionar enfermero
            </option>
            {NurseOptions?.map((option) => (
              <option key={option.user_id} value={option.user_name}>
                {option.user_name}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <Label htmlFor='patient_status'>{t('PatientStatusLabel')}</Label>
          <Select
            error_active={ErrorsForm.patient_status}
            id='patient_status'
            name='patient_status'
            value={formInterfaz.patient_status}
            onChange={handleInputChange}
          >
            <option value='' disabled>
              Seleccionar estado
            </option>
            {StateOptions.map((option) => (
              <option key={option.state_id} value={option.state_name}>
                {option.state_name}
              </option>
            ))}
          </Select>
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
