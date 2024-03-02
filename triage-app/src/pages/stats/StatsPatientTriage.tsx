function StatsPatientTriage() {
  return (
    <iframe
      src={`http://localhost:5000/cant_pacientes_triage`}
      title='Gráfico'
      width='100%'
      height='100%'
    ></iframe>
  )
}

export default StatsPatientTriage
