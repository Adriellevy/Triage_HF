from cMedico import cMedico
from cEspecialidad import cEspecialidad
class cBox:
    def __init__(self,especialidadQueSeAtiende):
        self._medico= None
        self._especialidad = cEspecialidad(especialidadQueSeAtiende)
        self._disponible = True

    def set_medico(self,matricula):

        self._medico=cMedico(matricula)
    def toggle_disponibilidad(self):
        """
        Este metodo itera la disponibilidad de la clase
        """
        self._disponible = not self._disponible
        self._medico.toggle_disponibilidad()

# Getter para _medico
    def get_medico(self):
        return self._medico

    # Getter para _especialidad
    def get_especialidad(self):
        return self._especialidad

    # Getter para _disponible
    def get_disponibilidad(self):
        return self._disponible