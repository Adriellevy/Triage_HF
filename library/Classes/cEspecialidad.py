class cEspecialidad:
    """
    Esta clase tiene como objetivo simplificar el modelaje, permitiendo migrar de un
    sistema a otro teniendo todas las especialidades al alcance:

    Pediatría = 0
    Cardiologia = 1
    Terapia Intesiva = 2
    Nefrologia = 3
    Neumología = 4
    Urilogía = 5
    Estudios de Imagenes = 6
    Estudioo de Laboratorio = 7
    Rehabilitacion = 8

    """
    def __init__(self,especialidad):
        especialidades_validas = [
            "Pediatría",
            "Cardiología",
            "Terapia Intensiva",
            "Nefrología",
            "Neumología",
            "Urología",
            "Estudios de Imágenes",
            "Estudios de Laboratorio",
            "Rehabilitación"
        ]

        if especialidad not in especialidades_validas:
            raise ValueError(f"Especialidad no válida. Las especialidades válidas son: {especialidades_validas}")

        self._especialidad = especialidad