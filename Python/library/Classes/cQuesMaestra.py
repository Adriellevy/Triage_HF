import queue
from .cManejoArchivo import *
from .Errores.cErrorTamanio import cErrorTamanio
from .Errores.cErrorGravedad import cErrorGravedad
from .Errores.cErrorPaciente import cErrorPaciente

class cQuesMaestra:
    def __init__(self):
        self._cantCategorias=4
        self.tipo_1 = queue.Queue(maxsize=0)
        self.tipo_2 = queue.Queue(maxsize=0)
        self.tipo_3 = queue.Queue(maxsize=0)
        self.tipo_4 = queue.Queue(maxsize=0)
        #self.AZ = queue.Queue(maxsize=0)
        self.Lista_de_colas = []
        self.Lista_de_colas.append(self.tipo_1)
        self.Lista_de_colas.append(self.tipo_2)
        self.Lista_de_colas.append(self.tipo_3)
        self.Lista_de_colas.append(self.tipo_4)
        #self.Lista_de_colas.append(self.AZ)
        self.Handler = cManejoArchivo()

    def Reorganizar(self, indice_lista=3):
        """
        El parametro indice_lista por default tiene la ecuacion
        """
        if indice_lista == 0:
            return 1
        if(self.Lista_de_colas[indice_lista].qsize()==0):
            return self.Reorganizar(indice_lista - 1)
        obj_act = self.Lista_de_colas[indice_lista].queue[0]
        if obj_act.getTiempoRestante() > obj_act.getTiempoRestanteMayorGravedad():
            return self.Reorganizar(indice_lista - 1)
        else:
            num = obj_act.setGravedadMayorPaciente()
            obj_act = self.Lista_de_colas[indice_lista].get_nowait()
            self.Lista_de_colas[num].put_nowait(obj_act)
            return self.Reorganizar(indice_lista)


    def insert(self, _paciente):
        try:
            num = -1
            try:
                num = _paciente.getGravedad()
            except cErrorGravedad("En el insert") as err:
                num = _paciente.setGravedadMayorPaciente()
            self.Lista_de_colas[num].put_nowait(_paciente)
        except cErrorTamanio("Error en el insert") as errorTam:
            print(cErrorTamanio)

    def ObtenerProximo(self):
        if(self.tipo_1.qsize()>0):
            return self.tipo_1.get_nowait()
        elif (self.tipo_2.qsize() > 0):
            return self.tipo_2.get_nowait()
        elif (self.tipo_3.qsize() > 0):
            return self.tipo_3.get_nowait()
        elif (self.tipo_4.qsize() > 0):
            return self.tipo_4.get_nowait()
        else:
            raise cErrorTamanio("No hay pacientes a atender")

    def AtenderProximo(self):
        """En este metodo guardamos en el archivo al paciente mas importante"""
        self.Handler.agregar_paciente(self.ObtenerProximo())

    def obtener_cantidad_total_pacientes(self):
        cantidad_total = sum(cola.qsize() for cola in self.Lista_de_colas)
        return cantidad_total

    def contar_pacientes_gravedad_tipo_1(self):
        return self.tipo_1.qsize()

    def contar_pacientes_gravedad_tipo_2(self):
        return self.tipo_2.qsize()

    def contar_pacientes_gravedad_tipo_3(self):
        return self.tipo_3.qsize()

    def contar_pacientes_gravedad_tipo_4(self):
        return self.tipo_4.qsize()
