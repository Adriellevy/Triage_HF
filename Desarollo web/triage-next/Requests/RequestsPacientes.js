export function transformData(originalData) {
    return originalData.map((patient) => {
      const age = new Date().getFullYear() - new Date(patient.date_of_birth).getFullYear();
      const severity = getSeverity(patient.patient_triage_level);
      
      return {
        nombre: `Paciente ${patient.patient_name}` || 'No asignado',
        edad: age || 'No asignado',
        gravedad: severity,
        historial: `Historial del Paciente ${patient.patient_id}`,
        enfermero: patient.nurse_name || 'No asignado',
        fecha: formatDate(patient.entry_time),
        casoClinico: patient.patient_id,
        matricula: patient.doctor_id ? `M${patient.doctor_id}` : 'No asignado',
        problemaPaciente: patient.patient_problem || 'No especificado'
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

