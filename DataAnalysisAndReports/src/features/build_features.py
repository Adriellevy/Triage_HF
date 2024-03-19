import pandas as pd
import numpy as np

from data.make_dataset import get_table

def getDischarged(df):
    return df[df['PATIENT_STATUS'] == 'ALTA']

def getIsolated(df):
    return df[df['PATIENT_STATUS'] == 'AISLAMIENTO']

def getBoxType(df, box_type):
    df_box = get_table('BOX')
    new_df = df.merge(df_box, on='BOX_ID')
    return new_df[new_df['BOX_TYPE'] == box_type]

def getDoctorUsername(df, doctor_username):
    df_user = get_table('USERS')
    new_df = df.merge(df_user, left_on='DOCTOR_ID', right_on='USER_ID')
    return new_df[new_df['USER_NAME'] == doctor_username]

def getNurseUsername(df, nurse_username):
    df_user = get_table('USERS')
    new_df = df.merge(df_user, left_on='NURSE_ID', right_on='USER_ID')
    return new_df[new_df['USER_NAME'] == nurse_username]


# def remove_headers(df):
#     return df[df['NUMERO DE TURNO'].str.contains('FECHA|N°') == False]


# def remove_null_rows(df):
#     return df[df['NOMBRE Y APELLIDO'].notnull()]


# def triage_level_to_integer(df):
#     new_values = {'I': 1, 'II': 2, 'III': 3, 'IV': 4}
#     df['TRIAGE'] = df['TRIAGE'].replace(new_values)
#     return pd.to_numeric(df['TRIAGE'], downcast='signed', errors='coerce')


# def entry_date_to_datetime(df):
#     df['FECHA DE INGRESO'] = df['FECHA DE INGRESO'] + '-2024'
#     return pd.to_datetime(df['FECHA DE INGRESO'], format='%d-%m-%Y', errors='coerce')


# def isolated_to_boolean(df):
#     new_values = {np.nan: False, 'NO': False, 'No': False, 'KPC': True,
#                   'ECOLI METALO': True, 'SI': True, 'Si': True, 'A': True}
#     df['AISLADO'] = df['AISLADO'].map(new_values)
#     df = df[df['AISLADO'] != '724']
#     return df['AISLADO'].astype(bool)


# def generating_alta_col(df):
#     df = df[~df['DESTINO'].isin(
#         ['?', 'INT', 'HMD/ 315', 'HMD', ' ', '    ', '  ', ])]
#     df['ALTA'] = df['DESTINO'].str.contains(
#         'alta|obito|traslado|derivacion|AL. VOL|DERIVAC',
#         case=False,
#         regex=True)
#     return df['ALTA'].fillna(False)


# def remove_colums(df):
#     cols_to_keep = ['NUMERO DE TURNO', 'FECHA DE INGRESO', 'NOMBRE Y APELLIDO',
#                     'MOTIVO DE CONSULTA', 'BOX', 'TRIAGE', 'ENFERMERO', 'MEDICO', 'DESTINO', 'ALTA', 'AISLADO']
#     return df[cols_to_keep]


# def build_features(df):
#     df = cols_rename(df)
#     df = remove_headers(df)
#     df = remove_null_rows(df)
#     df['TRIAGE'] = triage_level_to_integer(df)
#     df['FECHA DE INGRESO'] = entry_date_to_datetime(df)
#     df['AISLADO'] = isolated_to_boolean(df)
#     df['ALTA'] = generating_alta_col(df)
#     df = remove_colums(df)
#     return df
