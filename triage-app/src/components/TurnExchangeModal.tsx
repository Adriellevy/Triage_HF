import { SetStateAction, useEffect, useState } from "react";
import  Select  from "react-select";
import { Button } from "./ui";
import { getAllDoctors, getAllNurses } from "@/services/userService";
import {  getPatientsByUserID } from "@/services/patientService";
import { Patient } from "@/interfaces/Patinet";
import PatientsListTurnExchange from "./PatientList/PatientListTurnExchange";
import { Checkbox } from "@mui/material";

const TurnExchangeModal = ({ onClose }) => {
    const [lastDoctor, setLastDoctor] = useState('')
    const [lastNurse, setLastNurse] = useState('')
    const [newDoctor, setNewDoctor] = useState('')
    const [newNurse, setNewNurse] = useState('')
    const [doctorOptions, setDoctorOptions] = useState<ColourOption[]>([])
    const [nurseOptions, setNurseOptions] = useState<ColourOption[]>([])
    const [doctorPatients, setDoctorPatients] = useState<Patient[]>([])
    const [nursePatients, setNursePatients] = useState<Patient[]>([])
    const [createReport, setCreateReport] = useState(false)

    const handleSelection = (selectedOption: { value: SetStateAction<string>; label: any; }, slot: string, role: string) => {
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
            setDoctorPatients([])
            let oldpatients: any[] | ((prevState: Patient[]) => Patient[]) = []
            if (lastDoctor) {
              const doctorPatients = await getPatientsByUserID(lastDoctor);
              oldpatients = oldpatients.concat(doctorPatients); // Use concat or spread
            }
            setDoctorPatients(oldpatients)
          } catch (error) {
            console.error("Error fetching patients:", error);
          }
        };
      
        fetchPatients();
      }, [lastDoctor]);

      useEffect(() => {
        const fetchPatients = async () => {
          try {
            setNursePatients([])
            let oldpatients: any[] | ((prevState: Patient[]) => Patient[]) = [];
            if (lastNurse) {
              const nursePatients = await getPatientsByUserID(lastNurse);
              oldpatients = oldpatients.concat(nursePatients); // Use concat or spread
            }
            setNursePatients(oldpatients)
          } catch (error) {
            console.error("Error fetching patients:", error);
          }
        };
      
        fetchPatients();
      }, [lastNurse]);

    return (
      <div className='fixed top-0  left-0 h-full w-full flex items-start justify-center bg-black bg-opacity-35 z-50 '>
        <div className=" flex  flex-col bg-blue-900 rounded-lg mt-10 ml-56  max-w-2xl md:max-w-screen-2xl w-full z-60">
         <div className="flex mx-2 my-4 justify-between">
            <h3 className="text-2xl font-bold mx-2 my-2 mr-20">Cambio de turno</h3>
            <Button color='grey' onClick={onClose} className="text-sm py-0 px-2 font-bold ">
                  Cancelar
            </Button>
        </div>   
        <div className='bg-white w-full rounded-lg p-4'>
        <div className="flex">
          {/* LAST WORKERS */}
        <div className="flex-col w-full">
        <label className='text-sm font-medium text-gray-700 mb-2 px-4'>Doctor/a que se va:</label>
        <div className='bg-white flex px-4'>
            <Select
            className='w-full text-black'
            options={doctorOptions}
            placeholder={'Selec. doctor/a'}
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
            placeholder={'Selec. enfermero/a'}
            closeMenuOnSelect={true}
            onChange={(selectedOption) => handleSelection(selectedOption, 'last', 'nurse')}
            />
        </div>
        </div>
    </div>
    {/* BUTTON */}
    <div className="flex justify-end mt-4">
    <label className="text-black self-center ">Generar informe</label>
    <Checkbox
      name="Generar informe"
      color="success"
      checked={createReport}
      onChange={() => setCreateReport(!createReport)}
    />
    <Button color='green' onClick={onClose} className="text-lg py-2 px-2 font-bold ">
                  Cambio de turno
    </Button>
    </div>
    <div className="text-black flex justify-center">
    { lastDoctor ?
      <PatientsListTurnExchange
      patients={doctorPatients}
      mode={'doctor'}
      setNewDoctor={setNewDoctor}
      />
      : null}
      { lastNurse ?
      <PatientsListTurnExchange
      patients={nursePatients}
      mode={'nurse'}
      setNewNurse={setNewNurse}
      />
      : null}
      </div>
    </div>
        </div>
      </div>
    );
  };

  export default TurnExchangeModal;