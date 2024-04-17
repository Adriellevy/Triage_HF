function StatsPatinet() {
  return (
    <iframe
      src={`${import.meta.env.VITE_API_URL}:5000/number_patients_date/`}
      title='Gráfico'
      width='100%'
      height='100%'
    ></iframe>
  )
}

export default StatsPatinet
