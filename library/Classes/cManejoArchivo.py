from datetime import datetime, timedelta
import datetime as dt
import os
from pathlib import Path

import pandas as pd
from .cEnfermero import *
class cManejoArchivo:
    def __init__(self, archivo_csv=None):
        # Assuming the current script is in the directory you want to go up from
        current_directory = Path(__file__).resolve().parent
        # Go up three levels
        three_levels_up = current_directory.parent.parent.parent
        # Access the file in the desired location
        file_path = three_levels_up / "Triage_HF" / "lista_pacientes.csv"
        archivo_csv = file_path

        if archivo_csv==None or not os.path.isfile(archivo_csv):
            self._archivo_csv = archivo_csv
            self._base_de_pacientes = pd.DataFrame(
                columns=["Nombre", "Edad", "Gravedad", "Historial", "Enfermero", "Fecha", "Caso Clinico"])
            self.guardar_archivo()  # Guardar el archivo nuevo

        else:
            # El archivo ya existe, cargar los datos
            self._archivo_csv = archivo_csv
            self._base_de_pacientes = pd.read_csv(self._archivo_csv)
    def agregar_paciente(self, paciente):
        enfermero= paciente.getEnfermero()
        nuevo_paciente = pd.DataFrame(
            {"Nombre": [paciente.getNombre()], "Edad": [paciente.getEdad()], "Gravedad": [paciente.getGravedad()],
             "Historial": [paciente.getHistorial()], "Enfermero": [enfermero.getNombreEnfermero()],
             "Matricula": [enfermero.getMatricula()],
             "Caso Clinico": [paciente.getCasoClinico()],
             "Fecha": [paciente.getTiempoLLegada()]})
        self._base_de_pacientes = pd.concat([self._base_de_pacientes, nuevo_paciente], ignore_index=True)
        self.guardar_archivo()



    def editar_paciente(self, nombre,fecha, nueva_edad, nueva_gravedad, nuevo_historial, nuevo_enfermero):
        paciente = self.busqueda_interna(nombre, fecha)
        if paciente is not None:
            self._base_de_pacientes.at[paciente.index, "Edad"] = nueva_edad
            self._base_de_pacientes.at[paciente.index, "Gravedad"] = nueva_gravedad
            self._base_de_pacientes.at[paciente.index, "Historial"] = nuevo_historial
            self._base_de_pacientes.at[paciente.index, "Enfermero"] = nuevo_enfermero
            self.guardar_archivo()  # Guardar el DataFrame actualizado
            return True
        else:
            return False

    def leer_otro_archivo(self, archivo_csv_otro):
        try:
            pacientes_otro = pd.read_csv(archivo_csv_otro)
            self._base_de_pacientes = pd.concat([self._base_de_pacientes, pacientes_otro], ignore_index=True)
            self.guardar_archivo()
            return True
        except FileNotFoundError:
            return False

    def guardar_archivo(self):
        self._base_de_pacientes.to_csv(self._archivo_csv, index=False)
        print(f"Archivo con paciente derivado guardado en {self._archivo_csv}")

    def obtener_indice_paciente(self, nombre, fecha):
        paciente = self.busqueda_interna(nombre, fecha)
        if paciente is not None:
            return paciente.index
        else:
            return None

    def busqueda_interna(self, nombre=None, edad=None, Caso_Clinico=None):

        # Verifica si se proporciona al menos uno de los parámetros
        if nombre is None and edad is None and Caso_Clinico is None:
            return None

        # Crea una serie de booleanos que indica si el valor está presente en la columna correspondiente
        filtro_nombre = self._base_de_pacientes["Nombre"].isin([nombre]) if nombre else True
        filtro_fecha = self._base_de_pacientes["Edad"].isin([edad]) if edad else True
        filtro_caso_clinico = self._base_de_pacientes["Caso_Clinico"].isin([Caso_Clinico]) if Caso_Clinico else True

        # Aplica los filtros
        pacientes_filtrados = self._base_de_pacientes[filtro_nombre & filtro_fecha & filtro_caso_clinico]

        # Filtra por la condición de menos de 72 horas
        if not pacientes_filtrados.empty:
            ahora = datetime.now()
            pacientes_filtrados = pacientes_filtrados[pacientes_filtrados["Fecha"] > (ahora - dt.timedelta(hours=200))]

        # Si no se encontraron pacientes después de aplicar todos los filtros, devuelve None
        if pacientes_filtrados.empty:
            return None

        # Devuelve el DataFrame correspondiente al paciente encontrado
        return pacientes_filtrados

    def buscar_paciente(self, nombre="", caso_clinico=""):
        """
        Funcion generada por chat gpt
        """
        if nombre !="" and caso_clinico != "":
            # Si ambos parámetros están presentes, busca si hay algún dato que comparte ambos
            resultado = self._base_de_pacientes[
                (self._base_de_pacientes['Nombre'].str.contains(nombre, case=False)) &
                (self._base_de_pacientes['Caso Clinico'] == caso_clinico)
                ]
        elif nombre is not None:
            resultado = self._base_de_pacientes[self._base_de_pacientes['Nombre'].str.contains(nombre, case=False)]
        elif caso_clinico is not None:
            resultado = self._base_de_pacientes[self._base_de_pacientes['Caso Clinico'] == caso_clinico]
        else:
            print("Se requiere al menos un nombre o un caso clínico.")
            return None

            # Filtrar por pacientes que hayan llegado hace menos de 72 horas
        resultado = resultado[pd.to_datetime(resultado['Fecha']) > (datetime.now() - timedelta(hours=72))]

        return resultado
    def BusquedaUltimo(self):
        indice_max_valor = self._base_de_pacientes['Caso Clinico'].idxmax()
        caso_clinico_mas_grande = self._base_de_pacientes.loc[indice_max_valor]['Caso Clinico']
        return caso_clinico_mas_grande

    def buscar_en_archivo_paciente(self, nombre,fecha):
        """
        Este metodo funcionaba antes, hay que revisar por los cambios de tipos"""
        # Filtra el DataFrame en función del nombre y la fecha
        pacientes_filtrados = self._base_de_pacientes[
            (self._base_de_pacientes["Nombre"] == nombre) & (self._base_de_pacientes["Fecha"] == fecha)
            ]

        # Si no se encontraron pacientes, devuelve None
        if pacientes_filtrados.empty:
            return None

        # Extrae los datos del primer paciente encontrado
        paciente_data = pacientes_filtrados.iloc[0]

        _color = 0
        if(paciente_data["Gravedad"]==0):
            _color = "rojo"
        elif(paciente_data["Gravedad"]==1):
            _color = "naranja"
        elif (paciente_data["Gravedad"] == 2):
            _color = "amarillo"
        elif (paciente_data["Gravedad"] == 3):
            _color = "verde"
        elif (paciente_data["Gravedad"] == 4):
            _color = "azul"

        #Creo el Objeto Enfermero
        enfermero = cEnfermero(paciente_data["Enfermero"],paciente_data["Matricula"])

        # Crea un objeto cPaciente con los datos extraídos
        paciente = cPaciente(
            paciente_data["Nombre"],
            _color, #le agrego la clase gravedad
            paciente_data["Edad"],
            paciente_data["Caso Clinico"],
            enfermero, #le agrego la clase enfermero
            paciente_data["Historial"]
        )

        return paciente

    def obtener_ultimos_datos(self):
        ultimos_datos = self._base_de_pacientes.tail(5)
        return ultimos_datos

    def pacientes_buscando_cama(self):
        """
        Devuelve una lista de pacientes que están buscando una cama en función del historial.
        """
        if "Historial" not in self._base_de_pacientes.columns:
            # Asegúrate de que la columna "Historial" existe en el DataFrame
            return []

        pacientes_buscando_cama = self._base_de_pacientes[self._base_de_pacientes["Historial"] == "Buscando Cama"]
        return pacientes_buscando_cama
