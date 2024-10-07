import os
from typing import Dict, Union
import aiohttp
import requests
import asyncio
import pandas as pd
from dotenv import load_dotenv
from datetime import datetime
from uuid import UUID

# import mysql.connector
# from mysql.connector.connection import MySQLConnection
# from mysql.connector.connection_cext import CMySQLConnection

load_dotenv(".env")


# def connect() -> Union[MySQLConnection, CMySQLConnection, None]:
#     try:
#         connection = mysql.connector.connect(
#             host=os.getenv('DB_HOST'),
#             user=os.getenv('DB_USER'),
#             password=os.getenv('DB_PASSWORD'),
#             port=os.getenv('DB_PORT'),
#             database=os.getenv('DB_NAME'),
#             charset=os.getenv('DB_CHARSET')
#         )
#     except mysql.connector.Error:
#         return None
#     return connection


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


def buffer_to_hex(buffer_data):
    return "".join([format(byte, "02x") for byte in buffer_data])


def convert_buffer_to_uuid(buffer_data):
    return UUID(bytes=bytes(buffer_data))


def safe_strptime(date_str, date_format):
    try:
        if date_str:
            return datetime.strptime(date_str, date_format)
        else:
            return None
    except (ValueError, TypeError) as e:
        print(f"Error al convertir la fecha: {date_str}. Detalles: {e}")
        return None


def transform_patient_data(data: list) -> pd.DataFrame:
    transformed_data = []

    # Iterar sobre cada paciente en la lista
    for patient in data:
        try:
            # Verificar si el paciente es un diccionario
            if not isinstance(patient, dict):
                raise TypeError(f"El paciente no es un diccionario válido: {patient}")

            # Convertir Buffers a UUIDs
            if (
                isinstance(patient.get("patient_id"), dict)
                and "data" in patient["patient_id"]
            ):
                patient["patient_id"] = convert_buffer_to_uuid(
                    patient["patient_id"]["data"]
                )
            if (
                isinstance(patient.get("doctor_id"), dict)
                and "data" in patient["doctor_id"]
            ):
                patient["doctor_id"] = convert_buffer_to_uuid(
                    patient["doctor_id"]["data"]
                )
            if (
                isinstance(patient.get("nurse_id"), dict)
                and "data" in patient["nurse_id"]
            ):
                patient["nurse_id"] = convert_buffer_to_uuid(
                    patient["nurse_id"]["data"]
                )
            if (
                patient.get("box_id")
                and isinstance(patient["box_id"], dict)
                and "data" in patient["box_id"]
            ):
                patient["box_id"] = convert_buffer_to_uuid(patient["box_id"]["data"])
            else:
                patient["box_id"] = None

            # Convertir strings a objetos datetime con manejo de errores
            patient["patient_age"] = safe_strptime(
                patient["patient_age"], "%Y-%m-%dT%H:%M:%S.%fZ"
            )
            patient["patient_entry_time"] = safe_strptime(
                patient["patient_entry_time"], "%Y-%m-%dT%H:%M:%S.%fZ"
            )
            patient["patient_triage_time"] = safe_strptime(
                patient["patient_triage_time"], "%Y-%m-%dT%H:%M:%S.%fZ"
            )
            patient["patient_exit_time"] = safe_strptime(
                patient["patient_exit_time"], "%Y-%m-%dT%H:%M:%S.%fZ"
            )

            # Agregar paciente transformado a la lista
            transformed_data.append(patient)

        except Exception as e:
            print(f"Error procesando el paciente: {patient}. Detalles: {e}")

    # Devolver como DataFrame
    return pd.DataFrame(transformed_data)


async def get_table(table_name: str, condition: str = "") -> Union[pd.DataFrame, None]:
    query = "SELECT * FROM " + table_name
    if condition != "":
        query += condition
    print('QUERY:   "' + query + '"')
    # USAR ESTA RUTA PARA PRUEBA CON DOCKER
    # endpoint = "http://host.docker.internal:3000/PatientByQuery/" + query + ""
    # USAR ESTA RUTA PARA PRUEBA LOCAL
    endpoint = "http://localhost:3000/PatientByQuery/" + query + ""
    print('ENDPOINT: "' + endpoint + '"')
    df = transform_patient_data(await fetch_data_from_api(endpoint, headers=None))
    print("el df obtenido es:\n ")
    print(df)
    return df


# def get_id(table_name):
#     connection = connect()
#     if connection:
#         query = 'SELECT BIN_TO_UUID(box_id) FROM {table_name}'
#         df = pd.read_sql(query, connection)
#         connection.close()
#         return df
#     else:
#         return None
