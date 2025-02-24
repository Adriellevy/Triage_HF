import { dbfs } from "../config/firebase";
import { collection, getDocs } from "firebase/firestore";


export async function syncKey() {
    try {
        const keysCollection = collection(dbfs, "keys");
        const querySnapshot = await getDocs(keysCollection);

        if (!querySnapshot.empty) {
            querySnapshot.forEach((doc) => {
                if (doc.id === process.env.SYNC_KEY) {  
                    let activeKey = doc.data(); 
                    console.log("Clave activa validada");
                    return activeKey
                }
            });
        } else {
            console.warn("No se encontraron claves en Firebase.");
        }
    } catch (err) {
        console.error("Error al obtener la clave:", err);
    }
}
