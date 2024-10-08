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
    json_recived = await asinc_get_table(table_name, condition)
    dfj = pd.DataFrame(json_recived)
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
        # Verificar si tienen los mismos nombres de columnas
        if list(df.columns) != list(dfj.columns):
            print("Las columnas no coinciden:")
            print("SQL Columns:", list(df.columns))
            print("JSON Columns:", list(dfj.columns))

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
        print(dfj.dtypes)

        # Comparar tipos de datos
        print("Tipos de datos de SQL DataFrame:")
        print(df.dtypes)
        print("\nTipos de datos de JSON DataFrame:")
        print(dfj.dtypes)

        # Compara los DataFrames por diferencia de contenido
        patient_id = "c86989cf-4e69-11ef-9ed6-0a002700000f"  # Reemplaza con el ID del paciente que quieres comparar

        # Selecciona al paciente correspondiente en ambos DataFrames
        df_patient_sql = df[df["patient_id"] == patient_id]
        df_patient_json = dfj[dfj["patient_id"] == patient_id]

        # Reinicia el índice para asegurar que las comparaciones se alineen correctamente
        df_patient_sql.reset_index(drop=True, inplace=True)
        df_patient_json.reset_index(drop=True, inplace=True)

        # Comparar fila a fila y campo a campo
        differences = {}
        for column in df_patient_sql.columns:
            sql_value = (
                df_patient_sql[column].iloc[0] if not df_patient_sql.empty else None
            )
            json_value = (
                df_patient_json[column].iloc[0] if not df_patient_json.empty else None
            )
            if sql_value != json_value:
                differences[column] = {
                    "SQL": sql_value,
                    "JSON": json_value,
                    "Expected Type for JSON": type(sql_value).__name__,
                }

        # Imprimir las diferencias
        if differences:
            print("Diferencias encontradas:")
            for column, diff in differences.items():
                print(f"\nCampo: {column}")
                print(f"  SQL: {diff['SQL']}")
                print(f"  JSON: {diff['JSON']}")
                print(f"  Tipo esperado para JSON: {diff['Expected Type for JSON']}")
        else:
            print("No se encontraron diferencias para este paciente.")
        return dfj
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
