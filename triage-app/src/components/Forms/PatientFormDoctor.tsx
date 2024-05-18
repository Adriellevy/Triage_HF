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
import { Checkbox, FormControlLabel } from '@mui/material'
import React from 'react'
import _ from 'lodash'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFlaskVial, faChevronDown } from '@fortawesome/free-solid-svg-icons'
import LoaderSpin from '../LoaderSpin'
import { getAgeNumber } from '../../helpers/HelperFechas'
function PatientFormDoctor() {
  const [BoxesOptions, setBoxesOptions] = useState<Box[] | null>(null)
  const [BoxOcupiedByPatient, setBoxOcupiedByPatient] = useState<Box[] | null>(null)
  const [DoctorOptions, setDoctorOptions] = useState<User[] | null>(null)
  const [NurseOptions, setNurseOptions] = useState<User[] | null>(null)
  const [checked, setChecked] = React.useState(false)
  const [ListaEstudiosSolicitados, setListaEstudiosSolicitados] = useState<string[] | null>(null)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [certainValue, setCertainValue] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(false)
  const { t } = useTranslation('PatientForm')

  const navigate = useNavigate()

  // Edit states
  const { edditingPatientID } = useParams()
  const [edditingPatient, setedditingPatient] = useState<Patient | null>(null)
  //-----------------------------------  SETEO FORMULARIOS ---------------------------------
  // Formulario interfaz tiene como objetivo guardar los valores de los elementos selecionados y no los id
  // ya que los valores no se mandan a la base de datos
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [formInterfaz, setformInterfaz] = useState<any>({
    patient_name: '',
    patient_age: null,
    patient_entry_time: '',
    patient_exit_time: null,
    patient_triage_time: new Date(),
    patient_triage_level: '',
    patient_isolated: false,
    patient_status: 'AFUERA',
    patient_healthcare_system: 'default',
    patient_symptom: '',
    //patient_medication: '',
    doctor_id: '',
    nurse_id: '',
    box_id: null,
    nurse_comment: '',
    doctor_procedure: '' //cuando este listo el backend para mandar los comentarios descomentar linea
  })

  // Formulario Data tiene como objetivo guardar los id's de los elementos selecionados y no los valores
  // ya que los id's son los que se mandan a la base de datos
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [formData, setFormData] = useState<any>({
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
    doctor_procedure: '', //decomentar cuando este listo el backend para mandar los comentarios descomentar linea
    doctor_coment: '',
    nurse_coment: '' //cuando este listo el backend para mandar los comentarios descomentar linea
  })

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
        const box = allBoxes?.find((box) => edditingPatient?.box_code.includes(box.box_code))
        if (box) setBoxOcupiedByPatient([box])

        const doctor = docs?.find((doctor) => doctor.user_name === edditingPatient?.doctor_name)
        formInterfaz.doctor_id = doctor ? doctor.user_name : ''
        formData.doctor_id = doctor ? doctor.user_id : ''
        const nurse = nurses?.find((nurse) => nurse.user_name === edditingPatient?.nurse_name)
        formInterfaz.nurse_id = nurse ? nurse.user_name : ''
        formData.nurse_id = nurse ? nurse.user_id : ''
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
      formInterfaz.patient_isolated = Boolean(edditingPatient.patient_isolated)
      formInterfaz.patient_status = edditingPatient.patient_status || ''
      formInterfaz.patient_symptom = edditingPatient.patient_symptom || ''
      formInterfaz.box_id = edditingPatient.box_id || ''
      formInterfaz.nurse_id = edditingPatient.nurse_name || ''
      formInterfaz.doctor_id = edditingPatient.doctor_name || ''
      //
      formData.patient_name = edditingPatient.patient_name || ''
      formData.patient_age = edditingPatient.patient_age || ''
      formData.patient_entry_time = edditingPatient.patient_entry_time || ''
      formData.patient_exit_time = edditingPatient.patient_exit_time || null
      formData.patient_triage_time = edditingPatient.patient_triage_time || ''
      formData.patient_triage_level = edditingPatient.patient_triage_level || ''
      formData.patient_isolated = Boolean(edditingPatient.patient_isolated)
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
  const listaPosiblesEstudios = [
    { _id: 'Placa Toracica', name: 'doctor_procedure' },
    { _id: 'Vía', name: 'doctor_procedure' },
    { _id: 'Laboratorio', name: 'doctor_procedure' },
    { _id: 'Ecografía', name: 'doctor_procedure' },
    { _id: 'Rayos', name: 'doctor_procedure' }
  ]
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

  const handleInputChangeEstudios = (e: React.SyntheticEvent<Element, Event>, checked: boolean) => {
    const target = e.target as HTMLInputElement
    const name = target.name
    let estudios: string[] = ListaEstudiosSolicitados ? ListaEstudiosSolicitados : []

    if (checked) {
      // Si el checkbox está marcado, agregamos el nombre a la lista
      estudios.push(name)
    } else {
      // Si el checkbox no está marcado, removemos el nombre de la lista
      estudios = estudios.filter((estudio) => estudio !== name)
    }
    console.log(estudios)
    setListaEstudiosSolicitados(estudios)
    setCertainValue(true)
  }

  const handleInputChange = (e: React.SyntheticEvent<Element, Event>) => {
    const target = e.target as HTMLInputElement
    const name = target.name
    let value = target.value
    // Get the selected option based on the entered value
    // Check if it's the hidden input

    if (name === 'doctor_id') {
      const itemValue = DoctorOptions
        ? DoctorOptions.find((option) => option.user_name === value)?.user_name
        : null
      const itemId = DoctorOptions
        ? DoctorOptions.find((option) => option.user_name === value)?.user_id
        : null
      value = itemId || ''
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
      value = itemId || ''
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
      if (value === '' || value === 'AFUERA') {
        setformInterfaz({
          ...formInterfaz,
          [name]: null,
          patient_status: 'AFUERA'
        })
        setFormData({
          ...formData,
          [name]: null,
          patient_status: 'AFUERA'
        })
        setErrorsForm({
          ...ErrorsForm,
          [name]: {
            ...ErrorsForm[name],
            value: false
          }
        })
      } else {
        const itemId = BoxesOptions?.find((box) => box.box_id == value)?.box_id
        value = itemId || ''
        setformInterfaz({
          ...formInterfaz,
          [name]: itemId,
          patient_status: 'EN OBSERVACION'
        })
        setFormData({
          ...formData,
          [name]: itemId,
          patient_status: 'EN OBSERVACION'
        })
        setErrorsForm({
          ...ErrorsForm,
          [name]: {
            ...ErrorsForm[name],
            value: false
          }
        })
      }
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
        getAgeNumber(Number(value))
        setformInterfaz({
          ...formInterfaz,
          [name]: Number(value)
        })
        setFormData({
          ...formData,
          [name]: getAgeNumber(Number(value))
        })
        setErrorsForm({
          ...ErrorsForm,
          [name]: {
            ...ErrorsForm[name],
            value: false
          }
        })
      }
    } else if (name === 'doctor_procedure') {
      let estudios: string[] = ListaEstudiosSolicitados ? ListaEstudiosSolicitados : []
      if (target.dataset.id && target.checked) {
        // Si el checkbox está marcado, agregamos el nombre a la lista
        estudios.push(target.dataset.id.toString())
      } else {
        // Si el checkbox no está marcado, removemos el nombre de la lista
        estudios = estudios.filter((estudio) => estudio !== target.dataset.id)
      }
      console.log(target.dataset.id, target.checked, estudios)
      setListaEstudiosSolicitados(estudios)
      setFormData({
        ...formData,
        [name]: estudios
      })
      setErrorsForm({
        ...ErrorsForm,
        [name]: {
          ...ErrorsForm[name],
          value: false
        }
      })
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
    ObjetoconDatosCambiados({ ...formData, [name]: value }, oldFormData)
  }

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
      // si se desea averiguar el nombre en vez del id hay que cambiar el let de value y ponerlo como otra var
      // Aquí puedes enviar datosCambiados al backend
    }
  }

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
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    //Update patient_entry_time
    const formDataNow = formData
    try {
      //Delete Id
      const formDataNoID = formDataNow
      formDataNoID.patient_isolated = Boolean(formDataNoID.patient_isolated)
      formDataNoID.patient_triage_time = new Date(formDataNoID.patient_triage_time)
      formDataNoID.patient_entry_time = new Date(formDataNoID.patient_entry_time)
      formDataNoID.patient_age = new Date(formDataNoID.patient_age)
      delete formDataNoID.patient_id
      const token = Cookies.get('authToken')
      if (token) {
        if (edditingPatient) {
          console.log('Editing patch')
          console.log(formDataNoID)
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
          formDataNow.patient_entry_time = new Date()
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
            toast.success('Nuevo paciente agregado', {
              duration: 2000
            })

            setformInterfaz({
              patient_name: '',
              patient_age: '2000-01-01',
              patient_entry_time: null,
              patient_exit_time: null,
              patient_triage_time: new Date(),
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
              patient_triage_time: new Date(),
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
    box_id: { value: null, message: 'Seleccione un box válido' }
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
      box_id: { value: null, message: 'Seleccione un box válido' }
    })
  }
  // Replace with your actual logic

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen)

  const sendRequest = () => {
    if (certainValue == false) {
      // Replace with your actual popup logic
      alert('Please provide the required value.')
    } else {
      setLoading(true)
      //acordarse que esto es
    }
  }

  return (
    <div className='max-w-6xl mx-auto mt-5 p-6 bg-white shadow-md rounded-md'>
      {edditingPatient ? (
        <div>
          <form
            onSubmit={handleSubmit}
            className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8'
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
              />
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

            <div className='flex items-end gap-4 '>
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
                <option value=''>AFUERA</option>
                {BoxOcupiedByPatient?.map((option) => (
                  <option key={option.box_id} value={option.box_id} disabled>
                    {option.box_code + ': ' + option.box_type}
                  </option>
                ))}

                {BoxesOptions?.map((option) => (
                  <option key={option.box_id} value={option.box_id}>
                    {option.box_code + ': ' + option.box_type}
                  </option>
                ))}
              </Select>
            </div>
          </form>
          <div className='flex items-end gap-8 my-8'>
            {!dropdownOpen && !loading && (
              <Button wfull color='yellow' onClick={toggleDropdown}>
                <label>Solicitar Procedimiento </label>
                <FontAwesomeIcon icon={faChevronDown} />
              </Button>
            )}
            {dropdownOpen && !loading && (
              <div className='dropdown-menu grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-12'>
                {listaPosiblesEstudios.map((item) => (
                  <FormControlLabel
                    label={item._id.toString()}
                    id={item._id.toString()}
                    name='doctor_procedure'
                    control={
                      <Checkbox
                        inputProps={
                          {
                            'data-id': item._id.toString()
                          } as React.InputHTMLAttributes<HTMLInputElement>
                        }
                      />
                    }
                    onChange={handleInputChange}
                  ></FormControlLabel>
                ))}
              </div>
            )}
          </div>
          <form
            onSubmit={handleSubmit}
            className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8'
          >
            <div className='flex items-end gap-4 '>
              <Label htmlFor='doctor_coment'>{t('doctor_coment')}</Label>
              <Input
                error_active={ErrorsForm.doctor_procedure}
                type='text'
                id='doctor_coment'
                name='doctor_coment'
                value={formInterfaz.doctor_procedure}
                onChange={handleInputChange}
                // required
              />
            </div>
            {!loading && (
              <div className='flex items-end gap-4 m-2'>
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
            )}

            {loading && (
              <div className='m-2'>
                <LoaderSpin />
              </div>
            )}
          </form>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  )
}

export default PatientFormDoctor
