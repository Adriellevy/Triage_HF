import os
import typing

import mysql.connector
import pandas as pd
from dotenv import load_dotenv
from mysql.connector.connection import MySQLConnection
from mysql.connector.connection_cext import CMySQLConnection

from typing import Dict, Union
import aiohttp

from .helpersData import transform_patient_data

load_dotenv()


def connect() -> typing.Union[MySQLConnection, CMySQLConnection, None]:
    try:
        connection = mysql.connector.connect(
            host=os.getenv("DB_HOST"),
            user=os.getenv("DB_USER"),
            password=os.getenv("DB_PASSWORD"),
            port=os.getenv("DB_PORT"),
            database=os.getenv("DB_NAME"),
            charset=os.getenv("DB_CHARSET"),
        )
    except mysql.connector.Error:
        return None
    return connection


# Seccion APIII:


async def fetch_data_from_api(
    endpoint: str, headers: Dict[str, str] = None
) -> Union[pd.DataFrame, None]:
    load_dotenv()
    python_server_token = os.getenv("PYTHONSERVER")
    print(f"Token obtenido: {python_server_token}")  # Verificar si el token es None
    if headers is None:
        headers = {}
    headers["Authorization"] = f"Bearer {python_server_token}"

    async with aiohttp.ClientSession() as session:
        try:
            async with session.get(endpoint, headers=headers) as response:
                response.raise_for_status()
                data = (
                    await response.json()
                )  # Asegúrate de que el backend devuelve JSON.
                if isinstance(
                    data, list
                ):  # Si es una lista, intenta convertirla en un DataFrame.
                    return pd.DataFrame(data)
                else:
                    print(f"Unexpected data format: {data}")
                    return None
        except aiohttp.ClientError as e:
            print(f"HTTP Request failed: {e}")
            return None
        except Exception as e:
            print(f"An error occurred: {e}")
            return None


async def get_table(
    table_name: str, condition: str = ""
) -> typing.Union[pd.DataFrame, None]:
    json_recived = await asinc_get_table(table_name, condition)
    return json_recived


async def asinc_get_table(
    table_name: str, condition: str = ""
) -> Union[pd.DataFrame, None]:
    query = "SELECT * FROM " + table_name
    if condition != "":
        query += condition
    print('QUERY:   "' + query + '"')
    # Recuperar el host de la variable de entorno APP_HOST
    app_host = os.getenv("APP_HOST")
    if not app_host:
        print("Error: APP_HOST no está configurado en las variables de entorno.")
        return None

    # Construir el endpoint usando el APP_HOST
    endpoint = app_host + "/PatientByQuery/" + query + ""
    # USAR ESTA RUTA PARA PRUEBA CON DOCKER
    # endpoint = "http://host.docker.internal:3000/PatientByQuery/" + query + ""
    # USAR ESTA RUTA PARA PRUEBA LOCAL
    # endpoint = "http://localhost:3000/PatientByQuery/" + query + ""
    print('ENDPOINT: "' + endpoint + '"')
    json_recived = await fetch_data_from_api(endpoint, headers=None)

    if json_recived.empty:
        return pd.DataFrame()

    if table_name.lower() == "patient":
        dfj = pd.DataFrame(json_recived)

        dfj["patient_age"] = pd.to_datetime(dfj["patient_age"], errors="coerce")
        dfj["patient_entry_time"] = pd.to_datetime(
            dfj["patient_entry_time"], errors="coerce"
        )
        dfj["patient_exit_time"] = pd.to_datetime(
            dfj["patient_exit_time"], errors="coerce"
        )
        dfj["patient_triage_time"] = pd.to_datetime(
            dfj["patient_triage_time"], errors="coerce"
        )

        # Eliminar la zona horaria de las columnas datetime del JSON DataFrame
        dfj["patient_age"] = dfj["patient_age"].dt.tz_localize(None)
        dfj["patient_entry_time"] = dfj["patient_entry_time"].dt.tz_localize(None)
        dfj["patient_exit_time"] = dfj["patient_exit_time"].dt.tz_localize(None)
        dfj["patient_triage_time"] = dfj["patient_triage_time"].dt.tz_localize(None)

        # Verificar nuevamente los tipos de datos después de eliminar la zona horaria
        # print(dfj.dtypes)
        return dfj
    else:
        print("El dataframe no fue restructurado")
        return None
    return json_recived
