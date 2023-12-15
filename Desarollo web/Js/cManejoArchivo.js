const fs = require('fs');
const path = require('path');
const { DateTime, Duration } = require('luxon');
const Papa = require('papaparse');
const { cPaciente } = require('./cPaciente.js'); // Assuming cEnfermero is exported from 'cEnfermero.js'
class cManejoArchivo {
    constructor(archivoCsv) {
        const filePath = path.join(__dirname, '..', '..','lista_pacientes.csv')
        this._archivoCsv = archivoCsv || filePath;
        if (!fs.existsSync(this._archivoCsv)) {
            // El archivo no existe, crearlo
            this._baseDePacientes = [];
            this.guardarArchivo();  // Guardar el archivo nuevo
        } else {
            // El archivo ya existe, cargar los datos
            this._baseDePacientes = this.leerArchivo();
        }
    }
  
    agregarPaciente(paciente) {
      const enfermero = paciente.getEnfermero();
      const nuevoPaciente = {
        "Nombre": paciente.getNombre(),
        "Edad": paciente.getEdad(),
        "Gravedad": paciente.getGravedad(),
        "Historial": paciente.getHistorial(),
        "Enfermero": enfermero.getNombreEnfermero(),
        "Matricula": enfermero.getMatricula(),
        "CasoClinico": paciente.getCasoClinico(),
        "Fecha": paciente.getTiempoLLegada(),
      };
      this._baseDePacientes.push(nuevoPaciente);
      this.guardarArchivo();
    }
  
    editarPaciente(nombre, fecha, nuevaEdad, nuevaGravedad, nuevoHistorial, nuevoEnfermero) {
      const paciente = this.busquedaInterna(nombre, fecha);
      if (paciente !== null) {
        paciente["Edad"] = nuevaEdad;
        paciente["Gravedad"] = nuevaGravedad;
        paciente["Historial"] = nuevoHistorial;
        paciente["Enfermero"] = nuevoEnfermero;
        this.guardarArchivo();  // Guardar el array actualizado
        return true;
      } else {
        return false;
      }
    }
  
    leerOtroArchivo(archivoCsvOtro) {
      try {
        const pacientesOtro = this.leerArchivo(archivoCsvOtro);
        this._baseDePacientes = this._baseDePacientes.concat(pacientesOtro);
        this.guardarArchivo();
        return true;
      } catch (error) {
        return false;
      }
    }
  
    guardarArchivo() {
      fs.writeFileSync(this._archivoCsv, JSON.stringify(this._baseDePacientes, null, 2));
      console.log(`Archivo con paciente derivado guardado en ${this._archivoCsv}`);
    }
  
    obtenerIndicePaciente(nombre, fecha) {
      const paciente = this.busquedaInterna(nombre, fecha);
      return paciente !== null ? this._baseDePacientes.indexOf(paciente) : null;
    }
  
    busquedaInterna(nombre = null, edad = null, casoClinico = null) {
      // Verifica si se proporciona al menos uno de los parámetros
      if (!nombre && !edad && !casoClinico) {
        return null;
      }
  
      // Crea un array con los pacientes que cumplen con los filtros
      const pacientesFiltrados = this._baseDePacientes.filter(paciente => (
        (!nombre || paciente["Nombre"] === nombre) &&
        (!edad || paciente["Edad"] === edad) &&
        (!casoClinico || paciente["CasoClinico"] === casoClinico)
      ));
  
      // Filtra por la condición de menos de 72 horas
      const ahora = new Date();
      const limiteTiempo = new Date(ahora - 200 * 60 * 60 * 1000);  // Restar 200 horas
      const pacientesFiltradosTiempo = pacientesFiltrados.filter(paciente => new Date(paciente["Fecha"]) > limiteTiempo);
  
      // Si no se encontraron pacientes después de aplicar todos los filtros, devuelve null
      if (pacientesFiltradosTiempo.length === 0) {
        return null;
      }
  
      // Devuelve el objeto correspondiente al paciente encontrado
      return pacientesFiltradosTiempo[0];
    }
  
    leerArchivo(archivoCsv = null) {
      const archivo = archivoCsv || this._archivoCsv;
      try {
        const contenidoArchivo = fs.readFileSync(archivo, 'utf-8');
        return JSON.parse(contenidoArchivo);
        } catch (error) {
            throw new Error(`Error al leer el archivo ${archivo}: ${error.message}`);
        }
    }
    buscarPaciente(nombre = "", casoClinico = "") {
        if (nombre !== "" && casoClinico !== "") {
          // Si ambos parámetros están presentes, busca si hay algún dato que comparte ambos
          const resultado = this._baseDePacientes.filter(
            paciente => paciente["Nombre"].toLowerCase().includes(nombre.toLowerCase()) &&
                         paciente["CasoClinico"] === casoClinico
          );
          return this.filtrarPorTiempo(resultado);
        } else if (nombre !== "") {
          const resultado = this._baseDePacientes.filter(
            paciente => paciente["Nombre"].toLowerCase().includes(nombre.toLowerCase())
          );
          return this.filtrarPorTiempo(resultado);
        } else if (casoClinico !== "") {
          const resultado = this._baseDePacientes.filter(
            paciente => paciente["CasoClinico"] === casoClinico
          );
          return this.filtrarPorTiempo(resultado);
        } else {
          console.log("Se requiere al menos un nombre o un caso clínico.");
          return null;
        }
      }
    
      buscarUltimo() {
        const indiceMaxValor = this._baseDePacientes.reduce(
          (maxIndex, paciente, currentIndex) => (paciente["CasoClinico"] > this._baseDePacientes[maxIndex]["CasoClinico"] ? currentIndex : maxIndex),
          0
        );
        return this._baseDePacientes[indiceMaxValor]["CasoClinico"];
      }
    
      buscarEnArchivoPaciente(nombre, fecha) {
        const pacientesFiltrados = this._baseDePacientes.filter(
          paciente => paciente["Nombre"] === nombre && paciente["Fecha"] === fecha
        );
    
        if (pacientesFiltrados.length === 0) {
          return null;
        }
    
        const pacienteData = pacientesFiltrados[0];
    
        let color = "";
        switch (pacienteData["Gravedad"]) {
          case 0:
            color = "rojo";
            break;
          case 1:
            color = "naranja";
            break;
          case 2:
            color = "amarillo";
            break;
          case 3:
            color = "verde";
            break;
          case 4:
            color = "azul";
            break;
        }
    
        const enfermero = new Enfermero(pacienteData["Enfermero"], pacienteData["Matricula"]);
        const paciente = new Paciente(
          pacienteData["Nombre"],
          color,
          pacienteData["Edad"],
          pacienteData["CasoClinico"],
          enfermero,
          pacienteData["Historial"]
        );
    
        return paciente;
      }
    
      obtenerUltimosDatos() {
        return this._baseDePacientes;
      }
    
      pacientesBuscandoCama() {
        if (!this._baseDePacientes.some(paciente => "Historial" in paciente && paciente["Historial"] === "Buscando Cama")) {
          return [];
        }
    
        const pacientesBuscandoCama = this._baseDePacientes.filter(
          paciente => "Historial" in paciente && paciente["Historial"] === "Buscando Cama"
        );
    
        return pacientesBuscandoCama;
      }
    
      // Métodos auxiliares
      filtrarPorTiempo(pacientes) {
        const ahora = new Date();
        const limiteTiempo = new Date(ahora - 72 * 60 * 60 * 1000);  // Restar 72 horas
        return pacientes.filter(paciente => new Date(paciente["Fecha"]) > limiteTiempo);
      }
    }
module.exports = cManejoArchivo;