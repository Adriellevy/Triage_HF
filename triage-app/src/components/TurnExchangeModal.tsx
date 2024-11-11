import { useEffect, useState } from "react";
import  Select  from "react-select";
import { Button } from "./ui";
import { getAllDoctors, getAllNurses } from "@/services/userService";
import { getPatientsByDr, getPatientsByUserID } from "@/services/patientService";
import { Patient } from "@/interfaces/Patinet";
import PatientsList from "./PatientList/PatientsList";

const TurnExchangeModal = ({ onClose }) => {
    const [lastDoctor, setLastDoctor] = useState('')
    const [newDoctor, setNewDoctor] = useState('')
    const [newDoctorName, setNewDoctorName] = useState('')
    const [lastNurse, setLastNurse] = useState('')
    const [newNurse, setNewNurse] = useState('')
    const [newNurseName, setNewNurseName] = useState('')
    const [doctorOptions, setDoctorOptions] = useState<ColourOption[]>([])
    const [nurseOptions, setNurseOptions] = useState<ColourOption[]>([])
    const [patients, setPatients] = useState<Patient[]>([])
    const [currentPage, setCurrentPage] = useState(1)

    const handleSelection = (selectedOption, slot, role) => {
      if (selectedOption) {
        if (role === 'doctor') {
          if (slot === 'last') {
            setLastDoctor(selectedOption.value);
          } else {
            setNewDoctor(selectedOption.value);
            setNewDoctorName(selectedOption.label);
          }
        } else if (role === 'nurse') {
          if (slot === 'last') {
            setLastNurse(selectedOption.value);
          } else {
            setNewNurse(selectedOption.value);
            setNewNurseName(selectedOption.label);
          }
        }
      }
    };
    
    useEffect(() => {
        const fetchOptions = async () => {
          try {
            const doctors = await getAllDoctors();
            const nurses = await getAllNurses();
            const formattedDoctors = doctors.map(doctor => ({
              value: doctor.user_id,  
              label: doctor.user_name  
            }));
      
            const formattedNurses = nurses.map(nurse => ({
              value: nurse.user_id,    
              label: nurse.user_name  
            }));
      
            setDoctorOptions(formattedDoctors);
            setNurseOptions(formattedNurses);
          } catch (error) {
            console.error("Error fetching doctors or nurses", error);
          }
        };
      
        fetchOptions();
      }, [lastDoctor, newDoctor, lastNurse, newNurse]);

      useEffect(() => {
        const fetchPatients = async () => {
          try {
            let oldpatients = [];
            if (lastDoctor) {
              const doctorPatients = await getPatientsByUserID(lastDoctor);
              oldpatients = oldpatients.concat(doctorPatients); // Use concat or spread
            }
            
            if (lastNurse) {
              const nursePatients = await getPatientsByUserID(lastNurse);
              oldpatients = oldpatients.concat(nursePatients); // Use concat or spread
            }
            setPatients(oldpatients)
          } catch (error) {
            console.error("Error fetching patients:", error);
          }
        };
      
        fetchPatients();
      }, [lastDoctor, lastNurse]);

    return (
      <div className='fixed top-0  left-0 h-full w-full flex items-start justify-center bg-black bg-opacity-35 z-50 '>
        <div className=" flex  flex-col bg-blue-900 rounded-lg mt-10 ml-56  max-w-2xl md:max-w-6xl w-full z-60">
         <div className="flex mx-2 my-4 justify-between">
            <h3 className="text-2xl font-bold mx-2 my-2 mr-20">Cambio de turno</h3>
            <Button color='grey' onClick={onClose} className="text-sm py-0 px-2 font-bold ">
                  Cancelar
            </Button>
        </div>   
        <div className='bg-white w-full rounded-lg p-8'>
        <div className="flex">
          {/* LAST WORKERS */}
        <div className="flex-col w-full">
        <label className='text-sm font-medium text-gray-700 mb-2 px-4'>Doctor/a que se va:</label>
        <div className='bg-white flex px-4'>
            <Select
            className='w-full text-black'
            options={doctorOptions}
            placeholder={'Selecionar doctor/a'}
            closeMenuOnSelect={true}
            onChange={(selectedOption) => handleSelection(selectedOption, 'last', 'doctor')}
            />
        </div>
        </div>
        <div className="flex-col w-full">
        <label className='text-sm font-medium text-gray-700 mb-2 px-4'>Enfermero/a que se va:</label>
        <div className='bg-white flex px-4'>
            <Select
            className='w-full text-black'
            options={nurseOptions}
            placeholder={'Selecionar enfermero/a'}
            closeMenuOnSelect={true}
            onChange={(selectedOption) => handleSelection(selectedOption, 'last', 'nurse')}
            />
        </div>
        </div>
    </div>
    <div className="flex mt-4">
      {/* NEW WORKERS */}
        <div className="flex-col w-full">
        <label className='text-sm font-medium text-gray-700 mb-2 px-4'>Doctor/a entra:</label>
        <div className='bg-white flex px-4'>
            <Select
            className='w-full text-black'
            options={doctorOptions}
            placeholder={'Selecionar doctor/a'}
            closeMenuOnSelect={true}
            onChange={(selectedOption) => handleSelection(selectedOption, 'new', 'doctor')}
            />
        </div>
        </div>
        <div className="flex-col w-full">
        <label className='text-sm font-medium text-gray-700 mb-2 px-4'>Enfermero/a que entra:</label>
        <div className='bg-white flex px-4'>
            <Select
            className='w-full text-black'
            options={nurseOptions}
            placeholder={'Selecionar enfermero/a'}
            closeMenuOnSelect={true}
            onChange={(selectedOption) => handleSelection(selectedOption, 'new', 'nurse')}
            />
        </div>
        </div>
    </div>
    {/* BUTTON */}
    <div className="flex justify-end mt-4">
    <Button color='green' onClick={onClose} className="text-lg py-2 px-2 font-bold ">
                  Cambio de turno
    </Button>
    </div>
    <div className="text-black flex justify-center">
    { lastDoctor ?
      <PatientsList 
      patients={patients}
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
      turnExchange={true}
      newDoctor={newDoctorName}
      newNurse={newNurseName}
      />
      : null}
      </div>
    </div>
        </div>
      </div>
    );
  };

  export default TurnExchangeModal;