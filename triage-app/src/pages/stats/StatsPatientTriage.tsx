function StatsPatientTriage() {
  return (
    <iframe
      src={`http://181.167.200.30:5000/patients_mean_time_doctor/`}
      title='Gráfico'
      width='100%'
      height='100%'
    ></iframe>
  )
}

export default StatsPatientTriage
