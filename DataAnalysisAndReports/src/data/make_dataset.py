from mysql.connector.connection import MySQLConnection
from mysql.connector.connection_cext import CMySQLConnection
from typing import Union

import pandas as pd
import mysql.connector

def connect() -> Union[MySQLConnection, CMySQLConnection, None]:
    try:
        connection: Union[MySQLConnection, CMySQLConnection] = mysql.connector.connect(
            host='localhost',
            user='root',
            password='',
            database='Triage_db',
            charset='latin1'
        ) 
    except mysql.connector.Error:
        return None
    return connection

def get_table(table_name: str, condition: str='') -> pd.DataFrame:
    connection = connect()
    if connection:
        query = f'SELECT * FROM {table_name}'
        if condition != '':
            query += f' {condition}'
        print(query)
        df = pd.read_sql(sql=query,
                         con=connection)
        connection.close()
        return df
    else:
        return pd.DataFrame()
    
# def get_id(table_name):
#     connection = connect()
#     if connection:
#         query = f'SELECT BIN_TO_UUID(box_id) FROM {table_name}'
#         df = pd.read_sql(query, connection)
#         connection.close()
#         return df
#     else:
#         return None