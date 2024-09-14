
// import Table from "@/components/Table" 
// import { Patient } from "@/interfaces/Patinet"
// import { getPaginatedPatients } from "@/services/patientService"
// const variable:Patient[] = await getPaginatedPatients(1)
// console.log(variable)
// function TablePage() {
//   return (
//     <div>
//       {/* <Table props={variable}></Table>  */}
//     </div>
//   )
// }

// export default TablePage

import { useEffect, useState } from "react";
import Table from "@/components/Table";
import { Patient } from "@/interfaces/Patinet"
import { getPaginatedPatients } from "@/services/patientService";

function TablePage() {
  const [page, setPage] = useState(1);
  const [patients, setPatients] = useState<Patient[]>([]);

  async function fetchPatients(page: number) {
    const paginatedPatients = await getPaginatedPatients(page);
    setPatients(paginatedPatients);
  }

  useEffect(() => {
    fetchPatients(page);
  }, []);

  const handleNextPage = () => setPage(prev => prev + 1);
  const handlePreviousPage = () => setPage(prev => Math.max(prev - 1, 1));

  return (
    <div>
      <button onClick={handlePreviousPage} disabled={page === 1}>
        Anterior
      </button>
      <button onClick={handleNextPage}>
        Siguiente
      </button>
      
      <Table patients={patients} />
    </div>
  );
}

export default TablePage;