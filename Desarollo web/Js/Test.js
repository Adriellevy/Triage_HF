const cManejoArchivo = require('./cManejoArchivo'); // Adjust the path based on your file structure

// Instantiate the cManejoArchivo class
const manejoArchivo = new cManejoArchivo();

// Output the data to the console
console.log(manejoArchivo.obtenerUltimosDatos());