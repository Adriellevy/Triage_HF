function StatsTopConsultas() {
  return (
    <iframe
      src={`http://181.167.200.30:5000/top_queries_date/`}
      title='Gráfico'
      width='100%'
      height='100%'
    ></iframe>
  )
}

export default StatsTopConsultas
