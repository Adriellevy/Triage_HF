import StatIframe from '@/components/StatIframe'

function StatsTopConsultas() {
  const url: string = 'top_queries_date/'
  return <StatIframe url={url} />
}

export default StatsTopConsultas
