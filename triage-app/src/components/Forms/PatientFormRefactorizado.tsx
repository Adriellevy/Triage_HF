/* eslint-disable @typescript-eslint/no-unused-vars */
import { Field, Patient } from '@/interfaces/Patinet'
import { toast } from 'sonner'
import { User } from '@/interfaces/User'
import { Box } from '@/interfaces/Boxes'
import { addNewPatient, updateAnyPatient } from '@/services/patientService'
import { getAllDoctors, getAllNurses } from '@/services/userService'
import { getAvailableBoxes, getAllBoxes } from '@/services/boxService'
import { useContext, useEffect, useState } from 'react'
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
import {
  IndiceObjeto,
  returnBoxCode,
  returnDoctorName,
  returnNurseName,
  returnSintomName,
  returnDependingModeAge,
  returnBoolean,
  returnName4Database,
  returnDate4Database,
  returnNewDate,
  returnDoctorId,
  returnNurseId,
  returnBoxID,
  returnPatientTriageNumber,
  returnEstado
} from '@/helpers/HelperPatientForm'
import ConflictResolver from '../ConflictResolver/ConflictResolver'
import { Console } from 'console'
import { SocketContext } from '@/contex/SocketContext'
import { UpdateEvent } from '@/interfaces/Socket'

function PatientFormRefactorizado() {
  // Select states
  const [BoxesOptions, setBoxesOptions] = useState<Box[] | null>(null)
  const [BoxOcupiedByPatient, setBoxOcupiedByPatient] = useState<Box[] | null>(null)
  const [DoctorOptions, setDoctorOptions] = useState<User[] | null>(null)
  const [NurseOptions, setNurseOptions] = useState<User[] | null>(null)
  const [TotalOptions, setTotalOptions] = useState<{
    doctor_id: User[]
    nurse_id: User[]
    box_id: Box[]
    patient_symptom: string[]
  } | null>(null)
  // Checkbox state
  const [checked, setChecked] = React.useState(false)
  // Edit states
  const { edditingPatientID } = useParams()
  const [edditingPatient, setedditingPatient] = useState<Patient | null>(null)
  // Conflict resolver states
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [conflictData, setConflictData] = useState<any>(null)
  const [showConflictModal, setShowConflictModal] = useState<boolean>(true)
  // Miscelaneous states
  const { t } = useTranslation('PatientForm')
  const navigate = useNavigate()

  const token = Cookies.get('authToken')

  const socket = useContext(SocketContext)

  //-----------------------------------  SETEO FORMULARIOS ---------------------------------
  // Formulario estandar tiene como objetivo ser la plantilla

  //label null significa que ese dato no se muestra en el form
  const Formulario_estandar: Field[] = [
    {
      key: 'patient_name',
      label: 'NameLabel',
      labelAlternativo: null,
      format: null,
      component_type: 'input',
      value: null,
      handlerHelperFunction: null,
      formatdata: returnName4Database
    },
    {
      key: 'patient_age',
      label: 'DateOfBirthLabel',
      labelAlternativo: 'AgeLabel',
      format: returnDependingModeAge,
      component_type: 'DependsMode',
      value: '' || null,
      handlerHelperFunction: null,
      formatdata: returnDate4Database
    },
    {
      key: 'patient_symptom',
      label: 'PatientSymptom',
      labelAlternativo: null,
      format: returnSintomName,
      component_type: 'select',
      value: null,
      handlerHelperFunction: true,
      formatdata: returnSintomName
    },
    {
      key: 'patient_entry_time',
      label: null,
      labelAlternativo: null,
      format: null,
      component_type: '',
      value: null,
      handlerHelperFunction: null,
      formatdata: returnNewDate
    },
    {
      key: 'patient_exit_time',
      label: null,
      labelAlternativo: null,
      format: null,
      component_type: '',
      value: null,
      handlerHelperFunction: null,
      formatdata: null
    },
    {
      key: 'patient_triage_time',
      label: null,
      labelAlternativo: null,
      format: null,
      component_type: '',
      value: null,
      handlerHelperFunction: null,
      formatdata: returnNewDate
    },
    {
      key: 'patient_triage_level',
      label: 'TriageLevelLabel',
      labelAlternativo: null,
      format: returnPatientTriageNumber,
      component_type: 'TriageComponent',
      value: null,
      handlerHelperFunction: null,
      formatdata: returnPatientTriageNumber
    },
    {
      key: 'patient_isolated',
      label: 'PatientIsolation',
      labelAlternativo: null,
      format: returnBoolean,
      component_type: 'checkbox',
      value: null,
      handlerHelperFunction: null,
      formatdata: returnBoolean
    },
    {
      key: 'patient_status',
      label: '',
      labelAlternativo: null,
      format: returnEstado,
      component_type: 'select',
      value: null,
      handlerHelperFunction: null,
      formatdata: returnEstado
    },
    {
      key: 'patient_healthcare_system',
      label: 'patient_healthcare_system',
      labelAlternativo: null,
      format: null,
      component_type: 'input',
      value: null,
      handlerHelperFunction: null,
      formatdata: null
    },
    {
      key: 'doctor_id',
      label: 'DoctorNameLabel',
      labelAlternativo: null,
      format: returnDoctorName,
      component_type: 'select',
      value: null,
      handlerHelperFunction: null,
      formatdata: returnDoctorId
    },
    {
      key: 'nurse_id',
      label: 'NurseNameLabel',
      labelAlternativo: null,
      format: returnNurseName,
      component_type: 'select',
      value: null,
      handlerHelperFunction: null,
      formatdata: returnNurseId
    },
    {
      key: 'box_id',
      label: 'BoxIDLabel',
      labelAlternativo: null,
      format: returnBoxCode,
      component_type: 'select',
      value: null,
      handlerHelperFunction: null,
      formatdata: returnBoxID
    },
    {
      key: 'nurse_coment',
      label: 'NurseComent',
      labelAlternativo: null,
      format: null,
      component_type: 'input',
      value: null,
      handlerHelperFunction: null,
      formatdata: null
    }
    //patient_medication: '',
  ]

  // Formulario interfaz tiene como objetivo guardar los valores de los elementos selecionados y no los id
  // ya que los valores no se mandan a la base de datos
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [formInterfaz, setformInterfaz] = useState<Field[]>(Formulario_estandar)

  // Formulario Data tiene como objetivo guardar los id's de los elementos selecionados y no los valores
  // ya que los id's son los que se mandan a la base de datos
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [formData, setFormData] = useState<any>(null)
  //--------------------------------------------------  USE EFFECTS --------------------------------------------

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getPatientById(edditingPatientID)
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
        const TotalOptions_local = {
          doctor_id: docs,
          nurse_id: nurses,
          box_id: boxes,
          patient_symptom: PatientSintoms
        }
        setTotalOptions(TotalOptions_local)
        const box = allBoxes?.find((box) => edditingPatient?.box_code.includes(box.box_code))
        if (box) setBoxOcupiedByPatient([box])

        const doctor = docs?.find((doctor) => doctor.user_name === edditingPatient?.doctor_name)

        const nurse = nurses?.find((nurse) => nurse.user_name === edditingPatient?.nurse_name)

        formInterfaz[IndiceObjeto(Formulario_estandar, 'doctor_id')].value = doctor || ''
        // formData[IndiceObjeto(Formulario_estandar, 'doctor_id')].value = doctor || ''

        formInterfaz[IndiceObjeto(Formulario_estandar, 'nurse_id')].value = nurse || ''
        // formData[IndiceObjeto(Formulario_estandar, 'nurse_id')].value = nurse || ''

        formInterfaz[IndiceObjeto(Formulario_estandar, 'box_id')].value = box || ''
        // formData[IndiceObjeto(Formulario_estandar, 'box_id')].value = box || ''
      } catch (error) {
        console.log(error)
      }
    }
    if (edditingPatient) {
      const fields = Formulario_estandar.map((field) => (field.key as string).trim())
      fields.forEach((field) => {
        const index = IndiceObjeto(Formulario_estandar, field)
        if (index !== -1 && edditingPatient[field] !== undefined) {
          formInterfaz[index].value = edditingPatient[field] || ''
          // formData[index].value = edditingPatient[field] || ''
        }
      })

      // For boolean fields
      const booleanFields = ['patient_isolated']
      booleanFields.forEach((field) => {
        const index = IndiceObjeto(Formulario_estandar, field)
        if (index !== -1 && edditingPatient[field] !== undefined) {
          formInterfaz[index].value = Boolean(edditingPatient[field])
          // formData[index].value = Boolean(edditingPatient[field])
        }
      })

      //formInterfaz.patient_medication = edditingPatient.patient_medication || ''
      asFun()
      console.log("FormInterfaz despues de recibir la informacion:\n", formInterfaz)

      const newDate = dayjs(edditingPatient.patient_age)
      setSelectedDate(newDate.toDate())
    }
  }, [edditingPatient])

  useEffect(() => {
    // Traer doctores, enfermeros y cajas disponibles
    const fetchDoctors = async () => {
      try {
        const data = await getAllDoctors()
        setDoctorOptions(data)
        return data
      } catch (error) {
        // console.error('Error:', error.message)
      }
    }
    const fetchNurses = async () => {
      try {
        const data = await getAllNurses()
        setNurseOptions(data)
        return data
      } catch (error) {
        // console.error('Error:', error.message)
      }
    }
    const fetchBoxes = async () => {
      try {
        const data = await getAvailableBoxes()
        setBoxesOptions(data)
        return data
      } catch (error) {
        // console.error('Error:', error.message)
      }
    }

    const fetchData = async () => {
      const [docs, nurses, boxes] = await Promise.all([fetchDoctors(), fetchNurses(), fetchBoxes()])
      const TotalOptions_local = {
        doctor_id: docs,
        nurse_id: nurses,
        box_id: boxes,
        patient_symptom: PatientSintoms
      }
      setTotalOptions(TotalOptions_local)
    }

    fetchData()
  }, [])

  //----------------------------------- USE EFFECTS SOCKETS ----------------------------------------
  useEffect(() => {
    const handleSocketEvent = (data: { patient: Patient; message: UpdateEvent }) => {
      const { patient_id } = data.patient
      console.log(patient_id)
      if (data.message === UpdateEvent.UPDATE_PATIENT) {
        toast.info('Nuevo paciente asignado', {
          action: {
            label: 'SE EDITO MISMO PACIENTES',
            onClick: () => {
              navigate(`/patients/${patient_id}`)
            }
          }
        })
      }
    }
    const setupSocket = () => {
      try {
        socket.on(`${edditingPatientID}`, handleSocketEvent)
      } catch (error) {
        console.error((error as Error).message)
      }
    }
    const cleanupSocket = () => {
      try {
        socket.off(`${edditingPatientID}`, handleSocketEvent)
      } catch (error) {
        console.error((error as Error).message)
      }
    }
    setupSocket()
    return cleanupSocket
  }, [token, edditingPatientID, socket, navigate])

  //-----------------------------------  VARIABLES OBTENIBLES DE BD ---------------------------------
  //TODO estos const deberían levantarse de la base de datos
  const PatientSintoms = [
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

  //-----------------------------------  HANDLERS ---------------------------------
  const handleButtonClick: React.MouseEventHandler<HTMLButtonElement> = (_event) => {
    const index_box = formInterfaz.findIndex((item) => item.key === 'box_id')
    if (!formInterfaz[index_box].value || formInterfaz[index_box].value === 'AFUERA') {
      handlerOtherTypes('patient_status', 'AFUERA')
      handlerOtherTypes('box_id', null)
    } else {
      handlerOtherTypes('patient_status', 'EN OBSERVACION')
    }

    const index_e_time = formInterfaz.findIndex((item) => item.key === 'patient_entry_time')
    if (!formInterfaz[index_e_time].value) handlerOtherTypes('patient_entry_time', new Date())

    handlerOtherTypes('patient_triage_time', new Date())

    //ESTOS ELEMENTOS SE LOS MODIFICA PARA QUE ALGUNA INFORMACION LE LLEGUE A LA BD
    const index_exit_time = formInterfaz.findIndex((item) => item.key === 'patient_exit_time')

    const index_healthcare_system = formInterfaz.findIndex(
      (item) => item.key === 'patient_healthcare_system'
    )
    const index_patient_isolated = formInterfaz.findIndex((item) => item.key === 'patient_isolated')

    const index_nurse_comment = formInterfaz.findIndex((item) => item.key === 'nurse_coment')

    if (!formInterfaz[index_exit_time].value) {
      handlerOtherTypes('patient_exit_time', null)
    }

    if (!formInterfaz[index_healthcare_system].value) {
      handlerOtherTypes('patient_healthcare_system', 'default')
    }

    if (!formInterfaz[index_nurse_comment].value) {
      handlerOtherTypes('nurse_coment', 'default')
    }

    if (!formInterfaz[index_patient_isolated].value) {
      handlerOtherTypes('patient_isolated', checked)
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [oldFormData] = useState<any>(formData)

  const handlerOtherTypes = (key: string, newValue: string | number | boolean | Date | null) => {
    const index = formInterfaz.findIndex((item) => item.key === key)
    if (index === -1) return formInterfaz

    const updatedFormInterfaz = [...formInterfaz]
    updatedFormInterfaz[index] = {
      ...updatedFormInterfaz[index],
      value: newValue !== null ? newValue.toString() : null
    }

    // console.log('Updated Form Interface before set:', updatedFormInterfaz)

    setformInterfaz(updatedFormInterfaz)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setFormData((prevFormData: any) => {
      const newFormData = {
        ...prevFormData,
        [key]: updatedFormInterfaz[index]?.formatdata
          ? updatedFormInterfaz[index]?.formatdata(updatedFormInterfaz[index]?.value)
          : updatedFormInterfaz[index]?.value
      }
      // console.log('Updated Form Data:', newFormData)
      return newFormData
    })
  }

  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  const handleSelectorInputChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const { name, value, id } = e.target as HTMLSelectElement & HTMLInputElement

    let OpcionSelecionada = null
    if ('selectedIndex' in e.target && 'options' in e.target) {
      OpcionSelecionada = e.target.options[e.target.selectedIndex].getAttribute('data-index')
        ? e.target.options[e.target.selectedIndex].getAttribute('data-index')
        : 'no hay data-index'
    }

    // console.log('e.target: ', e.target)
    // console.log(
    //   'Value pasado: \n',
    //   value,
    //   '\n id: \n',
    //   id,
    //   '\n name: \n',
    //   name,
    //   '\n data-index: \n',
    //   OpcionSelecionada
    // )

    setformInterfaz((prevFormInterfaz) => {
      const index = IndiceObjeto(prevFormInterfaz, id)
      if (index === -1) return prevFormInterfaz

      const updatedFormInterfaz = [...prevFormInterfaz]
      const updatedField = { ...updatedFormInterfaz[index] }
      let localValue = null
      if (name === 'select' && OpcionSelecionada !== null && TotalOptions !== null) {
        localValue = TotalOptions[id][OpcionSelecionada]
      } else if (name === 'input' || name === 'TriageComponent') {
        localValue = value
      }
      updatedField.value = localValue
      const localkey = updatedFormInterfaz[index].key
      //setFormData({ ...formData, localkey: updatedFormInterfaz[index].formatdata(localValue) })
      setFormData({
        ...formData,
        [localkey]: updatedFormInterfaz[index]?.formatdata
          ? updatedFormInterfaz[index]?.formatdata(localValue)
          : localValue
      })
      updatedFormInterfaz[index] = updatedField
      return updatedFormInterfaz
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    resetErrors()
    e.preventDefault()
    console.log('formData en el front antes de mandar: \n', formData)
    console.log('formInterfaz en el front antes de mandar: \n', formInterfaz)
    try {
      if (token) {
        if (edditingPatient) {
          const { currentData, newData } = await updateAnyPatient(
            edditingPatient.patient_id,
            formData
          )
          // console.log('Conflict Data:\n', { currentData, newData })
          // // Si newData != null significa que hubo un conflicto por lo tanto hay que solucionarlo
          if (newData && currentData) {
            console.log('Conflict Data:\n', { currentData, newData })
            setConflictData({ currentData, newData })
            setShowConflictModal(true)
          } else {
            toast.success('Paciente actualizado', { duration: 2000 })
            navigate('/patients')
          }

        } else {
          const { data, errors } = await addNewPatient(formData)
          if (errors) {
            console.error('Errores en el formulario al agregar nuevo paciente:', errors)
            toast.error('Error al intentar agregar un nuevo paciente', { duration: 2000 })
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
      console.error('Error al intentar agregar un nuevo paciente:\n')
      console.error(error)
    }
  }

  const resetForm = () => {
    setformInterfaz(Formulario_estandar)
    setFormData(null)
    setChecked(false)
    setSelectedDate(null)
    resetErrors()
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
  //--------------------------------------  Handler Conflictos -----------------------------------------
  const handleResolveConflict = (mergedData: Record<string, string>) => {
    //setformInterfaz(mergedData); ver como convertir la informacion de conflicto a formInterfaz
    setShowConflictModal(false)
    // Luego puedes enviar los datos merged al servidor
  }

  const handleAcceptCurrent = () => {
    if (conflictData) {
      //setformInterfaz(conflictData.currentData); ver como convertir la informacion de conflicto a formInterfaz
    }
    setShowConflictModal(false)
  }

  const handleCancel = () => {
    setShowConflictModal(false)
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
      <h2 className='text-2xl font-semibold mb-5'>
        {edditingPatient ? t('title.EditMode') : t('title.AddMode')}
      </h2>
      <form
        onSubmit={handleSubmit}
        className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'
      >
        {Object.entries(formInterfaz).map(([key, value]) => {
          if (!formInterfaz[key]?.label) return null
          const error = ErrorsForm[key as keyof typeof ErrorsForm]
          return (
            <div key={key}>
              <Label htmlFor={key}>
                {!edditingPatient &&
                  t(formInterfaz[key as keyof typeof formInterfaz]?.labelAlternativo)
                  ? t(formInterfaz[key as keyof typeof formInterfaz]?.labelAlternativo)
                  : t(formInterfaz[key as keyof typeof formInterfaz]?.label)}
              </Label>
              {/*Si el tipo de entry es modo INPUT*/}
              {(formInterfaz[key as keyof typeof formInterfaz]?.component_type === 'input' ||
                (formInterfaz[key as keyof typeof formInterfaz]?.component_type === 'DependsMode' &&
                  edditingPatient === null)) && (
                  <Input
                    error_active={ErrorsForm[formInterfaz[key].key]}
                    id={formInterfaz[key as keyof typeof formInterfaz].key.toString()}
                    name={'input'}
                    type={
                      formInterfaz[key as keyof typeof formInterfaz]?.component_type === 'DependsMode'
                        ? 'number'
                        : 'text'
                    }
                    value={
                      formInterfaz[key as keyof typeof formInterfaz]?.value == null // verifica si el valor es null o undefined
                        ? '' // si es null o undefined, establece el valor como cadena vacía
                        : formInterfaz[key as keyof typeof formInterfaz]?.format
                          ? formInterfaz[key as keyof typeof formInterfaz]?.format(
                            formInterfaz[key as keyof typeof formInterfaz]?.value,
                            true || null
                          )
                          : formInterfaz[key as keyof typeof formInterfaz]?.value
                    }
                    onChange={handleSelectorInputChange}
                  />
                )}

              {/*Si el tipo de entry es modo SELECT*/}
              {formInterfaz[key as keyof typeof formInterfaz]?.component_type === 'select' && (
                <Select
                  key={0}
                  error_active={ErrorsForm[formInterfaz[key].key]}
                  id={formInterfaz[key as keyof typeof formInterfaz].key}
                  name={'select'}
                  value={
                    formInterfaz[key as keyof typeof formInterfaz]?.value?.user_id ||
                    formInterfaz[key as keyof typeof formInterfaz]?.value?.box_id ||
                    formInterfaz[key as keyof typeof formInterfaz]?.value?._id ||
                    formInterfaz[key as keyof typeof formInterfaz]?.value?.name ||
                    formInterfaz[key as keyof typeof formInterfaz]?.value ||
                    ''
                  }
                  onChange={handleSelectorInputChange}
                >
                  <option value='' disabled className='bg-white opacity-100'>
                    Seleccionar{' '}
                    {t(formInterfaz[key as keyof typeof formInterfaz]?.label).toLowerCase()}
                  </option>
                  {TotalOptions &&
                    TotalOptions[formInterfaz[key].key]?.map(
                      (
                        option:
                          | string
                          | number
                          | boolean
                          | React.ReactElement<any, string | React.JSXElementConstructor<any>>
                          | Iterable<React.ReactNode>
                          | React.ReactPortal
                          | Iterable<React.ReactNode>
                          | null
                          | undefined,
                        index: number
                      ) => (
                        <option
                          value={option.user_id || option.box_id || (!edditingPatient&&option._id)|| option.name  }
                          data-index={index}
                          key={index + 1}
                          id={index.toString()}
                          className='bg-brown opacity-100'
                        >
                          {formInterfaz[key as keyof typeof formInterfaz]?.format
                            ? formInterfaz[key as keyof typeof formInterfaz]?.format(option)
                            : option}

                        </option>
                      )
                    )}
                </Select>
              )}

              {/*Si el tipo de entry es modo CHECKBOX*/}
              {formInterfaz[key as keyof typeof formInterfaz]?.component_type === 'checkbox' && (
                <Checkbox
                  id={formInterfaz[key as keyof typeof formInterfaz]?.key.toString()}
                  name={formInterfaz[key as keyof typeof formInterfaz]?.key.toString()}
                  color='success'
                  checked={formInterfaz[key as keyof typeof formInterfaz]?.format(
                    formInterfaz[key as keyof typeof formInterfaz]?.value
                  )}
                  sx={{ '& .MuiSvgIcon-root': { fontSize: 28 } }}
                  onChange={() =>
                    handlerOtherTypes(formInterfaz[key as keyof typeof formInterfaz]?.key, !checked)
                  }
                />
              )}

              {/*Si el tipo de entry es modo FECHA*/}
              {formInterfaz[key as keyof typeof formInterfaz]?.component_type === 'DependsMode' &&
                edditingPatient != null && (
                  <DatePickerMUI
                    onChangeExt={(date) =>
                      handlerOtherTypes(formInterfaz[key as keyof typeof formInterfaz]?.key, date)
                    }
                    //@ts-expect-error no se handlea el vento
                    selectedDateExt={selectedDate}
                    error_active={ErrorsForm.patient_age}
                    id={key as keyof typeof formInterfaz}
                    name={key}
                  />
                )}

              {/*Si el tipo de entry es el TRIAGE*/}
              {formInterfaz[key as keyof typeof formInterfaz]?.component_type ===
                'TriageComponent' && (
                  <div className='flex flex-grow gap-3 p-0.5'>
                    {TriageLevels.map((level) => (
                      <button
                        id={key as keyof typeof formInterfaz}
                        key={level._id}
                        name={key}
                        onClick={() =>
                          handlerOtherTypes(
                            formInterfaz[key as keyof typeof formInterfaz]?.key,
                            level._id
                          )
                        }
                        type='button'
                        className={`py-1 flex-grow border-4 ${formInterfaz[key as keyof typeof formInterfaz]?.value == level._id
                          ? 'border-black'
                          : 'border-transparent'
                          }`}
                        style={{ backgroundColor: `rgba(${level.color}, 0.6)` }}
                      >
                        {level.name}
                      </button>
                    ))}
                    {ErrorsForm.patient_triage_level.value && (
                      <span className='text-red-500'>{ErrorsForm.patient_triage_level.message}</span>
                    )}
                  </div>
                )}
            </div>
          )
        })}

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
      {/*--------------------- Modal de conflicto de datos ----------------------- */}
      {showConflictModal && conflictData && (
        <ConflictResolver
          conflictData={conflictData}
          onResolve={handleResolveConflict}
          onAcceptCurrent={handleAcceptCurrent}
          onCancel={handleCancel}
        />
      )}
    </div>
  )
}

export default PatientFormRefactorizado
