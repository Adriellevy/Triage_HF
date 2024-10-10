import { useContext, useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import { StylesConfig, MultiValue } from 'react-select'
import chroma from 'chroma-js'
import PatientsList from '@/components/PatientList/PatientsList'
import {
  getFilteredPatients,
  getPaginatedPatients,
  getPatientByName,
  getPatientsByDate
} from '../services/patientService'
import { Patient } from '../interfaces/Patinet'
import { SocketContext } from '@/contex/SocketContext'
import { User } from '@/interfaces/User'
import { UserRole } from '@/interfaces/User'
import { ColourOption } from '@/interfaces/PatientList'
import { Option } from '@/interfaces/PatientList'
import { filterPatients } from '@/helpers/HelperPatientList'
import PatientSearchBar from '@/components/PatientSearch/PatientSearchBar'
import PatientByDatePicker from '@/components/PatientSearch/PatientByDatePicker'
import dayjs, { Dayjs } from 'dayjs'
import FilterPatientsComponent from '@/components/PatientSearch/FilterPatientsComponent'
import SearchTypeSelector from '@/components/PatientSearch/SearchTypeSelector'

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
  // {
  //   label: 'TRIAGE LEVEL',
  //   options: [
  //     { value: 'patient_triage_level', item: '1', label: 'Triage Level 1', color: '#bdbebe' },
  //     { value: 'patient_triage_level', item: '2', label: 'Triage Level 2', color: '#FF3300' },
  //     { value: 'patient_triage_level', item: '3', label: 'Triage Level 3', color: '#CCCC52' },
  //     { value: 'patient_triage_level', item: '4', label: 'Triage Level 4', color: '#69A84F' },
  //   ]
  // },
  {
    label: 'Estado del paciente',
    options: [
      {
        value: 'patient_status',
        item: 'EN OBSERVACION',
        label: 'EN OBSERVACION',
        color: '#525252'
      },
      { value: 'patient_status', item: 'AFUERA', label: 'AFUERA', color: '#525252' },
      { value: 'patient_status', item: 'ALTA', label: 'ALTA', color: '#525252' },
      {value: 'patient_status', item: 'TODOS MENOS ALTA', label: 'TODOS MENOS ALTA', color: '#525252'},
      { value: 'patient_status', item: 'TODOS', label: 'TODOS', color: '#525252' }
    ]
  },
  {
    label: 'Esta aislado?',
    options: [
      {
        value: 'patient_isolated',
        item: 'EN AISLAMIENTO',
        label: 'EN AISLAMIENTO',
        color: '#525252'
      }
    ]
  },
  {
    label: 'De quien?',
    options: [{ value: 'type_user', label: 'MÍOS', color: '#525252' }]
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
  const [currentPage, setCurrentPage] = useState(1)
  const [dataBatch, setDataBatch] = useState([])
  const [searchName, setSearchName] = useState('')
  const [refreshSearch, setrefreshSearch] = useState(false)
  const [filterOptions, setfilterOptions] = useState<ColourOption[]>([])
  const [startDate, setStartDate] = useState<Dayjs | null>(null)
  const [endDate, setEndDate] = useState<Dayjs | null>(null)
  const [selectedOptions, setselectedOptions] = useState<ColourOption[]>([])
  const [searchType, setSearchType] = useState('Nombre')
  const [animation, setAnimation] = useState('')
  // Verifica si el rol del usuario es DOCTOR y agrega la opción "MÍOS"
  // Verifica si el rol del usuario es DOCTOR y agrega la opción "MÍOS"
  // const predefinedOptionsVar: ColourOption[] = [
  //   {
  //     value: 'patient_status',
  //     item: 'TODOS MENOS ALTA',
  //     label: 'TODOS MENOS ALTA',
  //     color: '#525252',
  //     isFixed: true
  //   }
  // ]

  // if (role === UserRole.DOCTOR) {
  //   predefinedOptionsVar.push({
  //     value: 'type_user',
  //     item: 'MÍOS',
  //     label: 'MÍOS',
  //     color: '#525252',
  //     isFixed: true
  //   })
  // }

  const [predefinedOptions, setPredefinedOptions] = useState<ColourOption[]>([])

  //hardoceado ver como obtenerlo de otra forma

  const onChangeSelect = (selectedOptions: MultiValue<ColourOption>) => {
    setfilterOptions(selectedOptions as ColourOption[])
  }

  // useEffect(() => {
  //   const token = Cookies.get('authToken')
  //   const fetchData = async () => {
  //     try {
  //       if (token) {
  //         const batch = Math.ceil(currentPage / 3);
  //         if(!(filteredDataBatch.includes(batch))) {
  //           const data = await getPaginatedPatients(batch)
  //           const sortedData = data.sort((a, b) => {
  //             return new Date(b.entry_time).getTime() - new Date(a.entry_time).getTime()
  //             console.log('Predifined Options em use efect', predefinedOptions)
  //           })
  //           setRawData(sortedData)
  //           const filteredPatients = filterPatients(
  //             sortedData,
  //             predefinedOptions,
  //             searchTerm,
  //             'name',
  //             actual_user
  //           )
  //           setPatientsData([...patientsData, ...filteredPatients])
  //           setfilteredDataBatch([...dataBatch, batch])
  //         }
  //       }
  //     } catch (error) {
  //       console.error((error as Error).message)
  //     }
  //   }
  //   if (socket) {
  //     socket.on(SocketEvent.UPDATE, (data) => {
  //       if (data.message == UpdateEvent.NEW_PATIENT || data.message == UpdateEvent.UPDATE_PATIENT) {
  //         fetchData()
  //       }
  //     })
  //     return () => {
  //       socket.off(SocketEvent.UPDATE)
  //     }
  //   }
  // }, [socket, predefinedOptions])

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (token) {
          const batch = Math.ceil(currentPage / 2)
          if (!dataBatch.includes(batch)) {
            const data = await getPaginatedPatients(batch)
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
              setPatientsData([...patientsData, ...sortedData])
            }
            setDataBatch([...dataBatch, batch])
          }
        }
      } catch (error) {
        console.error((error as Error).message)
      }
    }
    fetchData()
  }, [token, currentPage, refreshSearch])

  const searchPatientByName = async (name) => {
    const data = await getPatientsByDate(
      dayjs().subtract(2, 'week').toISOString(),
      dayjs().toISOString()
    )
    console.log(data)
    const dataByName = data.filter((patient) =>
      patient.patient_name.toLowerCase().includes(name.toLowerCase())
    )
    console.log(dataByName)
    const sortedData = dataByName.sort((a, b) => {
      return new Date(b.entry_time).getTime() - new Date(a.entry_time).getTime()
    })
    setRawData(sortedData)
    setPatientsData(sortedData)
    setCurrentPage(1)
  }

  const searchPatientByDate = async ([startDate, endDate]) => {
    console.log(startDate)
    console.log(endDate)
    const data = await getPatientsByDate(startDate, endDate)
    const sortedData = data.sort((a, b) => {
      return new Date(b.entry_time).getTime() - new Date(a.entry_time).getTime()
    })
    setRawData(sortedData)
    setPatientsData(sortedData)
    setCurrentPage(1)
  }

  const clearData = () => {
    setDataBatch([])
    setPatientsData([])
    setrefreshSearch(!refreshSearch)
    setSearchName('')
  }

  const filterPatientsTrigger = async (ops) => {
    console.log(ops)
    if (ops.length === 0) {
      clearData() // Llama a clearData si ops es un array vacío
      return
    }

    const reqBody = []
    const filters = []

    if (ops.some(op => op.label === 'MÍOS')) {
      reqBody.push(true);
    } else {
      reqBody.push(false);
    }
    
    for (let i = 0; i < ops.length; i++) {
      if (ops[i].value === 'patient_status' || ops[i].value === 'patient_isolated') {
        if (ops[i].value === 'patient_isolated') {
          filters.push(true)
        } else {
          filters.push(ops[i].label)
        }
      }
    }

    reqBody.push(filters)
    console.log('body mandado:', reqBody)
    const data = await getFilteredPatients(reqBody)
    const sortedData = data.sort((a, b) => {
      return new Date(b.entry_time).getTime() - new Date(a.entry_time).getTime()
    })

    setRawData(sortedData)
    setPatientsData(sortedData)
    setCurrentPage(1)
  }

  return (
    <div className='bg-white '>
      <div className='flex  flex-col p-4'>
        <SearchTypeSelector
          searchType={searchType}
          setSearchType={setSearchType}
          setAnimation={setAnimation}
        />
        {searchType == 'Nombre' ? (
          <div className={`${animation}`}>
            <PatientSearchBar
              searchName={searchName}
              setSearchName={setSearchName}
              searchPatient={searchPatientByName}
              clearData={clearData}
            />
          </div>
        ) : null}
        {searchType == 'Fecha' ? (
          <div className={`${animation}`}>
            <PatientByDatePicker
              startDate={startDate}
              setStartDate={setStartDate}
              endDate={endDate}
              setEndDate={setEndDate}
              searchPatientByDate={searchPatientByDate}
              clearData={clearData}
            />
          </div>
        ) : null}
        {searchType == 'Filtro' ? (
          <div className={`${animation}`}>
            <FilterPatientsComponent
              options={options}
              onChangeSelect={onChangeSelect}
              filterPatientsTrigger={filterPatientsTrigger}
              filterOptions={filterOptions}
            />
          </div>
        ) : null}
      </div>

      {searchTerm === '' && patientsData ? (
        <PatientsList
          patients={patientsData}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      ) : searchTerm !== '' && filteredPatients ? (
        <PatientsList
          patients={filteredPatients}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      ) : (
        <p>No se encontraron pacientes.</p>
      )}
    </div>
  )
}

export default Patients
