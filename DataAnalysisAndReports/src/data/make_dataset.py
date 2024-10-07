import os
from typing import Dict, Union
import aiohttp
import requests
import asyncio
import pandas as pd
from dotenv import load_dotenv
# import mysql.connector
# from mysql.connector.connection import MySQLConnection
# from mysql.connector.connection_cext import CMySQLConnection

load_dotenv('.env')


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

async def fetch_data_from_api(endpoint: str, headers: Dict[str, str] = None) -> Union[pd.DataFrame, None]:
    python_server_token = os.getenv('PYTHONSERVER')

    if headers is None:
        headers = {}
    headers['Authorization'] = f'Bearer {python_server_token}'

    async with aiohttp.ClientSession() as session:
        try:
            async with session.get(endpoint, headers=headers) as response:
                response.raise_for_status()
                data = await response.json()
                return pd.DataFrame(data)
        except aiohttp.ClientError as e:
            print(f"HTTP Request failed: {e}")
            return None

async def get_table(table_name: str, condition: str = '') -> Union[pd.DataFrame, None]:
    query = 'SELECT * FROM ' + table_name
    if condition != '':
        query += condition
    print('QUERY:   \"' + query + '\"')
    endpoint='http://localhost:3000/PatientByQuery/?query={' + query + '}'
    print('ENDPOINT: \"' + endpoint + '\"')
    df = await fetch_data_from_api(endpoint, headers=None)
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
