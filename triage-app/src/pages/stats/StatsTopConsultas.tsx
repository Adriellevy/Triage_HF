function StatsTopConsultas() {
  return (
    <iframe
      src={`${import.meta.env.VITE_PYTHON_URL}/top_queries_date/`}
      title='Gráfico'
      width='100%'
      height='100%'
    ></iframe>
  )
}

export default StatsTopConsultas
