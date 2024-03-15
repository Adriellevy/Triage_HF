import { useEffect, useState } from 'react'

interface CounterProps {
  initialTime: string
}

function Counter({ initialTime }: CounterProps) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const initialTimeDate = new Date(initialTime)
  const [counter, setCounter] = useState<{
    days: number
    hours: number
    minutes: number
    seconds: number
  }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })

  useEffect(() => {
    const interval = setInterval(() => {
      const currentTime = new Date()
      const timeDifference = currentTime.getTime() - initialTimeDate.getTime()
      const seconds = Math.floor(timeDifference / 1000) % 60
      const minutes = Math.floor((timeDifference / (1000 * 60)) % 60)
      const hours = Math.floor((timeDifference / (1000 * 60 * 60)) % 24)
      const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24))
      setCounter({ days, hours, minutes, seconds })
    }, 1000)
    return () => clearInterval(interval)
  }, [initialTimeDate])

  return (
    <div>
      <p>
        {counter.days} d : {counter.hours} h : {counter.minutes} m : {counter.seconds} s
      </p>
    </div>
  )
}

export default Counter
