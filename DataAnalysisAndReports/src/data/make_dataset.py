import os
from typing import Any, Dict, Union
import requests
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

def fetch_data_from_api(endpoint: str, params: Dict[str, Any] = None, headers: Dict[str, str] = None) -> Union[pd.DataFrame, None]:
    python_server_token = os.getenv('PYTHONSERVER')

    if headers is None:
        headers = {}
    headers['Authorization'] = f'Bearer {python_server_token}'

    try:
        response = requests.get(endpoint, params=params, headers=headers)
        response.raise_for_status()
        data = response.json()
        return pd.DataFrame(data)
    except requests.RequestException as e:
        print(f"HTTP Request failed: {e}")
        return None

def get_table(table_name: str, condition: str = '') -> Union[pd.DataFrame, None]:
    query = 'SELECT * FROM ' + table_name
    if condition != '':
        query += condition
    print('QUERY:   \"' + query + '\"')
    endpoint='http://localhost:3000/PatientByQuery/'
    df = fetch_data_from_api(endpoint, params=query, headers=None)
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
