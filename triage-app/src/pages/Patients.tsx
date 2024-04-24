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

interface ColourOption {
  readonly value: string
  readonly label: string
  readonly item?: string
  readonly color: string
  readonly isFixed?: boolean
  readonly isDisabled?: boolean
}

interface Option {
  readonly label: string
  readonly options: ColourOption[]
}
const predefinedOption: ColourOption = {
  value: 'patient_status',
  item: 'TODOS MENOS ALTA',
  label: 'TODOS MENOS ALTA',
  color: '#525252',
  isFixed: true
}
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
      {
        value: 'patient_status',
        item: 'EN ESPERA DE INTERNACION',
        label: 'EN ESPERA DE INTERNACION',
        color: '#525252'
      },
      {
        value: 'patient_status',
        item: 'EN INTERNACION',
        label: 'EN INTERNACION',
        color: '#525252'
      },
      { value: 'patient_status', item: 'AFUERA', label: 'AFUERA', color: '#525252' },
      {
        value: 'patient_status',
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
      { value: 'type_user', label: 'ALL', color: '#525252' },
      { value: 'type_user', label: 'MINE', color: '#525252' }
    ]
  }
]

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
      cursor: isDisabled ? 'not-allowed' : 'default',

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

function Patients() {
  const socket = useContext(SocketContext)
  const token = Cookies.get('authToken')
  const [patientsData, setPatientsData] = useState<Patient[] | null>(null)
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [filteredPatients, setFilteredPatients] = useState<Patient[] | null>(null)
  const [RawData, setRawData] = useState<Patient[] | null>(null)

  //hardoceado ver como obtenerlo de otra forma
  const onChangeSelect = (selectedOptions: MultiValue<ColourOption>) => {
    // Filtrar patientsData
    if (RawData) {
      const filteredData = RawData.filter((patient) => {
        // Verificar si el paciente cumple con todas las opciones seleccionadas
        return selectedOptions.every((option) => {
          if (option.item === 'TODOS' || option.item === '1-4') {
            return patient[option.value]
          }
          if (option.item === 'TODOS MENOS ALTA') {
            if (patient[option.value] != 'ALTA') {
              return patient[option.value]
            }
          } else if (option.item === 'MINE') {
            // Verificar si el paciente tiene el doctor_name igual a 'Dr. Smith'
            return patient.doctor_name === 'Dr. Smith'
          }
          // Comprobar si el paciente tiene el valor de la opción seleccionada
          return patient[option.value].toString() === option.item
        })
      })
      setPatientsData(filteredData)
      setFilteredPatients(filteredData)
    }
  }

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
          setPatientsData(sortedData)
        }
      } catch (error) {
        console.error((error as Error).message)
      }
    }
    fetchData()
  }, [token])

  useEffect(() => {
    const token = Cookies.get('authToken')
    const fetchData = async () => {
      try {
        if (token) {
          const data = await getPatients()
          const sortedData = data.sort((a, b) => {
            return new Date(b.entry_time).getTime() - new Date(a.entry_time).getTime()
          })
          setRawData(sortedData)
          setPatientsData(sortedData)
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
  }, [socket])

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
