function StatsPatientTriage() {
  return (
    <iframe
      src={`${import.meta.env.VITE_API_URL}:5000/patients_mean_time_doctor/`}
      title='Gráfico'
      width='100%'
      height='100%'
    ></iframe>
  )
}

export default StatsPatientTriage
