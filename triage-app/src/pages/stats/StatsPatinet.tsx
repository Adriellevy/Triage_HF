function StatsPatinet() {
  return (
    <iframe
      src={`${import.meta.env.VITE_PYTHON_URL}/number_patients_date/`}
      title='Gráfico'
      width='100%'
      height='100%'
    ></iframe>
  )
}

export default StatsPatinet
