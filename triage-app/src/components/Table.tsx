import { Patient } from "@/interfaces/Patinet"

interface TableProps {
  patients: Patient[];
}

function Table({ patients }: TableProps) {
  return (
    <table>
      <thead>
        <tr>
          <td>Nombre</td>
          <td>Box</td>
          <td>Fecha</td>
        </tr>
      </thead>
      <tbody>
        {patients.map((patient,index) => (
          <tr key={index}>
            <td>{patient.patient_name}</td>
            <td>{patient.box_code}</td>
            <td>{patient.patient_entry_time.toString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default Table;

  