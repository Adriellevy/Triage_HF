import React, { useState, useEffect, useContext } from 'react';
import { SocketContext } from '@/contex/SocketContext';
import { getAllBoxes } from '@/services/boxService';
import { Box } from '@/interfaces/Boxes';
import { useTranslation } from 'react-i18next';
import LoaderSpin from '@/components/LoaderSpin';
import BoxEdittingList from '../../components/BoxSettingsComponents/BoxEdittingList';

function BoxSettings() {
  const [isLoading, setIsLoading] = useState(false);
  const [boxesData, setboxesData] = useState<Box[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const data = await getAllBoxes();
        setboxesData(data);
        setIsLoading(false);
      } catch (error) {
        console.error((error as Error).message);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="bg-white pb-4">
      {isLoading ? (
        <LoaderSpin/>
      ) : (
        <BoxEdittingList initialBoxes={boxesData} />
      )}
    </div>
  );
}

export default BoxSettings;
