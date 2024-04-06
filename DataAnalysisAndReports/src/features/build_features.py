import pandas as pd
import datetime as dt
import data.make_dataset as md
from typing import Dict, Tuple, Any, List, Union

def order_triage_top_queries_date(df: pd.DataFrame)-> pd.DataFrame:
    first_rows: pd.DataFrame = df.head(4)
    values: list[str] = ['Nivel I', 'Nivel II', 'Nivel III', 'Nivel IV']
    i: int = 0
    for value in values:
        if not first_rows['patient_triage_level'].str.contains(value).all():

            insert: Dict[str, Any] = {
                'patient_symptom': df.loc[df['patient_triage_level'] == value, 'patient_symptom'].values[0],
                'patient_triage_level': value,
                'symptom_count': 0
            }

            df = insert_row(i, df, insert)
        i=i+1

    return df

def insert_row(row_number: int, df: pd.DataFrame, row_value: Dict[str, Any]) -> pd.DataFrame:
    start_upper: int = 0
    end_upper: int = row_number
    start_lower: int = row_number
    end_lower: int = df.shape[0]
    upper_half: list[int] = [*range(start_upper, end_upper, 1)]
    lower_half: list[int] = [*range(start_lower, end_lower, 1)]
    lower_half: list[int] = [x.__add__(1) for x in lower_half]
    index_: pd.Index[int] = pd.Index(upper_half + lower_half)
    df.index = index_
    df.loc[row_number] = pd.Series(row_value)
    df = df.sort_index()
    return df

def filter_dictionary(dictionary: Dict[str, Any], keys: List[str]) -> Dict[str, Any]:
    return dict((k,dictionary[k]) for k in (keys) if k in dictionary)

def date_filters(df: pd.DataFrame, dictionary: Dict[str, Any]) -> pd.DataFrame:
    if (dictionary['from_'] == None and dictionary['to'] == None):
        dictionary['from_'], dictionary['to'] = get_last_week(df)
    else:
        dictionary['from_'] = pd.to_datetime(dictionary['from_'], format='%Y-%m-%d', errors='coerce')
        dictionary['to'] = pd.to_datetime(dictionary['to'], format='%Y-%m-%d', errors='coerce')

    df = df[(df['patient_entry_time'] >= dictionary['from_']) & (df['patient_entry_time'] <= dictionary['to'])]

    return df


def drop_id_feature(df: pd.DataFrame) -> pd.DataFrame:
    return df.iloc[:, 1:]

def triage_level_style(df: pd.DataFrame) -> pd.Series:
    df['patient_triage_level'] = df['patient_triage_level'].apply(lambda x: str(int(float(x))))
    df = df[df['patient_triage_level'] != '0']
    mapping: Dict[str, str] = {'1': 'Nivel I', '2': 'Nivel II', '3': 'Nivel III', '4': 'Nivel IV'}
    return df['patient_triage_level'].map(mapping)

def get_last_week(df: pd.DataFrame) -> Tuple[pd.Timestamp, pd.Timestamp]:
    to: pd.Timestamp = df['patient_entry_time'].max()
    from_: pd.Timestamp = to.replace(hour=0, minute=0) - dt.timedelta(days=6)
    return (from_, to)

def where_filters(dictionary: Dict[str, Any]) -> str:
    query: str = ' WHERE '
    print(dictionary)
    
    for key, value in dictionary.items():
        if value is not None:
            if key == 'patient_isolated':
                query += f'{key}={value} AND '
            elif key == 'doctor_full_name' or key == 'nurse_full_name':
                query += f'user_full_name=\'{value}\' AND '
            else:
                query += f'{key}=\'{value}\' AND '

    if query == ' WHERE ':
        return ''
    else:
        return query[:-4]

def join_filters(dictionary: Dict[str, Any]) -> str:
    query: str = ''
    for key, value in dictionary.items():
        if value is not None:
            if key == 'doctor_full_name':
                query += 'JOIN User ON User.user_id '
            if key == 'nurse_full_name':
                query += 'JOIN User ON User.user_id '
            if key == 'box_type':
                query += 'JOIN Box ON Box.box_id '
    if query == '':
        return ''
    else:
        return query[:-1]

def build_number_patients_date(df: pd.DataFrame) -> pd.DataFrame:
    df['patient_entry_time'] = df['patient_entry_time'].dt.date
    df = df.groupby(['patient_entry_time', 'patient_triage_level'], sort=False).size().reset_index(name='number_of_patients') # type: ignore

    df.sort_values(by='patient_entry_time', inplace=True)

    df = df.sort_values(by=['patient_triage_level', 'patient_entry_time', 'number_of_patients'])

    return df

def build_top_queries_date(df: pd.DataFrame, top: int=10, order: str='') -> pd.DataFrame:
    df = df.groupby(['patient_symptom', 'patient_triage_level']).size().reset_index(name='symptom_count') # type: ignore

    top_reasons: pd.Index[str] = df.groupby('patient_symptom')['symptom_count'].sum().nlargest(top).index
    count: pd.DataFrame = df[df['patient_symptom'].isin(top_reasons)]

    if (order == 'asc'):
        count = count.sort_values(by=['patient_symptom', 'patient_triage_level'], key=lambda x: x.map(
            dict(zip(top_reasons, range(len(top_reasons)))))).reset_index(drop=True)

    count = count.sort_values(by=['patient_symptom', 'patient_triage_level'], key=lambda x: x.map(
        dict(zip(top_reasons[::-1], range(len(top_reasons)))))).reset_index(drop=True)

    count = order_triage_top_queries_date(count)
    
    return count

def build_features(table_name: str, dictionary: Dict[str, Any]) -> pd.DataFrame:
    where_dictionary: Dict[str, Any] = filter_dictionary(dictionary, ['patient_age', 'patient_isolated', 'patient_status', 'patient_symptom', 'patient_healthcare_system', 'doctor_full_name', 'nurse_full_name', 'box_type'])
    join_dictionary: Dict[str, Any] = filter_dictionary(dictionary, ['doctor_full_name', 'nurse_full_name', 'box_type'])

    condition: str = join_filters(join_dictionary) + where_filters(where_dictionary)

    df: pd.DataFrame= md.get_table(table_name, condition)

    if df.empty == True:
        return pd.DataFrame()

    df = date_filters(df, dictionary)

    df = drop_id_feature(df)

    df['patient_triage_level'] = triage_level_style(df)

    return df