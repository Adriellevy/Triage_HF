class cPacienteSinGravedad {
    constructor(edad, casoClinico, enfermero, textoHistorial) {
      this._edad = edad;
      this._tiempoLlegada = new Date();
      this._casoClinico = casoClinico;
      this._enfermeroQuienCategorizo = enfermero;
      this._historial = textoHistorial;
    }
  
    getHistorial() {
      return this._historial;
    }
  
    getTiempoLlegada() {
      return this._tiempoLlegada;
    }
  
    getEdad() {
      return this._edad;
    }
  
    getEnfermero() {
      return this._enfermeroQuienCategorizo;
    }
  
    getCasoClinico() {
      return this._casoClinico;
    }
  
    getTiempoLLegada() {
      return new Date() - this._tiempoLlegada;
    }
  
    setTiempoLlegada(tiempoLlegada) {
      this._tiempoLlegada = tiempoLlegada;
    }
  
    isEqual(other) {
      const val2 = this._tiempoLlegada - other._tiempoLlegada;
      return val2 < 100;
    }
  }

  module.exports = {cPacienteSinGravedad}