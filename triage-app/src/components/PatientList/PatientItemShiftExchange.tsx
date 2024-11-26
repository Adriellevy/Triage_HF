import { useState, useEffect } from 'react';
import { Patient, PatientStatus } from '../../interfaces/Patinet';
import { updatePatient } from '@/services/patientService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { Button } from '@/components/ui';
import Select from 'react-select';
import { getAllDoctors, getAllNurses } from '@/services/userService';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store/store.ts';
import { setDoctorSelections, setNurseSelections } from '@/redux/slices/shiftSelectionsSlice.ts';

interface PropsPatientItem {
  patient: Patient;
  setNewDoctor?: (_id: number) => void;
  setNewNurse?: (_id: number) => void;
  index: number;
  mode: string;
  lastDoctor?: { value: string; label: string };
  lastNurse?: { value: string; label: string };
}

function PatientItemShiftExchange({
  patient,
  index,
  mode,
  lastDoctor,
  lastNurse,
}: PropsPatientItem) {
  const [doctorOptions, setDoctorOptions] = useState([]);
  const [nurseOptions, setNurseOptions] = useState([]);
  const [patientToDischarge, setPatientToDischarge] = useState<Patient | null>(null);
  const dispatch = useDispatch();


  const selectedDoctors = useSelector(
    (state: RootState) => state.shiftSelections.doctorSelections
  );
  const selectedNurses = useSelector(
    (state: RootState) => state.shiftSelections.nurseSelections
  );

  const {
    patient_id,
    patient_name,
    patient_triage_level,
    patient_status,
    doctor_name,
    nurse_name,
  } = patient;

  const isOdd = index % 2 !== 0;
  const bgClass = isOdd ? 'bg-white' : 'bg-gray-100';

  const TriageLevels = [
    { _id: 1, name: 'I', color: '153, 153, 153' },
    { _id: 2, name: 'II', color: '255,51,0' },
    { _id: 3, name: 'III', color: '255,255,102' },
    { _id: 4, name: 'IV', color: '105,168,79' },
  ];

  const getBackgroundColor = (id: number) => {
    const triageLevel = TriageLevels.find((level) => level._id === id);
    return triageLevel ? `rgb(${triageLevel.color}, 0.6)` : 'transparent';
  };

  const handleSelection = (
    patient_id: string, // Asegúrate de pasar `patient_id` como argumento
    selectedOption: { value: string; label: string } | null,
    type: 'doctor' | 'nurse',
    lastDoctor?: { value: string; label: string }, 
    lastNurse?: { value: string; label: string } 
  ) => {
  
    if (selectedOption) {
      if (type === 'doctor') {
        dispatch(
          setDoctorSelections({
            patient_id,
            previousValue: lastDoctor?.value,
            newValue: selectedOption.value,
          })
        );
      } else if (type === 'nurse') {
        dispatch(
          setNurseSelections({
            patient_id,
            previousValue: lastNurse?.value,
            newValue: selectedOption.value,
          })
        );
      }
    }
  };

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [doctors, nurses] = await Promise.all([getAllDoctors(), getAllNurses()]);

        const formattedDoctors = doctors.map((doctor) => ({
          value: doctor.user_id,
          label: doctor.user_name,
        }));

        const formattedNurses = nurses.map((nurse) => ({
          value: nurse.user_id,
          label: nurse.user_name,
        }));

        const filteredDoctors = formattedDoctors.filter(
          (doctor) => doctor.value !== lastDoctor?.value
        );

        const filteredNurses = formattedNurses.filter(
          (nurse) => nurse.value !== lastNurse?.value
        );

        setDoctorOptions(filteredDoctors);
        setNurseOptions(filteredNurses);
      } catch (error) {
        console.error('Error fetching doctors or nurses', error);
      }
    };

    fetchOptions();
  }, [lastDoctor, lastNurse]);

  const handleFastDischarge = (id: string) => {
    console.log('fast Discharge in process ' + id);
    setPatientToDischarge(patient);
  };

  const handleConfirmFastDischarge = () => {
    console.log('Alta confirmada');
    setPatientToDischarge(null);
    if (patient) {
      patient.patient_status = PatientStatus.DISCHARGED;
      updatePatient(patient.patient_id, patient);
    } else {
      console.log('Error en dar de ALTA al paciente');
    }
  };

  return (
    <tr className={bgClass}>
      <td className="border text-sm overflow-hidden text-center">{patient_name}</td>
      <td
        className="border md:p-2 text-center"
        style={{ backgroundColor: getBackgroundColor(Number(patient_triage_level)) }}
      >
        {patient_triage_level}
      </td>
      {mode === 'doctor' ? (
  <>
    <td className="border p-2  text-center hidden lg:table-cell ">{doctor_name}</td>
    <td className="border p-4 table-cell text-center">
      <Select
        className="w-full text-black"
        options={doctorOptions}
        placeholder="Selec. doctor/a"
        closeMenuOnSelect={true}
        value={selectedDoctors[patient_id]?.newValue 
          ? doctorOptions.find(option => option.value === selectedDoctors[patient_id]?.newValue)
          : null}
        onChange={(selectedOption) =>
          handleSelection(patient_id, selectedOption, 'doctor', lastDoctor, lastNurse)
        }
      />
    </td>
  </>
) : (
  <>
    <td className="border p-2 table-cell text-center hidden lg:table-cell">{nurse_name}</td>
    <td className="border p-4 table-cell text-center">
      <Select
        className="w-full text-black"
        options={nurseOptions}
        placeholder="Selec. enfermero/a"
        closeMenuOnSelect={true}
        value={selectedNurses[patient_id]?.newValue 
          ? nurseOptions.find(option => option.value === selectedNurses[patient_id]?.newValue)
          : null}
        onChange={(selectedOption) =>
          handleSelection(patient_id, selectedOption, 'nurse', lastDoctor, lastNurse)
        }
      />
    </td>
  </>
)}
      <td className="border text-sm text-center hidden lg:table-cell">{patient_status}</td>
      <td className="border p-2">
        <div className="flex gap-2">
          {patient_status !== 'ALTA' ? (
            <Button wfull color="red" onClick={() => handleFastDischarge(patient_id)}>
              <FontAwesomeIcon icon={faRightFromBracket} />
            </Button>
          ) : (
            <Button wfull color="grey_disabled" disabled>
              <FontAwesomeIcon icon={faRightFromBracket} />
            </Button>
          )}
        </div>
        {patientToDischarge?.patient_id === patient_id && (
          <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-35">
            <div className="bg-white p-8 rounded-lg">
              <div className="text-center">
                Confirmar alta de paciente <strong>{patientToDischarge.patient_name}</strong>?
              </div>
              <div className="flex justify-center mt-4 gap-2">
                <Button color="red" onClick={handleConfirmFastDischarge}>
                  Confirmar
                </Button>
                <Button color="grey" onClick={() => setPatientToDischarge(null)}>
                  Cancelar
                </Button>
              </div>
            </div>
          </div>
        )}
      </td>
    </tr>
  );
}

export default PatientItemShiftExchange;
