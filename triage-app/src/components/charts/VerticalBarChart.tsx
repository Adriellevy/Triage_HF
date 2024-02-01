import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { Bar } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const
    },
    title: {
      display: true,
      text: 'Chart.js Bar Chart'
    }
  }
}

const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July']

const dataOriginal = {
  labels,
  datasets: [
    {
      label: 'Dataset 1',
      data: [1, 2, 3, 4, 5, 6],
      backgroundColor: 'rgba(255, 99, 132, 0.5)'
    },
    {
      label: 'Dataset 2',
      data: [4, 1, 9, 2, 3, 2],
      backgroundColor: 'rgba(53, 162, 235, 0.5)'
    }
  ]
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function VerticalBarChart(data: any) {
  try {
    return <Bar options={options} data={data} />
  } catch (error) {
    console.log('Error in chart: ' + error)
    console.log('Llego a VerticalBar: ' + data)
    return <Bar options={options} data={dataOriginal} />
  }
}
