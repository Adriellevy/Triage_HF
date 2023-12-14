

class cMedico:
    def __init__(self,matricula):
        self._disponible = True
        self._Matricula = matricula
    def getDisponibilidad(self):
        return self._disponible

    def toggle_disponibilidad(self):
        # Cambia el estado de disponibilidad
        self._disponible = not self._disponible
