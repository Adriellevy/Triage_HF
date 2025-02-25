import { dbfs } from "../config/firebase";
import { collection, getDocs } from "firebase/firestore";


export async function syncKey(): Promise<any | null> {
    try {
        const keysCollection = collection(dbfs, "keys");
        const querySnapshot = await getDocs(keysCollection);

        const keyDoc = querySnapshot.docs.find(doc => doc.id === process.env.SYNC_KEY);

        if (keyDoc) {
            console.log("Clave activa validada");
            return keyDoc.data(); 
        } else {
            console.warn("No se encontró la clave en Firebase.");
            return null;
        }
    } catch (err) {
        console.error("Error al obtener la clave:", err);
        return null;
    }
} 