import StatIframe from '@/components/StatIframe'

function PatientsMeanAge() {
  const url: string = 'number_patients_date/age/'
  return <StatIframe url={url} />
}

export default PatientsMeanAge
