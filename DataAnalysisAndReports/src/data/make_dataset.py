import pandas as pd
import mysql.connector

def connect():
    try:
        connection = mysql.connector.connect(
            host='localhost',
            user='root',
            password='',
            database='Triage_db'
        )
    except mysql.connector.Error:
        return None
    return connection

def get_table(table_name, condition=None):
    connection = connect()
    if connection:
        query = f'SELECT created_at, patient_name, date_of_birth, entry_time, exit_time, patient_triage_time, patient_triage_level, patient_box, patient_status, patient_problem, patient_medication, doctor_id, nurse_id, box_id FROM {table_name}'
        if condition != None:
            query += f'WHERE {condition}'
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
