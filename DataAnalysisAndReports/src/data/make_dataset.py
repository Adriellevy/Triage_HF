import os
import typing

import mysql.connector
import pandas as pd
from dotenv import load_dotenv
from mysql.connector.connection import MySQLConnection
from mysql.connector.connection_cext import CMySQLConnection

from typing import Dict, Union
import aiohttp

from .helpers import transform_patient_data

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
    # json_recived = await asinc_get_table(table_name, condition)
    # dfs = transform_patient_data(json_recived)
    # seccion sql
    connection = connect()
    if connection:
        query = "SELECT * FROM " + table_name
        if condition != "":
            query += condition
        print('QUERY:   "' + query + '"')
        df = pd.read_sql(sql=query, con=connection)
        connection.close()
        # print("\nLa Tabla Obtenida es\n ")
        # print(df.head())
        # print("el DataFrame de sql es igual al DataFrame del json? ", df == dfs)
        return df
    else:
        return None


async def asinc_get_table(
    table_name: str, condition: str = ""
) -> Union[pd.DataFrame, None]:
    query = "SELECT * FROM " + table_name
    if condition != "":
        query += condition
    print('QUERY:   "' + query + '"')
    # USAR ESTA RUTA PARA PRUEBA CON DOCKER
    endpoint = "http://host.docker.internal:3000/PatientByQuery/" + query + ""
    # USAR ESTA RUTA PARA PRUEBA LOCAL
    # endpoint = "http://localhost:3000/PatientByQuery/" + query + ""
    print('ENDPOINT: "' + endpoint + '"')
    json_recived = await fetch_data_from_api(endpoint, headers=None)
    print("\nEl Json obtenido es:\n ")
    print(json_recived)
    return json_recived
