import { create } from 'zustand'

//agarrar el token
const TOKEN=123


export const usePatients=create((set)=>({
    createPatient: async (data) => {
        try {
            const response = await fetch(`http://localhost:3000/patient`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${TOKEN}`,
              },
              body: JSON.stringify(data),
            });
        
            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }
        
            const data = await response.json();
            console.log('Paciente creado con éxito:', data);
          } catch (error) {
            console.error('Error al crear paciente:', error);
          }
      },
    editPatient: async (id, infoToUdpate) => {
        try {
            const response = await fetch(`http://localhost:3000/patient/${id}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${TOKEN}`,
              },
              body: JSON.stringify(infoToUdpate),
            });
        
            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }
        
            const data = await response.json();
            console.log('Datos actualizados con éxito:', data);
          } catch (error) {
            console.error('Error al actualizar datos:', error);
          }
      },
}))