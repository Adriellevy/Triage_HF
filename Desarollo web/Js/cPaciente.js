const { cPacienteSinGravedad } = require('./cPacientesingravedad.js');

class cPaciente extends cPacienteSinGravedad {
    constructor(nombre, color, edad, casoClinico, enfermero, textohisotrial) {
        super(edad, casoClinico, enfermero, textohisotrial);
        this._nombre = nombre;
        this._gravedad = new cGravedad(color);
        this.HaceCuantoleDuele = [24, 48, 72];
        this.GradoDolor = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        // Ver si poner o no como parámetros el grado que seleccionó el enfermero en triage
    }

    get_tiempo_gravedad() {
        return this._gravedad.getTiempoGravedadActual();
    }

    set_gravedad(nuevo_color) {
        this._gravedad.setGravedadMayor(nuevo_color);
    }

    getNombre() {
        return this._nombre;
    }

    getGravedad() {
        // Este método devuelve el color de la gravedad actual
        return this._gravedad.getTipo();
    }

    getTiempoRestante() {
        // Este método devuelve el tiempo que le queda en esa gravedad asignada
        const fecha_reciente = this._gravedad.getTiempoGravedadActual();
        const fecha_antigua = this.getHaceCuantoLLego();
        const resultado = fecha_reciente > fecha_antigua ? fecha_reciente - fecha_antigua : 0;
        return resultado;
    }

    getTiempoRestanteMayorGravedad() {
        // Este método devuelve el tiempo que le queda si la gravedad es mayor
        const fecha_reciente = this._gravedad.getTiempoGravedadMayor();
        const fecha_antigua = this.getHaceCuantoLLego();
        const resultado = fecha_reciente > fecha_antigua ? fecha_reciente - fecha_antigua : 0;
        return resultado;
    }

    setGravedadMayorPaciente() {
        // Este método tiene como objetivo cambiar de gravedad al paciente si el tiempo que le queda en su gravedad
        // es menor en otra gravedad mayor
        const t_restante_gravedad_actual = this.getTiempoRestante();
        const t_restante_gravedadad_mayor = this.getTiempoRestanteMayorGravedad();

        if (t_restante_gravedad_actual <= t_restante_gravedadad_mayor) {
            // Se cumple si el tiempo restante de la gravedad actual es menor al de una gravedad mayor
            const num = this.gestionar_paciente();
            this._gravedad.setGravedadMayor(num);
        } else {
            throw new cErrorPaciente("Error en setGravedadMayorPaciente");
        }

        return this.getGravedad();
    }

    gestionar_paciente() {
        // Este método cumple dos funciones:
        // - La primera es en el caso de que un paciente haya esperado mucho más tiempo del deseado, cambie directamente a una gravedad mucho mayor
        // - La segunda sería en el caso de que haya esperado el tiempo justo, este se le debería asignar la gravedad siguiente

        // Tengo que hacer que si los pacientes exceden
        // el tiempo de espera de la gravedad siguiente evaluar cuál sería la
        // gravedad a la cual saltar

        const tiempo_restante = this.getHaceCuantoLLego() - this._gravedad.getTiempoGravedadActual() - this._gravedad.getTiempoGravedadMayor();

        if (tiempo_restante > 0) {
            // Si esto se cumple es porque el paciente esperó mucho
            const tiempo_restante = this.getHaceCuantoLLego() - this._gravedad.getTiempoGravedadActual();
            try {
                const num = this.Funcion_recursiva_gravedades_mayores(tiempo_restante, this.getGravedad());
                return this.getGravedad() - (num + 1);
            } catch (e) {
                return 0; // El paciente esperó demasiado y se está por morir teóricamente
            }
        }

        const tiempo_llegada = this.getHaceCuantoLLego();  // Obtener hace cuanto llego el paciente
        const color = this.getGravedad();  // Obtener la gravedad actual

        if (tiempo_llegada > 120 * 60 * 1000 && color > 3) {
            // Acciones para pacientes con más de 120 minutos de tiempo restante
            return 3;
        } else if (tiempo_llegada > 60 * 60 * 1000 && color > 2) {
            // Acciones para pacientes con más de 60 minutos y menos de 120 minutos de tiempo restante
            return 2;
        } else if (tiempo_llegada > 10 * 60 * 1000 && color > 1) {
            // Acciones para pacientes con más de 10 minutos y menos de 60 minutos de tiempo restante
            return 1;
        } else {
            // Acciones para pacientes con menos de 10 minutos de tiempo restante
            return 0;
        }
    }

    Funcion_recursiva_gravedades_mayores(tiempo_restante, gravedad_act) {
        tiempo_restante -= this._gravedad.getTiempoGravedadMayor(gravedad_act);

        if (tiempo_restante > 0) {
            // Si > 0, significa que hay que saltar al menos una gravedad más
            return 1 + this.Funcion_recursiva_gravedades_mayores(tiempo_restante, gravedad_act - 1);
        } else {
            return 0;
        }
    }

    isEqual(other) {
        const val_2 = this._tiempoLlegada - other._tiempoLlegada;
        return this.getGravedad() === other.getGravedad() &&
            val_2 < 100 &&
            this._nombre === other._nombre;
    }
}

module.exports = { cPaciente}