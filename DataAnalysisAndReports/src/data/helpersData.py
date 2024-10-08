import pandas as pd
import uuid
from datetime import datetime
import json


def transform_patient_data(patients_json, query):
    dfj = pd.DataFrame(patients_json)

    if query.find("Patients") != -1:
        print("La palabra 'Patients' está en el texto.")
        # Convertir columnas de fecha a datetime
        date_columns = [
            "patient_age",
            "patient_entry_time",
            "patient_exit_time",
            "patient_triage_time",
        ]
        for column in date_columns:
            dfj[column] = pd.to_datetime(dfj[column], errors="coerce").dt.tz_localize(
                None
            )

        print("Tipos de datos del DataFrame JSON:")
        print(dfj.dtypes)

        return dfj
    else:
        print("La palabra 'Patients' no está en el texto.")


def compare_dataframes(
    df_sql: pd.DataFrame, df_json: pd.DataFrame, patient_id: str
) -> dict:
    # Selecciona al paciente correspondiente en ambos DataFrames
    df_patient_sql = df_sql[df_sql["patient_id"] == patient_id]
    df_patient_json = df_json[df_json["patient_id"] == patient_id]

    # Reinicia el índice para asegurar que las comparaciones se alineen correctamente
    df_patient_sql.reset_index(drop=True, inplace=True)
    df_patient_json.reset_index(drop=True, inplace=True)

    # Comparar fila a fila y campo a campo
    differences = {}
    for column in df_patient_sql.columns:
        sql_value = df_patient_sql[column].iloc[0] if not df_patient_sql.empty else None
        json_value = (
            df_patient_json[column].iloc[0] if not df_patient_json.empty else None
        )
        if sql_value != json_value:
            differences[column] = {
                "SQL": sql_value,
                "JSON": json_value,
                "Expected Type for JSON": type(sql_value).__name__,
            }

    # Devolver las diferencias
    return differences
