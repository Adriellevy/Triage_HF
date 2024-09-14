import React from 'react';
import LoaderSpin from '../LoaderSpin';

interface LoaderOverlayProps {
  loadingMessage: string;
}

const LoaderOverlay: React.FC<LoaderOverlayProps> = ({ loadingMessage }) => {
  return (
    <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50'>
      <div className='bg-white p-4 rounded-md text-center'>
        <LoaderSpin />
        <p className="mt-4 text-gray-700">{loadingMessage}</p>
      </div>
    </div>
  );
};

export default LoaderOverlay;