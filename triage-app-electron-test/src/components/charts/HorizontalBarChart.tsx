import React from 'react'
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

const defaultOptions = {
  indexAxis: 'y' as const,
  elements: {
    bar: {
      borderWidth: 2
    }
  },
  responsive: true,
  plugins: {
    legend: {
      position: 'right' as const
    },
    title: {
      display: true,
      text: 'Horizontal Bar Chart'
    }
  }
}

interface HorizontalBarChartProps {
  options?: typeof defaultOptions
  data?: {
    labels: string[]
    datasets: {
      label: string
      data: number[]
      borderColor: string
      backgroundColor: string
    }[]
  }
}

const HorizontalBarChart: React.FC<HorizontalBarChartProps> = ({ options, data }) => {
  const chartOptions = options || defaultOptions
  const chartData = data || { labels: [], datasets: [] }

  return <Bar type='bar' options={chartOptions} data={chartData} />
}

export default HorizontalBarChart
