import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface WarningBoxProps {
  message: string;
  shouldStopCounter: boolean; // Nueva propiedad
}

const WarningBox: React.FC<WarningBoxProps> = ({ message, shouldStopCounter }) => {
  const { t } = useTranslation('WarningBox');
  const [counter, setCounter] = useState(25);

  useEffect(() => {
    if (shouldStopCounter) {
      return;
    }

    const timer = setInterval(() => {
      setCounter((prevCounter) => prevCounter - 1);
    }, 1000);

    if (counter <= 0) {
      clearInterval(timer);
      window.location.reload();
    }

    return () => clearInterval(timer);
  }, [counter, shouldStopCounter]);

  const handleReload = () => {
    window.location.reload();
  };

  return (
    <div className='bg-yellow-300 p-4 rounded-lg mb-5'>
      <div className='flex items-center'>
        <div className='mr-4'>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-700" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v4a1 1 0 102 0V5zm0 6a1 1 0 10-2 0v2a1 1 0 102 0v-2z" clipRule="evenodd" />
          </svg>
        </div>
        <div className='flex-grow'>
          <h1 className="font-bold text-yellow-700">{t('Warning')}</h1>
          <p className="text-yellow-700">{t(message)}</p>
        </div>
        <div>
          <button
            onClick={handleReload}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            {t('Reloading_in')} {counter} {t('seconds')} <br />
            {t('Save_for_combining')}
          </button>
        </div>
      </div>
    </div>
  );
}

export default WarningBox;
