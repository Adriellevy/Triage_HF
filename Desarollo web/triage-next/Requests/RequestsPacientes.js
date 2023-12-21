export function transformDataPacientesEspera(originalData) {
    return originalData.map((patient) => {
      const age = new Date().getFullYear() - new Date(patient.date_of_birth).getFullYear();
      const severity = getSeverity(patient.patient_triage_level);
      
      return {
        nombre: `Paciente ${patient.patient_name}` || 'No asignado',
        edad: age || 'No asignado',
        gravedad: severity,
        box: patient.box_id,
        enfermero: patient.nurse_name || 'No asignado',
        fecha: formatDate(patient.entry_time),
        matricula: patient.doctor_name || 'No asignado',
        problemaPaciente: patient.patient_problem || 'No especificado',
        estado: patient.patient_status || 'Afuera'
      };
    });
  }
  
  function getSeverity(triageLevel) {
    // Define your own logic to determine severity based on triage level
    // For example, you can use a switch statement or other rules
    // This is just a placeholder, update it as per your requirements
    switch (triageLevel) {
      case 1:
        return 'Baja';
      case 2:
        return 'Media';
      case 3:
        return 'Alta';
      default:
        return 'Desconocida';
    }
  }
  
  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  }

  export function transformDataPacientesInternacion(originalData) {
    return originalData.map((patient) => {
      const age = new Date().getFullYear() - new Date(patient.date_of_birth).getFullYear();
      const severity = getSeverity(patient.patient_triage_level);
      
      return {
        nombre: `Paciente ${patient.patient_name}` || 'No asignado',
        edad: age || 'No asignado',
        box: patient.box_id,
        enfermero: patient.nurse_name || 'No asignado',
        fecha: formatDate(patient.entry_time),
        nombreMedico: patient.doctor_name || 'No asignado',
        problemaPaciente: patient.patient_problem || 'No especificado'
      };
    });
  }
  
  export function transformDataBoxes(originalData) {
    return originalData.map((box) => {      
      return {
        box_id: ` ${box.box_id}` || 'No asignado',
        box_type: box.box_type || 'No asignado',
      };
    });
  }