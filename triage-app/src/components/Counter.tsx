import { useEffect, useState } from 'react'

interface CounterProps {
  initialTime: string
}

function Counter({ initialTime }: CounterProps) {
  const [counter, setCounter] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })

  useEffect(() => {
    const initialTimeDate = new Date(initialTime)

    const calculateTimeRemaining = () => {
      const currentTime = new Date()
      const timeDifference = currentTime.getTime() - initialTimeDate.getTime()

      const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24))
      const hours = Math.floor((timeDifference / (1000 * 60 * 60)) % 24)
      const minutes = Math.floor((timeDifference / (1000 * 60)) % 60)
      const seconds = Math.floor((timeDifference / 1000) % 60)

      return { days, hours, minutes, seconds }
    }

    const updateCounter = () => setCounter(calculateTimeRemaining())

    updateCounter()
    const interval = setInterval(updateCounter, 1000)

    return () => clearInterval(interval)
  }, [initialTime])

  return (
    <div>
      <p>
        {counter.days} d : {counter.hours} h : {counter.minutes} m : {counter.seconds} s
      </p>
    </div>
  )
}

export default Counter
