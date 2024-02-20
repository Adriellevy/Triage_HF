/*
import SelectorMenu from '@/components/SelectorMenu'
import personas from '../assets/personas.png'
import carpa from '../assets/carpa-medica (3).png'
import StatsPatients from '@/components/StatsPatientTriage'
import StatsUsers from '@/components/StatsUsers'
import StatsPatientsIncome from '@/components/StatsPatientIncome'
import StatsPatientsAge from '@/components/StatsPatientAge'
*/
function Stats() {
  const graficos = [
    'http://localhost:5000/grafico',
    'http://localhost:5000/grafico',
    'http://localhost:5000/grafico',
    'http://localhost:5000/grafico'
  ]
  return (
    <>
      <div className='w-full h-full'>
        <iframe
          src='http://localhost:5000/grafico'
          title='Gráfico'
          width='100%'
          height='100%'
        ></iframe>
      </div>
      <div className='grid grid-cols-2 md:grid-cols-2 gap-4 w-full h-full'>
        {graficos.map((url, index) => (
          <div key={index} className='w-full h-full'>
            <iframe src={url} title={`Gráfico ${index + 1}`} width='100%' height='100%'></iframe>
          </div>
        ))}
      </div>
    </>
  )
  /*
  return (
    <div className='flex h-screen justify-between items-center'>
      <div>
        <SelectorMenu options={chartOptions} onSelect={setSelectedOption} />
      </div>
      <div className={`w-full h-full lg:w-3/4 lg:h-5/6 ${windowWidth < 1100 ? 'lg:w-full' : ''}`}>
        {selectedOption === 0 && <StatsPatientsIncome />}
        {selectedOption === 1 && <StatsPatients />}
        {selectedOption === 2 && <StatsUsers />}
        {selectedOption === 3 && <StatsPatientsAge />}
      </div>
    </div>
  )
  */
}

export default Stats
