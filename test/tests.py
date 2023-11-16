import pytest
from library.Classes.cQuesMaestra import *
from library.Classes.cManejoArchivo import *
from library.Classes.cSalaEspera import *
from library.Classes import cRandoms


def test_Error_Insercion_Gravedad():
    """
    Este test tiene que asertar si al paciente se lo instancia con una gravedad distinta a las posibles
    :return:
    """
    with pytest.raises(cErrorGravedad):
        paciente_1 = cPaciente("Julian", "-", 1, None, None, None)


def test_Paciente_Indepndendica_Gravedad_MayusMinus():
    """
    Este test tiene que asertar al darle a diferentes pacientes la misma gravedad si se escribe diferente
        :return:
    """
    paciente_1 = cPaciente("Julian", "TIPO 1", 1, None, None, None)
    paciente_2 = cPaciente("andres", "tipo 1", 1, None, None, None)
    assert paciente_1.getGravedad() is paciente_2.getGravedad()


# ---------------- TEST CAMBIO DE GRAVEDAD TIPO 2 -----------------
def test_Paciente_cambio_de_gravedad_tipo2():
    """
    Si el paciente esta en sala de espera por mas del tiempo permitido debe cambiar de gravedad
    :return:
    """
    paciente_1 = cPaciente("1", "tipo 2", 1, None, None, None)
    paciente_1.setTiempoLlegada(paciente_1.getTiempoLLegada() - dt.timedelta(minutes=10))
    paciente_1.setGravedadMayorPaciente()
    assert paciente_1.getGravedad() == 0


def test_Paciente_sin_cambio_de_gravedad_tipo2():
    with pytest.raises(cErrorPaciente):
        paciente_1 = cPaciente("2", "tipo 2", 1, None, None, None)
        paciente_1.setTiempoLlegada(paciente_1.getTiempoLLegada() - dt.timedelta(minutes=5))
        paciente_1.setGravedadMayorPaciente()
        assert paciente_1.getGravedad() == 2


# ---------------- TEST GRAVEDADES TIPO 3 -----------------
def test_Paciente_cambio_de_gravedad_tipo3():
    paciente_1 = cPaciente("2", "tipo 3", 1, None, None, None)
    paciente_1.setTiempoLlegada(paciente_1.getTiempoLLegada() - dt.timedelta(minutes=30))
    paciente_1.setGravedadMayorPaciente()
    assert paciente_1.getGravedad() == 1


def test_Paciente_sin_cambio_de_gravedad_tipo3():
    with pytest.raises(cErrorPaciente):
        paciente_1 = cPaciente("3", "tipo 4", 1, None, None, None)
        paciente_1.setTiempoLlegada(paciente_1.getTiempoLLegada() - dt.timedelta(minutes=20))
        paciente_1.setGravedadMayorPaciente()
        assert paciente_1.getGravedad() == 2


# ---------------- TEST CAMBIO DE GRAVEDAD TIPO 4-----------------
def test_Paciente_cambio_de_gravedad_tipo4():
    paciente_1 = cPaciente("2", "tipo 4", 1, None, None, None)
    paciente_1.setTiempoLlegada(paciente_1.getTiempoLLegada() - dt.timedelta(minutes=61))
    paciente_1.setGravedadMayorPaciente()
    assert paciente_1.getGravedad() == 2


def test_Paciente_sin_cambio_de_gravedad_tipo4():
    with pytest.raises(cErrorPaciente):
        paciente_1 = cPaciente("3", "tipo 4", 1, None, None, None)
        paciente_1.setTiempoLlegada(paciente_1.getTiempoLLegada() - dt.timedelta(minutes=50))
        paciente_1.setGravedadMayorPaciente()
        assert paciente_1.getGravedad() == 3


# ---------------- TEST CAMBIO DE GRAVEDADES MULTIPLES PACIENTES -----------------

def test_Paciente_cambio_de_gravedad_varias_gravedades():
    paciente_1 = cPaciente("1", "tipo4", 1, None, None, None)
    paciente_1.setTiempoLlegada(paciente_1.getTiempoLLegada() - dt.timedelta(minutes=90))
    paciente_1.setGravedadMayorPaciente()
    assert paciente_1.getGravedad() == 1


def test_Paciente_tiempo_restante():
    """
    Revisar este test
    :return:
    """
    paciente_1 = cPaciente("Julian", "naranja", 1, None, None, None)
    paciente_1.setTiempoLlegada(dt.datetime.now() - dt.timedelta(minutes=10))
    paciente_1.setGravedadMayorPaciente()
    assert paciente_1.getTiempoRestante() == dt.timedelta(0, 0, 0, 0, 0)


def test_cQuesMaestra_Insertar():
    paciente_1 = cPaciente("Julian1", "tipo 1", 1, None, None, None)
    paciente_2 = cPaciente("Julian2", "tipo 2", 1, None, None, None)
    paciente_3 = cPaciente("Julian3", "tipo 3", 1, None, None, None)
    paciente_4 = cPaciente("Julian4", "tipo 4", 1, None, None, None)
    Organizador = cQuesMaestra()
    Organizador.insert(paciente_1)
    Organizador.insert(paciente_2)
    Organizador.insert(paciente_3)
    Organizador.insert(paciente_4)
    assert Organizador.tipo_1.qsize() == 1
    assert Organizador.tipo_2.qsize() == 1
    assert Organizador.tipo_3.qsize() == 1
    assert Organizador.tipo_4.qsize() == 1


def test_cQuesMaestra_Obtener():
    paciente_1 = cPaciente("Julian1", "tipo 1", 1, None, None, None)
    paciente_2 = cPaciente("Julian2", "tipo 2", 1, None, None, None)
    paciente_3 = cPaciente("Julian3", "tipo 3", 1, None, None, None)
    paciente_4 = cPaciente("Julian4", "tipo 4", 1, None, None, None)
    Organizador = cQuesMaestra()
    Organizador.insert(paciente_1)
    Organizador.insert(paciente_2)
    Organizador.insert(paciente_3)
    Organizador.insert(paciente_4)
    assert Organizador.Lista_de_colas[3].get() == paciente_4
    assert Organizador.Lista_de_colas[2].get() == paciente_3
    assert Organizador.Lista_de_colas[1].get() == paciente_2
    assert Organizador.Lista_de_colas[0].get() == paciente_1


def test_cQuesMaestra_Reorganizar():
    paciente_1 = cPaciente("Julian", "tipo 2", 1, None, None, None)
    paciente_2 = cPaciente("Julian2", "tipo 4", 1, None, None, None)
    Organizador = cQuesMaestra()
    Organizador.insert(paciente_1)
    Organizador.insert(paciente_2)
    paciente_1.setTiempoLlegada(dt.datetime.now() - dt.timedelta(minutes=10))
    Organizador.Reorganizar()
    paciente_obtenido = Organizador.Lista_de_colas[0].get()
    assert paciente_obtenido == paciente_1


def test_cQuesMaestra_Reorganizar_Multiples_Pacientes():
    Organizador = cQuesMaestra()
    Lista_Pacientes = []
    Enum = ["tipo 1", "tipo 2", "tipo 3", "tipo 4"]
    cant = 20  # seteo el numero de pacientes
    cantidad_de_prioridades = 4
    # AGREGO 20 PACIENTES A UNA LISTA
    for i in range(0, cant):
        nombre = "" + str(i)  # seteo el nombre de los pacientes
        gravedad = i % cantidad_de_prioridades  # seteo la gravedad de forma que la gravedad de los pacientes es ciclica de 0 a 4
        pac = cPaciente(nombre, Enum[gravedad], 1, None, None, None)  # El seteo de la gravedad es al estilo enum
        Lista_Pacientes.append(pac)  # agrego al paciente a la listas de pacientes
        Organizador.insert(pac)  # agrego al paciente a

    # cambio la gravedad 4 de 5 pacientes que son categoria 2 a la 1
    for j in range(1, cant - cantidad_de_prioridades, cantidad_de_prioridades):
        Lista_Pacientes[j].setTiempoLlegada(Lista_Pacientes[j].getTiempoLLegada() - dt.timedelta(minutes=10))

    # cambio la gravedad 4 de 5 pacientes que son categoria 4 a la 3
    for t in range(4, cant - cantidad_de_prioridades, cantidad_de_prioridades):
        Lista_Pacientes[t].setTiempoLlegada(Lista_Pacientes[t].getTiempoLLegada() - dt.timedelta(minutes=60))

    Organizador.Reorganizar()
    assert Organizador.tipo_1.qsize() == 9
    assert Organizador.tipo_3.qsize() == 9


def test_cQuesMaestra_cantidad_absurda_pacientes():
    Organizador = cQuesMaestra()
    Lista_Pacientes = []
    Enum = ["Tipo 1", "Tipo 2", "Tipo 3", "Tipo 4"]
    cant = 100  # seteo el numero de pacientes
    Bucles = int(cant / 5)
    # AGREGO 20 PACIENTES A UNA LISTA
    for i in range(0, cant):
        nombre = "" + str(i)  # seteo el nombre de los pacientes
        gravedad = i % 5  # seteo la gravedad de forma que la gravedad de los pacientes es ciclica de 0 a 4
        pac = cPaciente(nombre, Enum[gravedad], 1, None, None, None)  # El seteo de la gravedad es al estilo enum
        Lista_Pacientes.append(pac)  # agrego al paciente a la listas de pacientes
        Organizador.insert(pac)  # agrego al paciente a
    # cambio la gravedad de 3 pacientes que son categoria azul a la verde
    for j in range(2, cant - 5, Bucles):
        Lista_Pacientes[j].setTiempoLlegada(Lista_Pacientes[j].getTiempoLLegada() - dt.timedelta(minutes=61))
    # cambio la gravedad de 3 pacientes que son categoria amarilla a la naranja
    for t in range(4, cant - 5, Bucles):
        Lista_Pacientes[t].setTiempoLlegada(Lista_Pacientes[t].getTiempoLLegada() - dt.timedelta(minutes=241))

    Organizador.Reorganizar()
    assert Organizador.N.qsize() == 7
    assert Organizador.V.qsize() == 7


def test_cQuesMaestra_Reorganizar_Multiples_Rojos_Sin_posibilidad_atencion():
    Organizador = cQuesMaestra()
    Lista_Pacientes = []
    Enum = ["rojo", "naranja", "amarillo", "verde", "azul"]
    cant = 20  # seteo el numero de pacientes
    # AGREGO 20 PACIENTES A UNA LISTA
    for i in range(0, cant):
        nombre = "" + str(i)  # seteo el nombre de los pacientes
        gravedad = i % 5  # seteo la gravedad de forma que la gravedad de los pacientes es ciclica de 0 a 4
        pac = cPaciente(nombre, Enum[gravedad], 1, None, None, None)  # El seteo de la gravedad es al estilo enum
        Lista_Pacientes.append(pac)  # agrego al paciente a la listas de pacientes
        Organizador.insert(pac)  # agrego al paciente a

    # cambio la gravedad de 3 pacientes que son categoria azul a la roja
    for t in range(4, cant - 5, 5):
        Lista_Pacientes[t].setTiempoLlegada(Lista_Pacientes[t].getTiempoLLegada() - dt.timedelta(minutes=431))

    # cambio la gravedad de 3 pacientes que son categoria amarilla a la roja
    for j in range(2, cant - 5, 5):
        Lista_Pacientes[j].setTiempoLlegada(Lista_Pacientes[j].getTiempoLLegada() - dt.timedelta(minutes=71))

    # cambio la gravedad de 3 paciente que son categoría naranja a roja
    for t in range(1, cant - 5, 5):
        Lista_Pacientes[t].setTiempoLlegada(Lista_Pacientes[t].getTiempoLLegada() - dt.timedelta(minutes=10))
    Organizador.Reorganizar()
    assert Organizador.R.qsize() == 13


def test_lectura_archivo():
    # Trabajo con el operador de archivo
    handler = cManejoArchivo()
    data = handler.buscar_paciente("paciente 1")
    assert data is not None
