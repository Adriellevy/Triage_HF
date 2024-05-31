import { Link } from 'react-router-dom'

interface PropsCard {
  url: string
  label: string
  number: number
}

function Card({ url, label, number }: PropsCard) {
  return (
    <Link
      to={url}
      className='max-w-xs mx-auto bg-white hover:bg-slate-300 p-6 rounded-lg shadow-md text-center w-full transition duration-300 ease-in-out transform hover:scale-105 border border-gray-300'
    >
      <p className='text-4xl font-bold mb-2 text-black'>{number}</p>
      <p className='text-lg text-gray-600'>{label}</p>
    </Link>
  )
}

export default Card
