import pandas as pd
import mysql.connector

def connect():
    try:
        connection = mysql.connector.connect(
            host='localhost',
            user='root',
            password='',
            database='Triage_db',
            charset='latin1'
        )
    except mysql.connector.Error:
        return None
    return connection

def get_table(table_name, condition=None):
    connection = connect()
    if connection:
        query = f'SELECT * FROM {table_name}'
        if condition != None:
            query += f'WHERE {condition}'
        df = pd.read_sql(query, connection)
        connection.close()
        return df
    else:
        return None
    
# def get_id(table_name):
#     connection = connect()
#     if connection:
#         query = f'SELECT BIN_TO_UUID(box_id) FROM {table_name}'
#         df = pd.read_sql(query, connection)
#         connection.close()
#         return df
#     else:
#         return None