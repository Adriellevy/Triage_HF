function StatsPatientTriage() {
  return (
    <iframe
      src={`${import.meta.env.VITE_PYTHON_URL}/patients_mean_time_doctor/`}
      title='Gráfico'
      width='100%'
      height='100%'
    ></iframe>
  )
}

export default StatsPatientTriage
