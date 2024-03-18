import pandas as pd
import mysql.connector

def connect():
    try:
        connection = mysql.connector.connect(
            host='localhost',
            user='root',
            password='admin',
            database='triage_db'
        )
    except mysql.connector.Error:
        return None
    return connection

def get_table(table_name):
    connection = connect()
    if connection:
        query = f'SELECT * FROM {table_name}'
        df = pd.read_sql(query, connection)
        connection.close()
        return df
    else:
        return None

# using csv locally

# def get_df():
#     return pd.read_csv('../dataset/raw/TRIAGE_2024.csv')

# using csv from github
# WARNING: you need the token
# def get_df():
#     train_df = pd.read_csv('https://raw.githubusercontent.com/Adriellevy/Triage_HF/main/Data%20Analysis%20and%20Reports/dataset/raw/TRIAGE%202024.csv?token=GHSAT0AAAAAACLM5VZGUTNJJPTGADJMMUKEZOQ3JLA')
