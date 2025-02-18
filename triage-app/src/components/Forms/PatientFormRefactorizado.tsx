// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { Field, Patient, PatientSymptom } from '@/interfaces/Patinet'
import { TriageLevel } from '@/interfaces/TriageLevel'
import { toast } from 'sonner'
import { User } from '@/interfaces/User'
import { Box, BoxStatus, BoxType } from '@/interfaces/Boxes'
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
import { Checkbox, Tooltip } from '@mui/material'
import React from 'react'
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
import { SocketContext } from '@/contex/SocketContext'
import { UpdateEvent } from '@/interfaces/Socket'
import WarningBox from '../ui/WarningBox'
import LoaderSpin from '../LoaderSpin'
import LoaderOverlay from '../ui/LoaderOverlay'
import { getAllSymptoms } from '@/services/symtomService'
import { getAllTriages } from '@/services/triageLevelsService'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons'

function PatientFormRefactorizado() {
  // Select states
  const [BoxesOptions, setBoxesOptions] = useState<Box[] | null>(null)
  const [BoxOcupiedByPatient, setBoxOcupiedByPatient] = useState<Box[] | null>(null)
  const [DoctorOptions, setDoctorOptions] = useState<User[] | null>(null)
  const [NurseOptions, setNurseOptions] = useState<User[] | null>(null)
  const [patientSymptoms, setPatientSymptoms] = useState<PatientSymptom[]>([])
  const [TriageLevels, setTriageLevel] = useState<TriageLevel[]>([])
  const [loadingIcon, setloadingIcon] = useState<boolean>(false)
  const [TotalOptions, setTotalOptions] = useState<{
    doctor_id: User[]
    nurse_id: User[]
    box_id: Box[]
    patient_symptom: PatientSymptom[]
  } | null>(null)
  // Checkbox state
  const [checked, setChecked] = React.useState(false)
  const [SeEditoMismoPaciente, setSeEditoMismoPaciente] = React.useState(false)
  // Edit states
  const { edditingPatientID } = useParams()
  const [edditingPatient, setedditingPatient] = useState<Patient | null>(null)
  // Conflict resolver states
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [conflictData, setConflictData] = useState<any>(null)
  const [showConflictModal, setShowConflictModal] = useState<boolean>(false)
  // Miscelaneous states
  const { t } = useTranslation('PatientForm')
  const navigate = useNavigate()

  const token = Cookies.get('authToken')

  const socket = useContext(SocketContext)
  //TODO: ver de recibir este elemento ya cargado desde el backend
  const hardcodedBox = {
    box_id: 'hardcoded-box-id',
    box_code: 'AFUERA',
    box_type: BoxType.OBSERVACION, // o el tipo que prefieras
    box_time: new Date().toISOString(),
    box_status: BoxStatus.LIBRE // o el estado que prefieras
  }
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
      formatdata: returnName4Database,
      isRequiredField: true
    },
    {
      key: 'patient_age',
      label: 'DateOfBirthLabel',
      labelAlternativo: 'AgeLabel',
      format: returnDependingModeAge,
      component_type: 'DependsMode',
      value: '' || null,
      handlerHelperFunction: null,
      formatdata: returnDate4Database,
      isRequiredField: true
    },
    {
      key: 'patient_symptom',
      label: 'PatientSymptom',
      labelAlternativo: null,
      format: returnSintomName,
      component_type: 'select',
      value: null,
      handlerHelperFunction: true,
      formatdata: returnSintomName,
      isRequiredField: true
    },
    {
      key: 'patient_entry_time',
      label: null,
      labelAlternativo: null,
      format: null,
      component_type: '',
      value: null,
      handlerHelperFunction: null,
      formatdata: returnNewDate,
      isRequiredField: false
    },
    {
      key: 'patient_exit_time',
      label: null,
      labelAlternativo: null,
      format: null,
      component_type: '',
      value: null,
      handlerHelperFunction: null,
      formatdata: null,
      isRequiredField: false
    },
    {
      key: 'patient_triage_time',
      label: null,
      labelAlternativo: null,
      format: null,
      component_type: '',
      value: null,
      handlerHelperFunction: null,
      formatdata: returnNewDate,
      isRequiredField: false
    },
    {
      key: 'patient_triage_level',
      label: 'TriageLevelLabel',
      labelAlternativo: null,
      format: returnPatientTriageNumber,
      component_type: 'TriageComponent',
      value: null,
      handlerHelperFunction: null,
      formatdata: null,
      isRequiredField: true
    },
    {
      key: 'doctor_id',
      label: 'DoctorNameLabel',
      labelAlternativo: null,
      format: returnDoctorName,
      component_type: 'select',
      value: null,
      handlerHelperFunction: null,
      formatdata: returnDoctorId,
      isRequiredField: true
    },
    {
      key: 'nurse_id',
      label: 'NurseNameLabel',
      labelAlternativo: null,
      format: returnNurseName,
      component_type: 'select',
      value: null,
      handlerHelperFunction: null,
      formatdata: returnNurseId,
      isRequiredField: true
    },
    {
      key: 'patient_isolated',
      label: 'PatientIsolation',
      labelAlternativo: null,
      format: returnBoolean,
      component_type: 'checkbox',
      value: null,
      handlerHelperFunction: null,
      formatdata: returnBoolean,
      isRequiredField: false
    },
    {
      key: 'patient_status',
      label: '',
      labelAlternativo: null,
      format: returnEstado,
      component_type: 'select',
      value: null,
      handlerHelperFunction: null,
      formatdata: returnEstado,
      isRequiredField: false
    },
    {
      key: 'patient_healthcare_system',
      label: 'patient_healthcare_system',
      labelAlternativo: null,
      format: null,
      component_type: 'input',
      value: null,
      handlerHelperFunction: null,
      formatdata: null,
      isRequiredField: false
    },
    {
      key: 'box_id',
      label: 'BoxIDLabel',
      labelAlternativo: null,
      format: returnBoxCode,
      component_type: 'select',
      value: null,
      handlerHelperFunction: null,
      formatdata: returnBoxID,
      isRequiredField: false
    },
    {
      key: 'nurse_coment',
      label: 'NurseComent',
      labelAlternativo: null,
      format: null,
      component_type: 'input',
      value: null,
      handlerHelperFunction: null,
      formatdata: null,
      isRequiredField: false
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
        const PatientSintoms = await getAllSymptoms()
        setDoctorOptions(docs)
        setNurseOptions(nurses)
        setBoxesOptions(boxes)
        ActualizarTotalOptions(docs, nurses, boxes, PatientSintoms.data)

        const doctor = docs?.find((doctor) => doctor.user_name === edditingPatient?.doctor_name)

        const nurse = nurses?.find((nurse) => nurse.user_name === edditingPatient?.nurse_name)

        formInterfaz[IndiceObjeto(Formulario_estandar, 'doctor_id')].value = doctor || ''

        formInterfaz[IndiceObjeto(Formulario_estandar, 'nurse_id')].value = nurse || ''

        console.log('Informacion recibida:\n', edditingPatient)
        if (edditingPatient?.box_code) {
          const box = allBoxes?.find((box) => edditingPatient?.box_code.includes(box.box_code))
          if (box) ActualizarTotalOptions(null, null, box, null)
          // console.log("Box encontrado: \n",box)
          formInterfaz[IndiceObjeto(Formulario_estandar, 'box_id')].value = box || ''
        } else {
          if (TotalOptions) {
            setBoxOcupiedByPatient(TotalOptions['box_id'][0])
            formInterfaz[IndiceObjeto(Formulario_estandar, 'box_id')].value =
              TotalOptions['box_id'][0]
          }
        }
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
      console.log('FormInterfaz despues de recibir la informacion:\n', formInterfaz)

      const newDate = dayjs(edditingPatient.patient_age)
      setSelectedDate(newDate?.toDate())
    }
  }, [edditingPatient])

  useEffect(() => {
    // Traer doctores, enfermeros y cajas disponibles
    const fetchDoctors = async () => {
      try {
        const data = await getAllDoctors()
        return data
      } catch (error) {
        // console.error('Error:', error.message)
      }
    }
    const fetchNurses = async () => {
      try {
        const data = await getAllNurses()
        return data
      } catch (error) {
        // console.error('Error:', error.message)
      }
    }
    const fetchBoxes = async () => {
      try {
        const data = await getAvailableBoxes()
        return data
      } catch (error) {
        // console.error('Error:', error.message)
      }
    }
    const fetchSymptoms = async () => {
      try {
        const response = await getAllSymptoms()
        if (response.success && response.data) {
          const formattedSymptoms = response.data.map((symptom) => ({
            _id: symptom._id, // Asume que `id` es la propiedad del backend
            name: symptom.name
          }))
          return formattedSymptoms
        } else {
          console.error('Error al obtener síntomas:', response.message)
          return []
        }
      } catch (error) {
        console.error('Error desconocido al obtener síntomas:', error)
        return []
      }
    }

    const fetchTriageLevels = async () => {
      try {
        const response = await getAllTriages()
        if (response.success && response.data) {
          return response.data
        } else {
          console.error('Error al obtener niveles de triaje:', response.message)
          return []
        }
      } catch (error) {
        console.error('Error desconocido al obtener niveles de triaje:', error)
        return []
      }
    }

    const fetchData = async () => {
      const [docs, nurses, boxes, PatientSintoms, triageLevels] = await Promise.all([
        fetchDoctors(),
        fetchNurses(),
        fetchBoxes(),
        fetchSymptoms(),
        fetchTriageLevels()
      ])
      ActualizarTotalOptions(docs, nurses, boxes, PatientSintoms)
      setTriageLevel(triageLevels)
    }

    fetchData()
  }, [])

  //----------------------------------- USE EFFECTS SOCKETS ----------------------------------------
  useEffect(() => {
    const handleSocketEvent = (data: { patient: Patient; message: UpdateEvent }) => {
      const { patient_id } = data.patient
      console.log(patient_id)
      if (data.message === UpdateEvent.UPDATE_PATIENT) {
        setSeEditoMismoPaciente(true)
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

  //-----------------------------------  HANDLERS ---------------------------------
  const handleButtonClick: React.MouseEventHandler<HTMLButtonElement> = (_event) => {
    setloadingIcon(true)
    const index_box = formInterfaz.findIndex((item) => item.key === 'box_id')
    if (
      !formInterfaz[index_box].value ||
      formInterfaz[index_box].value === 'AFUERA' ||
      formInterfaz[index_box].value?.box_id === 'hardcoded-box-id'
    ) {
      console.log('Entro al handle AFUERA')
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
      handlerOtherTypes('patient_healthcare_system', 'N/A')
    }

    if (!formInterfaz[index_nurse_comment].value) {
      handlerOtherTypes('nurse_coment', 'N/A')
    }

    if (!formInterfaz[index_patient_isolated].value) {
      handlerOtherTypes('patient_isolated', checked)
    }
    //TODO: Elimiar el box Selecionado
  }

  const handlerOtherTypes = (key: string, newValue: string | number | boolean | Date | null) => {
    const index = formInterfaz.findIndex((item) => item.key === key)
    if (index === -1) return formInterfaz

    const updatedFormInterfaz = [...formInterfaz]
    updatedFormInterfaz[index] = {
      ...updatedFormInterfaz[index],
      value: newValue !== null ? newValue.toString() : null
    }

    console.log('Updated Form Interface before set:', updatedFormInterfaz)

    setformInterfaz(updatedFormInterfaz)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setFormData((prevFormData: any) => {
      const newFormData = {
        ...prevFormData,
        [key]: updatedFormInterfaz[index]?.formatdata
          ? updatedFormInterfaz[index]?.formatdata(updatedFormInterfaz[index]?.value)
          : updatedFormInterfaz[index]?.value
      }
      console.log('Updated Form Data:', newFormData)
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = async (e: React.FormEvent, merge?: any) => {
    resetErrors()
    e.preventDefault()

    const updatedFormData = merge ? merge : formData
    console.log('updatedFormData en el front antes de mandar: \n', updatedFormData)
    console.log(updatedFormData.patient_age)
    console.log('formInterfaz en el front antes de mandar: \n', formInterfaz)
    try {
      if (token) {
        if (edditingPatient) {
          const { currentData, newData } = await updateAnyPatient(
            edditingPatient.patient_id,
            updatedFormData
          )
          setloadingIcon(false)
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
          const { data, errors } = await addNewPatient(updatedFormData)
          setloadingIcon(false)
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
      setloadingIcon(false)
      toast.error('Error al intentar agregar un nuevo paciente', { duration: 2000 })
      console.error('Error al intentar agregar un nuevo paciente:\n')
      console.error(error)
    }
  }

  const resetForm = () => {
    const boxToRemove = formData['box_id']
    const updatedBoxList = TotalOptions?.box_id.filter((box) => box.box_id !== boxToRemove)
    ActualizarTotalOptions(null, null, updatedBoxList, null)
    setformInterfaz(Formulario_estandar)
    setFormData(null)
    setChecked(false)
    setSelectedDate(null)
    resetErrors()
  }

  //----------------------------------------------  Actualizacion de las opciones-----------------------
  function ActualizarTotalOptions(
    docs: User | User[] | null = [],
    nurses: User | User[] | null = [],
    boxes: Box | Box[] | null = [],
    PatientSintoms: PatientSymptom | PatientSymptom[] | null = []
  ) {
    setTotalOptions((prevOptions) => {
      // Si prevOptions no existe, inicializa las opciones con los valores actuales
      if (!prevOptions) {
        return {
          doctor_id: docs ? (Array.isArray(docs) ? docs : [docs]) : [],
          nurse_id: nurses ? (Array.isArray(nurses) ? nurses : [nurses]) : [],
          box_id: boxes
            ? [hardcodedBox, ...(Array.isArray(boxes) ? boxes : [boxes])]
            : [hardcodedBox],
          patient_symptom: PatientSintoms
            ? Array.isArray(PatientSintoms)
              ? PatientSintoms
              : [PatientSintoms]
            : []
        }
      }

      // Si se pasa un array, se reemplaza la lista previa, de lo contrario, se agrega el objeto
      const newDocs = Array.isArray(docs)
        ? docs
        : docs
        ? [...prevOptions.doctor_id, docs]
        : prevOptions.doctor_id
      const newNurses = Array.isArray(nurses)
        ? nurses
        : nurses
        ? [...prevOptions.nurse_id, nurses]
        : prevOptions.nurse_id
      const newBoxes = Array.isArray(boxes)
        ? [hardcodedBox, ...boxes]
        : boxes
        ? [...prevOptions.box_id, boxes]
        : prevOptions.box_id
      const newPatientSymptoms = Array.isArray(PatientSintoms)
        ? PatientSintoms
        : PatientSintoms
        ? [...prevOptions.patient_symptom, PatientSintoms]
        : prevOptions.patient_symptom

      return {
        doctor_id: newDocs,
        nurse_id: newNurses,
        box_id: newBoxes,
        patient_symptom: newPatientSymptoms
      }
    })
  }

  //--------------------------------------  Handler Conflictos -----------------------------------------
  const handleResolveConflict = (mergedData: Record<string, string>) => {
    console.log('MERGED DATA:\n', mergedData)
    const updatedFormData = {
      ...formData,
      ...mergedData,
      Merge_Complete: showConflictModal,
      patient_triage_time: new Date()
    }
    handleSubmit(new Event('submit') as unknown as React.FormEvent, updatedFormData)
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
      message: `${
        edditingPatient ? 'Seleccione una fecha válida' : 'Seleccione una edad válida (0 a 140 años'
      }`
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
      {SeEditoMismoPaciente && (
        <WarningBox message={'EditedUser'} shouldStopCounter={showConflictModal}></WarningBox>
      )}
      {loadingIcon && (
        <div className='flex justify-center items-center'>
          <LoaderOverlay loadingMessage={t('AddingPatient')} />
        </div>
      )}
      <form
        onSubmit={handleSubmit}
        className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'
      >
        {Object.entries(formInterfaz).map(([key, value]) => {
          if (!formInterfaz[key]?.label) return null
          const error = ErrorsForm[key as keyof typeof ErrorsForm]
          return (
            <div key={key}>
              <div className='flex justify-between items-center'>
                <Label htmlFor={key}>
                  {!edditingPatient &&
                  t(formInterfaz[key as keyof typeof formInterfaz]?.labelAlternativo)
                    ? t(formInterfaz[key as keyof typeof formInterfaz]?.labelAlternativo)
                    : t(formInterfaz[key as keyof typeof formInterfaz]?.label)}
                </Label>
                {(formInterfaz[key as keyof typeof formInterfaz] as Field)?.isRequiredField && (
                  <>
                    <Tooltip title={t('RequiredField')}>
                      <FontAwesomeIcon
                        icon={faInfoCircle}
                        style={{ color: 'red', marginLeft: '5px', cursor: 'pointer' }}
                      />
                    </Tooltip>
                  </>
                )}
              </div>
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
                          // eslint-disable-next-line @typescript-eslint/no-explicit-any
                          | React.ReactElement<any, string | React.JSXElementConstructor<any>>
                          | Iterable<React.ReactNode>
                          | React.ReactPortal
                          | Iterable<React.ReactNode>
                          | null
                          | undefined,
                        index: number
                      ) => (
                        <option
                          value={
                            option.user_id ||
                            option.box_id ||
                            (!edditingPatient && option._id) ||
                            option.name
                          }
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
                  onChange={() => {
                    setChecked((prevChecked) => {
                      const newChecked = !prevChecked
                      handlerOtherTypes(
                        formInterfaz[key as keyof typeof formInterfaz]?.key,
                        newChecked
                      )
                      return newChecked
                    })
                  }}
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
                <div className='flex flex-col'>
                  <div className='flex flex-grow gap-3 p-0.5'>
                    {TriageLevels.map((level) => (
                      <button
                        id={key as keyof typeof formInterfaz}
                        key={level.id}
                        name={key}
                        onClick={() =>
                          handlerOtherTypes(
                            formInterfaz[key as keyof typeof formInterfaz]?.key,
                            level.level
                          )
                        }
                        type='button'
                        className={`py-1 flex-grow border-4 ${
                          formInterfaz[key as keyof typeof formInterfaz]?.value == level.level
                            ? 'border-black'
                            : 'border-transparent'
                        }`}
                        style={{ backgroundColor: `rgba(${level.color}, 0.6)` }}
                      >
                        {level.level}
                      </button>
                    ))}
                  </div>
                  {ErrorsForm.patient_triage_level.value && (
                    <span className='text-red-500'>{ErrorsForm.patient_triage_level.message}</span>
                  )}
                </div>
              )}
            </div>
          )
        })}

        <div className='flex items-end gap-4 '>
          {edditingPatient ? (
            formData &&
            !Object.keys(edditingPatient).every(
              (key) => formData[key] === edditingPatient[key] || formData[key] == null
            ) ? (
              <Button type='submit' color='green' onClick={handleButtonClick}>
                {edditingPatient ? t('SavePatientButton') : t('AddNewPatientButton')}
              </Button>
            ) : (
              <Link to={`/patients`}>
                <Button type='button' color='grey'>
                  {edditingPatient ? t('SavePatientButton') : t('AddNewPatientButton')}
                </Button>
              </Link>
            )
          ) : (
            <Button type='submit' color='green' onClick={handleButtonClick}>
              {edditingPatient ? t('SavePatientButton') : t('AddNewPatientButton')}
            </Button>
          )}
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
          onCancel={handleCancel}
        />
      )}
    </div>
  )
}

export default PatientFormRefactorizado
