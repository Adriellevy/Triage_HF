import pandas as pd
import datetime as dt
from datetime import datetime
import data.make_dataset as md

# def filter_isolated(df):
#     return df[df['patient_isolated'] == True]

# def filter_box_type(df, box_type):
#     df_box = md.get_table('BOX')
#     new_df = df.merge(df_box, on='BOX_ID')
#     return new_df[new_df['BOX_TYPE'] == box_type]

# def filter_doctor_username(df, doctor_username):
#     df_user = md.get_table('USERS')
#     new_df = df.merge(df_user, left_on='DOCTOR_ID', right_on='USER_ID')
#     return new_df[new_df['USER_NAME'] == doctor_username]

# def filter_nurse_username(df, nurse_username):
#     df_user = md.get_table('USERS')
#     new_df = df.merge(df_user, left_on='NURSE_ID', right_on='USER_ID')
#     return new_df[new_df['USER_NAME'] == nurse_username]
    
def filter_dictionary(dictionary, keys):
    return dict((k,dictionary[k]) for k in (keys) if k in dictionary)

def date_filters(df, dictionary):
    if ( dictionary['from_'] == None and dictionary['to'] == None):
        dictionary['from_'], dictionary['to'] = get_last_week(df)
    else:
        dictionary['from_'] = pd.to_datetime(dictionary['from_'], format='%Y-%m-%d', errors='coerce')
        dictionary['to'] = pd.to_datetime(dictionary['to'], format='%Y-%m-%d', errors='coerce')
    
    df = df[(df['patient_entry_time'] >= dictionary['from_']) & (df['patient_entry_time'] <= dictionary['to'])]
    
    return df


def drop_id_feature(df):
    return df.iloc[:, 1:]

def triage_level_style(df):
    df['patient_triage_level'] = df['patient_triage_level'].apply(lambda x: str(int(float(x))))
    df = df[df['patient_triage_level'] != '0']    
    mapping = {'1': 'Nivel I', '2': 'Nivel II', '3': 'Nivel III', '4': 'Nivel IV'}
    return df['patient_triage_level'].map(mapping)

def get_last_week(df):
    to = df['patient_entry_time'].max()
    from_ = to.replace(hour=0, minute=0) - dt.timedelta(days=6)
    return (from_, to)


def where_filters(dictionary):
    query = ''
    for key, value in dictionary.items():
        if value != None and key != 'patient_isolated':
            query += f'{key}=\'{value}\' AND '
        elif value != None and key == 'patient_isolated':
            query += f'{key}={value} AND '
    
    if query == '':
        return None
    else:
        return query[:-5]
    
def join_filters(dictionary):
    query = ''
    for key, value in dictionary.items():
        if value != None:
            if key == 'doctor_full_name':
                query += 'User ON user_id'
            if key == 'nurse_full_name':
                query += 'User ON user_id'
            if key == 'box_type':
                query += 'Box ON box_id'
    return query
        
    

def build_number_patients_date(df):    
    df['patient_entry_time'] = df['patient_entry_time'].dt.date
    df = df.groupby(['patient_entry_time', 'patient_triage_level'], sort=False).size(
    ).reset_index(name='number_of_patients')
    
    df.sort_values(by='patient_entry_time', inplace=True)
    
    df = df.sort_values(by=['patient_triage_level', 'patient_entry_time', 'number_of_patients'])
    
    return df

def build_top_queries_date(df, top=10, order=None):
    df = df.groupby(['patient_symptom', 'patient_triage_level']).size(
    ).reset_index(name='symptom_count')

    top_reasons = df.groupby('patient_symptom')[
        'symptom_count'].sum().nlargest(top).index
    count = df[df['patient_symptom'].isin(top_reasons)]
    
    if (order == 'asc'):
        count = count.sort_values(by=['patient_symptom', 'patient_triage_level'], key=lambda x: x.map(
            dict(zip(top_reasons, range(len(top_reasons)))))).reset_index(drop=True)

    count = count.sort_values(by=['patient_symptom', 'patient_triage_level'], key=lambda x: x.map(
        dict(zip(top_reasons[::-1], range(len(top_reasons)))))).reset_index(drop=True)

    return count

def build_features(table_name, dictionary):
    where_dictionary = filter_dictionary(dictionary, ['patient_age', 'patient_isolated', 'patient_status', 'patient_symptom', 'patient_healthcare_system', 'doctor_full_name', 'nurse_full_name', 'box_type'])    
    join_dictionary = filter_dictionary(dictionary, ['doctor_full_name', 'nurse_full_name', 'box_type']) 
    
    #query = join_filters(join_dictionary) + where_filters(where_dictionary)
    
    df = md.get_table(table_name, None)
    
    if df.empty == True:
        return None
    
    df = date_filters(df, dictionary)

    df = drop_id_feature(df)
    
    df['patient_triage_level'] = triage_level_style(df)
    
    return df