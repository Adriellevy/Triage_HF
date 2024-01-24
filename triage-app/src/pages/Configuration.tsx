import { useEffect, useState } from 'react'
import TeamList from '@/components/TeamList'
import SearchTeamForm from '@/components/SearchTeamForm'
import { getBoxes } from '../services/boxService'
import { getAllDoctors } from '../services/userService'
import { getAllNurses } from '../services/userService'
import { getAllUsers } from '../services/userService'
import Cookies from 'js-cookie'
import { User } from '@/interfaces/User'
function Patients() {
  const token = Cookies.get('authToken');

  const [teamData, setTeamData] = useState<User[] | null>(null)

  const onDelete = (patient_id: string) => {
    console.log("Se intento borrar el teamMember: "+patient_id)
  }


  useEffect(() => {
    const fetchData = async () => {
      try {
        if(token){
            const dataDocs = await getAllDoctors()
            const dataNurses = await getAllNurses()
            //const dataUsers = await getAllUsers() Arreglar el post en userService
            const dataUsers = dataDocs.concat(dataNurses);
            setTeamData(dataUsers);
            const dataBoxes = await getBoxes()  
            //TODO: add searchTerm
            //const data = await getPatients(token, searchTerm);
            
            setTeamData(dataUsers)
          }else{
            console.log("Error en fetch data de Patients.tsx")
          }
      } catch (error) {
        // console.error('Error al obtener pacientes:', error.message)
      }
    }

    fetchData()
  }, [token])

  return (
    <div>
      <SearchTeamForm onSearch={() => console.log('123')} />
      {teamData ? (
        <TeamList
          Team_members={teamData}
          onDelete={onDelete}
        />
      ) : ( 
        <p>Cargando pacientes...</p>
      )}
    </div>
  )
}

export default Patients
