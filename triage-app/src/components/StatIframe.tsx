import LoaderSpin from '@/components/LoaderSpin'
import { useState } from 'react'

interface PropsStatIframe {
  url: string
}

function StatIframe({ url }: PropsStatIframe) {
  const [loadingIframe, setLoadingIframe] = useState(true)

  const handleLoad = () => {
    setLoadingIframe(false)
  }

  return (
    <>
      {loadingIframe && (
        <div className='relative w-full h-screen'>
          <div className='absolute inset-0 flex items-center justify-center bg-white z-50'>
            <LoaderSpin />
          </div>
        </div>
      )}
      {loadingIframe && (
        <div className='relative w-full h-screen'>
          <div className='absolute inset-0 flex items-center justify-center bg-white z-50'>
            <LoaderSpin />
          </div>
        </div>
      )}
      <iframe
        src={`${import.meta.env.VITE_PYTHON_URL}/${url}`}
        title='Gráfico'
        width='100%'
        height='100%'
        onLoad={handleLoad}
      ></iframe>
    </>
  )
}

export default StatIframe
