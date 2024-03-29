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
