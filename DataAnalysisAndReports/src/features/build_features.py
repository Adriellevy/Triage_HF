import pandas as pd
from datetime import timedelta
import data.make_dataset as md

def filter_discharged(df):
    return df[df['PATIENT_STATUS'] == 'ALTA']

def filter_isolated(df):
    return df[df['PATIENT_STATUS'] == 'AISLAMIENTO']

def filter_box_type(df, box_type):
    df_box = md.get_table('BOX')
    new_df = df.merge(df_box, on='BOX_ID')
    return new_df[new_df['BOX_TYPE'] == box_type]

def filter_doctor_username(df, doctor_username):
    df_user = md.get_table('USERS')
    new_df = df.merge(df_user, left_on='DOCTOR_ID', right_on='USER_ID')
    return new_df[new_df['USER_NAME'] == doctor_username]

def filter_nurse_username(df, nurse_username):
    df_user = md.get_table('USERS')
    new_df = df.merge(df_user, left_on='NURSE_ID', right_on='USER_ID')
    return new_df[new_df['USER_NAME'] == nurse_username]

def drop_id_feature(df):
    return df.iloc[:, 1:]

def get_last_week(df):
    to = df['entry_time'].max()
    from_ = to - timedelta(days=7)
    return (from_, to)


def filters(df, from_=None, to=None, patient_name=None, patient_problem=None, box_type=None, doctor_username=None, nurse_username=None, discharged=None, isolated=None):
    if (from_ == None and to == None):
        from_, to = get_last_week(df)
    else:
        from_ = pd.to_datetime(from_, format='%Y-%m-%d', errors='coerce')
        to = pd.to_datetime(to, format='%Y-%m-%d', errors='coerce')

    df = df[(df['entry_time'] >= from_) & (df['entry_time'] <= to)]

    if (patient_name != None):
        df = df[df['patient_name'] == patient_name.upper()]

    if (patient_problem != None):
        df = df[df['patient_problem'] == patient_problem.upper()]

    if (box_type != None):
        df = filter_box_type(df, box_type)

    if (doctor_username != None):
        df = filter_doctor_username(df, box_type)

    if (nurse_username != None):
        df = filter_nurse_username(df, nurse_username)

    if (discharged != None):
        df = filter_discharged(df)

    if (isolated != None):
        df = filter_isolated(df)

    return df

def build_number_patients_date(df):    
    df = df.groupby(['entry_time', 'patient_triage_level'], sort=False).size(
    ).reset_index(name='number_of_patients')
    

    df['patient_triage_level'] = df['patient_triage_level'].apply(lambda x: str(int(float(x))))
    df = df[df['patient_triage_level'] != '0']

    df.sort_values(by='entry_time', inplace=True)
    
    df = df.sort_values(by=['patient_triage_level', 'entry_time', 'number_of_patients'])
    
    return df

def build_top_queries_date(df, top=10, order=None):
    df = df.groupby(['patient_problem', 'patient_triage_level']).size(
    ).reset_index(name='problem_count')

    top_reasons = df.groupby('patient_problem')[
        'problem_count'].sum().nlargest(top).index
    count = df[df['patient_problem'].isin(top_reasons)]

    if (order == 'asc'):
        count = count.sort_values(by=['patient_problem', 'patient_triage_level'], key=lambda x: x.map(
            dict(zip(top_reasons, range(len(top_reasons))))))

    count = count.sort_values(by=['patient_problem', 'patient_triage_level'], key=lambda x: x.map(
        dict(zip(top_reasons[::-1], range(len(top_reasons))))))

    count['patient_triage_level'] = count['patient_triage_level'].apply(lambda x: str(int(float(x))))
    count = count[count['patient_triage_level'] != '0']
    
    count = count.sort_values(by=['patient_triage_level', 'patient_problem', 'problem_count'])

    return count

def build_features(df, from_=None, to=None, patient_name=None, patient_problem=None, box_type=None, doctor_username=None, nurse_username=None, discharged=None, isolated=None):
    df = drop_id_feature(df)
    
    df = filters(df, from_, to, patient_name, patient_problem,
                 box_type, doctor_username, nurse_username, discharged, isolated)
    
    
    return df