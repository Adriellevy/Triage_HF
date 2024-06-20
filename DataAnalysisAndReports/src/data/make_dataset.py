import os
import typing

import mysql.connector
import pandas as pd
from dotenv import load_dotenv
from mysql.connector.connection import MySQLConnection
from mysql.connector.connection_cext import CMySQLConnection

load_dotenv()


def connect() -> typing.Union[MySQLConnection, CMySQLConnection, None]:
    try:
        connection = mysql.connector.connect(
            host=os.getenv('DB_HOST'),
            user=os.getenv('DB_USER'),
            password=os.getenv('DB_PASSWORD'),
            port=os.getenv('DB_PORT'),
            database=os.getenv('DB_NAME'),
            charset=os.getenv('DB_CHARSET')
        )
    except mysql.connector.Error:
        return None
    return connection


def get_table(table_name: str, condition: str = '') -> typing.Union[pd.DataFrame, None]:
    connection = connect()
    if connection:
        query = 'SELECT * FROM ' + table_name
        if condition != '':
            query += condition
        print('QUERY:   \"' + query + '\"')
        df = pd.read_sql(sql=query,
                         con=connection)
        connection.close()
        return df
    else:
        return None

# def get_id(table_name):
#     connection = connect()
#     if connection:
#         query = 'SELECT BIN_TO_UUID(box_id) FROM {table_name}'
#         df = pd.read_sql(query, connection)
#         connection.close()
#         return df
#     else:
#         return None
