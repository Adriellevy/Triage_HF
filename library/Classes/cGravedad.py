import datetime as dt
from .Errores.cErrorGravedad import cErrorGravedad


class cGravedad:
    def __init__(self, tipo):
        self._tipo = None
        #Estructura de la tupla ("tipo en string", tiempo en dt, valor en int del tipo)
        self._enum_prioridades = [
            ("tipo 1", dt.timedelta(0, 0, 0, 0, 0),0),
            ("tipo 2", dt.timedelta(0, 0, 0, 0, 10),1),
            ("tipo 3", dt.timedelta(0, 0, 0, 0, 30),2),
            ("tipo 4", dt.timedelta(0, 0, 0, 0, 60),3)
        ]

        _color = str(tipo.lower())
        for tupla in self._enum_prioridades:
            if _color == tupla[0]:
                self._tipo = tupla[2]
                self._TiempoGravedad = tupla[1]
        if self._tipo is None:
            raise cErrorGravedad("Tipo de gravedad no válida")
        self.atendido = False

    def getTiempoGravedadActual(self) -> dt.timedelta:
        return self._TiempoGravedad

    def getTiempoGravedadMayor(self, _color=9) -> dt.timedelta:
        if _color == 9:
            _color = self._tipo
        _color = _color - 1
        if 0 <= _color <= 2:
            return dt.timedelta(0, 0, 0, 0, [5, 10, 30][_color])
        else:
            raise cErrorGravedad("Error en getTiempoGravedadMayor, Puede que haya muerto el paciente")

    def setGravedadMayor(self, Nuevo_color):
        flag = False
        for tupla in self._enum_prioridades:
            if Nuevo_color == tupla[2]:
                self._tipo = tupla[2]
                self._TiempoGravedad = tupla[1]
                flag = True
                break
        if not flag:
            raise ValueError("Color de gravedad no válido")
    def getTipo(self):
        return self._tipo