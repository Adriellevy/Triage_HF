function StatsTopConsultas() {
  return (
    <iframe
      src={`http://localhost:5000/top_consultas_fecha`}
      title='Gráfico'
      width='100%'
      height='100%'
    ></iframe>
  )
}

export default StatsTopConsultas
