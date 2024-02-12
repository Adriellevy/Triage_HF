import React from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js'
import { Bar } from 'react-chartjs-2'
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const defaultOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const
    },
    title: {
      display: true
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

interface VerticalBarChartProps {
  options?: ChartOptions<'bar'> // Ajusta 'bar' según el tipo de gráfico que estás utilizando
  data?: {
    labels: string[]
    datasets: {
      label: string
      data: number[]
      backgroundColor: string
    }[]
  }
}

const VerticalBarChart: React.FC<VerticalBarChartProps> = ({ options, data }) => {
  const chartOptions = options || defaultOptions
  const chartData = data || dataOriginal

  return <Bar options={chartOptions} data={chartData} />
}

export default VerticalBarChart
