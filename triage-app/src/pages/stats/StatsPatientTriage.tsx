import StatIframe from '@/components/StatIframe'

function StatsPatientTriage() {
  const url: string = 'patients_mean_time_doctor/'
  return <StatIframe url={url} />
}

export default StatsPatientTriage
