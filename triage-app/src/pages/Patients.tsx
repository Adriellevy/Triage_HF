import { useContext, useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import Select, { StylesConfig, MultiValue } from 'react-select'
import chroma from 'chroma-js'
import PatientsList from '@/components/PatientList/PatientsList'
import Search from '@/components/Search'
import { getPatients } from '../services/patientService'
import { Patient } from '../interfaces/Patinet'
import { SocketContext } from '@/contex/SocketContext'
import { SocketEvent, UpdateEvent } from '@/interfaces/Socket'
import { User } from '@/interfaces/User'
import { Navigate, useNavigate } from 'react-router-dom'
import { UserRole } from '@/interfaces/User'
import { ColourOption } from '@/interfaces/PatientList'
import { Option } from '@/interfaces/PatientList'
import { filterPatients } from '@/helpers/HelperPatientList'

const colourStyles: StylesConfig<ColourOption, true> = {
  control: (styles) => ({ ...styles, backgroundColor: 'white' }),
  option: (styles, { data, isDisabled, isFocused, isSelected }) => {
    const color = chroma(data.color)
    return {
      ...styles,
      backgroundColor: isDisabled
        ? undefined
        : isSelected
        ? data.color
        : isFocused
        ? color.alpha(0.1).css()
        : undefined,
      color: isDisabled
        ? '#ccc'
        : isSelected
        ? chroma.contrast(color, 'white') > 2
          ? 'white'
          : 'black'
        : data.color,
      cursor: isDisabled ? 'not-TODOSowed' : 'default',

      ':active': {
        ...styles[':active'],
        backgroundColor: !isDisabled
          ? isSelected
            ? data.color
            : color.alpha(0.3).css()
          : undefined
      }
    }
  },
  multiValue: (styles, { data }) => {
    const color = chroma(data.color)
    return {
      ...styles,
      backgroundColor: color.alpha(0.1).css()
    }
  },
  multiValueLabel: (styles, { data }) => ({
    ...styles,
    color: data.color
  }),
  multiValueRemove: (styles, { data }) => ({
    ...styles,
    color: data.color,
    ':hover': {
      backgroundColor: data.color,
      color: 'white'
    }
  })
}

const SearchOption = [
  {
    value: 'name',
    text: 'Name'
  },
  {
    value: 'date_of_birth',
    text: 'Date of Birth'
  }
]

const options: Option[] = [
  {
    label: 'TRIAGE LEVEL',
    options: [
      { value: 'patient_triage_level', item: '1', label: 'Triage Level 1', color: '#bdbebe' },
      { value: 'patient_triage_level', item: '2', label: 'Triage Level 2', color: '#FF3300' },
      { value: 'patient_triage_level', item: '3', label: 'Triage Level 3', color: '#CCCC52' },
      { value: 'patient_triage_level', item: '4', label: 'Triage Level 4', color: '#69A84F' },
      {
        value: 'patient_triage_level',
        item: '1-4',
        label: 'Triage Level 1-4',
        color: '#5243AA',
        isFixed: true
      }
    ]
  },
  {
    label: 'PATIENT STATE',
    options: [
      { value: 'patient_status', item: 'EN ESPERA', label: 'EN ESPERA', color: '#525252' },
      { value: 'patient_status', item: 'AFUERA', label: 'AFUERA', color: '#525252' },
      {
        value: 'patient_isolated',
        item: 'EN AISLAMIENTO',
        label: 'EN AISLAMIENTO',
        color: '#525252'
      },
      { value: 'patient_status', item: 'ALTA', label: 'ALTA', color: '#525252' },
      {
        value: 'patient_status',
        item: 'TODOS MENOS ALTA',
        label: 'TODOS MENOS ALTA',
        color: '#525252'
      },
      { value: 'patient_status', item: 'TODOS', label: 'TODOS', color: '#525252' }
    ]
  },
  {
    label: 'From Who',
    options: [
      { value: 'type_user', label: 'TODOS', color: '#525252' },
      { value: 'type_user', label: 'MÍOS', color: '#525252' }
    ]
  }
]
function Patients({ actual_user, role }: { actual_user: User; role: UserRole }) {
  const socket = useContext(SocketContext)
  const token = Cookies.get('authToken')
  const [patientsData, setPatientsData] = useState<Patient[] | null>(null)
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [filteredPatients, setFilteredPatients] = useState<Patient[] | null>(null)
  const [RawData, setRawData] = useState<Patient[] | null>(null)
  const [hasExecuted, setHasExecuted] = useState(false)
  // Verifica si el rol del usuario es DOCTOR y agrega la opción "MÍOS"
  // Verifica si el rol del usuario es DOCTOR y agrega la opción "MÍOS"
  const predefinedOptionsVar: ColourOption[] = [
    {
      value: 'patient_status',
      item: 'TODOS MENOS ALTA',
      label: 'TODOS MENOS ALTA',
      color: '#525252',
      isFixed: true
    }
  ]

  if (role === UserRole.DOCTOR) {
    predefinedOptionsVar.push({
      value: 'type_user',
      item: 'MÍOS',
      label: 'MÍOS',
      color: '#525252',
      isFixed: true
    })
  }

  const [predefinedOptions, setPredefinedOptions] = useState<ColourOption[]>(predefinedOptionsVar)

  //hardoceado ver como obtenerlo de otra forma

  const onChangeSelect = (selectedOptions: MultiValue<ColourOption>) => {
    console.log('predefined options debería cambiar a:\n', selectedOptions)
    setPredefinedOptions(selectedOptions as ColourOption[])
    if (RawData) {
      const filteredData = filterPatients(RawData, selectedOptions, searchTerm, 'name', actual_user)
      setPatientsData(filteredData)
      setFilteredPatients(filteredData)
    }
  }

  useEffect(() => {
    const token = Cookies.get('authToken')
    const fetchData = async () => {
      try {
        if (token) {
          const data = await getPatients()
          const sortedData = data.sort((a, b) => {
            return new Date(b.entry_time).getTime() - new Date(a.entry_time).getTime()
          })
          console.log('Predifined Options em use efect', predefinedOptions)
          const filteredPatients = filterPatients(
            sortedData,
            predefinedOptions,
            searchTerm,
            'name',
            actual_user
          )
          setRawData(sortedData)
          setPatientsData(filteredPatients)
        }
      } catch (error) {
        console.error((error as Error).message)
      }
    }
    if (socket) {
      socket.on(SocketEvent.UPDATE, (data) => {
        if (data.message == UpdateEvent.NEW_PATIENT || data.message == UpdateEvent.UPDATE_PATIENT) {
          fetchData()
        }
      })
      return () => {
        socket.off(SocketEvent.UPDATE)
      }
    }
  }, [socket, predefinedOptions])

  const handleonSearch = ({ term, by }: { term: string; by: string }) => {
    setSearchTerm(term)
    const filterOptions: Record<string, (patient: Patient) => boolean> = {
      name: (patient) => patient.patient_name.toLowerCase().includes(term.toLowerCase()),
      date_of_birth: () => false
    }
    const filtered = patientsData?.filter((patient) => {
      const filterFunction = filterOptions[by]
      return filterFunction(patient)
    })
    if (filtered?.length === 0 || filtered === undefined) setFilteredPatients(null)
    else setFilteredPatients(filtered)
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (token) {
          const data = await getPatients()
          const sortedData = data.sort((a, b) => {
            return new Date(b.entry_time).getTime() - new Date(a.entry_time).getTime()
          })
          setRawData(sortedData)
          if (!hasExecuted) {
            setHasExecuted(true)
            const initialFilteredData = filterPatients(
              sortedData,
              predefinedOptions,
              searchTerm,
              'name',
              actual_user
            )
            setPatientsData(initialFilteredData)
            setFilteredPatients(initialFilteredData)
          } else {
            setPatientsData(sortedData)
          }
        }
      } catch (error) {
        console.error((error as Error).message)
      }
    }
    fetchData()
  }, [token])

  return (
    <div className='bg-white pb-4'>
      <div>
        <Search onSearch={handleonSearch} options={SearchOption} />
        <div className='bg-white pl-4 pr-4'>
          <label className='text-sm font-medium text-gray-700 mb-2'>Patient filters:</label>
          <Select
            className='w-full'
            options={options}
            isMulti
            closeMenuOnSelect={true}
            onChange={onChangeSelect}
            styles={colourStyles}
            defaultValue={predefinedOptions}
          />
        </div>
      </div>

      {searchTerm === '' && patientsData ? (
        <PatientsList patients={patientsData} />
      ) : searchTerm !== '' && filteredPatients ? (
        <PatientsList patients={filteredPatients} />
      ) : (
        <p>No se encontraron pacientes.</p>
      )}
    </div>
  )
}

export default Patients
