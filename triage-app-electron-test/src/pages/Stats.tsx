import { HorizontalBarChart } from '../components/charts/HorizontalBarChart'
import { LineChart } from '../components/charts/LineCharts'
// import { PieChart } from '../components/PieChart'
import { VerticalBarChart } from '../components/charts/VerticalBarChart'

function Stats() {
  return (
    <div className='container mx-auto p-1 grid grid-cols-1 md:p-1 md:grid-cols-1 lg:p-1 lg:grid-cols-2 gap-8'>
      <div className='bg-white p-6 rounded-lg shadow-md'>
        <h2 className='text-2xl font-semibold mb-4'>Line Chart</h2>
        <LineChart />
      </div>
      <div className='bg-white p-6 rounded-lg shadow-md'>
        <h2 className='text-2xl font-semibold mb-4'>Vertical Bar Chart</h2>
        <VerticalBarChart />
      </div>
      <div className='bg-white p-6 rounded-lg shadow-md'>
        <h2 className='text-2xl font-semibold mb-4'>Horizontal Bar Chart</h2>
        <HorizontalBarChart />
      </div>
      <div className='bg-white p-6 rounded-lg shadow-md '>
        <h2 className='text-2xl font-semibold mb-4'>Vertical Bar Chart</h2>
        <VerticalBarChart />
      </div>
    </div>
  )
}

export default Stats
