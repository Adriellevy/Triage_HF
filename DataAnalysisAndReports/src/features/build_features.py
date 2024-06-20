import datetime as dt
from datetime import datetime
from typing import Dict, Tuple, Any, List, Union

import data.make_dataset as md
import numpy as np
import pandas as pd
from pandas import DataFrame


def age_groups(df: DataFrame) -> None:
    age_group = []
    for age in df['patient_age']:
        age = calculate_age(age)
        if age <= 40:
            age_group.append('0 a 40')
        elif 40 < age <= 60:
            age_group.append('41 a 60')
        elif 60 < age <= 80:
            age_group.append('61 a 80')
        else:
            age_group.append('+80')
    df['patient_age_group'] = age_group


def calculate_age(born: datetime) -> int:
    return dt.date.today().year - born.year - ((dt.date.today().month, dt.date.today().day) < (born.month, born.day))


def filter_dictionary(dictionary: Dict[str, Any], keys: List[str]) -> Dict[str, Any]:
    return dict((k, dictionary[k]) for k in keys if k in dictionary)


def date_filters(df: DataFrame, dictionary: Dict[str, Any]) -> DataFrame:
    if dictionary['from_'] is None and dictionary['to'] is None:
        dictionary['from_'], dictionary['to'] = get_last_week(df)
    else:
        dictionary['from_'] = pd.to_datetime(dictionary['from_'], format='%Y-%m-%d', errors='coerce')
        dictionary['to'] = pd.to_datetime(dictionary['to'], format='%Y-%m-%d', errors='coerce')

    df = df[(df['patient_entry_time'] >= dictionary['from_']) & (df['patient_entry_time'] <= dictionary['to'])]

    return df


def drop_id_feature(df: DataFrame) -> DataFrame:
    return df.iloc[:, 1:]


def triage_level_style(df: DataFrame) -> pd.Series:
    df['patient_triage_level'] = df['patient_triage_level'].apply(lambda x: str(int(float(x))))

    df = df[df['patient_triage_level'] != '0']

    mapping = {'1': 'Nivel I', '2': 'Nivel II', '3': 'Nivel III', '4': 'Nivel IV'}
    return df['patient_triage_level'].map(mapping)


def get_last_week(df: DataFrame) -> Tuple[pd.Timestamp, pd.Timestamp]:
    to = df['patient_entry_time'].max()
    from_ = to.replace(hour=0, minute=0) - dt.timedelta(days=6)

    return from_, to


def where_filters(dictionary: Dict[str, Any]) -> str:
    query = ' WHERE '

    for key, value in dictionary.items():
        if value is not None:
            if key == 'patient_isolated':
                query += key + '=' + value
            elif key == 'doctor_full_name' or key == 'nurse_full_name':
                query += 'user_full_name=\'' + value + '\' AND '
            else:
                query += key + '=\'' + value + '\' AND '

    if query == ' WHERE ':
        return ''
    else:
        return query[:-4]


def join_filters(dictionary: Dict[str, Any]) -> str:
    query = ' JOIN '

    for key, value in dictionary.items():
        if value is not None:
            if key == 'doctor_full_name':
                query += 'User ON Patient.doctor_id = User.user_id '
            if key == 'nurse_full_name':
                query += 'User ON Patient.nurse_id = User.user_id '
            if key == 'box_type':
                query += 'JOIN Box ON Box.box_id '

    if query == ' JOIN ':
        return ''
    else:
        return query[:-1]


def build_number_patients_date(df: DataFrame, group_cond: str, rename: Dict[Any, str] = None) -> DataFrame:
    df['patient_entry_time'] = df['patient_entry_time'].dt.date

    df = df.groupby(['patient_entry_time', group_cond], sort=False).size().reset_index(
        name='number_of_patients')

    df = df.sort_values(by=[group_cond, 'patient_entry_time', 'number_of_patients'])

    if rename:
        df[group_cond] = df[group_cond].replace(rename)

    return df


def build_top_queries_date(df: DataFrame, group_cond: str, rename: Dict[Any, str] = None, top: int = 10,
                           order: str = '') -> DataFrame:
    df = df.groupby(['patient_symptom', group_cond]).size().reset_index(name='symptom_count')

    top_reasons = df.groupby('patient_symptom')['symptom_count'].sum().nlargest(top).index
    df = df[df['patient_symptom'].isin(top_reasons)]

    all_triage_levels = df[group_cond].unique()

    all_combinations = []
    for symptom in df['patient_symptom'].unique():
        for triage_level in all_triage_levels:
            all_combinations.append({'patient_symptom': symptom, group_cond: triage_level})

    all_combinations_df = DataFrame(all_combinations)

    merged_df = pd.merge(all_combinations_df, df, on=['patient_symptom', group_cond], how='left')
    merged_df['symptom_count'].fillna(0, inplace=True)

    merged_df = merged_df.sort_values(by=[group_cond, 'symptom_count'], ascending=[True, False])

    if order == 'asc':
        merged_df = merged_df.sort_values(by=['patient_symptom'], key=lambda x: x.map(
            dict(zip(top_reasons[::-1], range(len(top_reasons)))))).reset_index(drop=True)
    else:
        merged_df = merged_df.sort_values(by=['patient_symptom', group_cond], key=lambda x: x.map(
            dict(zip(top_reasons, range(len(top_reasons)))))).reset_index(drop=True)

    if rename:
        merged_df[group_cond] = merged_df[group_cond].replace(rename)

    return merged_df


def build_patients_mean_time(df: DataFrame, group_cond1: str, group_cond2: str) -> DataFrame:
    df['patient_delta_time'] = df['patient_exit_time'] - df['patient_entry_time']

    df['patient_entry_time'] = df['patient_entry_time'].dt.date

    df = df.groupby([group_cond1, group_cond2])['patient_delta_time'].mean().reset_index(
        name='patient_mean_delta_time')

    df['patient_mean_delta_time'] = (df['patient_mean_delta_time']
                                     .apply(lambda x: x / np.timedelta64(1, 'm')))

    df = df.sort_values(by=[group_cond2, group_cond1])
    return df


def build_features(table_name: str, dictionary: Dict[str, Any], condition: str = '') -> Union[DataFrame, None]:
    pd.options.display.max_rows = None
    pd.options.display.max_columns = None

    if condition == '':
        where_dictionary = filter_dictionary(dictionary,
                                             ['patient_age', 'patient_isolated', 'patient_status',
                                              'patient_symptom', 'patient_healthcare_system',
                                              'doctor_full_name', 'nurse_full_name', 'box_type'])
        join_dictionary = filter_dictionary(dictionary,
                                            ['doctor_full_name', 'nurse_full_name', 'box_type'])

        condition = join_filters(join_dictionary) + where_filters(where_dictionary)

    df = md.get_table(table_name, condition)

    if df is None:
        return None
    elif df.empty:
        return DataFrame()

    df["patient_entry_time"] = pd.to_datetime(df['patient_entry_time'], errors='coerce')
    df["patient_exit_time"] = pd.to_datetime(df['patient_exit_time'], errors='coerce')

    df = date_filters(df, dictionary)

    df = drop_id_feature(df)

    df['patient_triage_level'] = triage_level_style(df)

    age_groups(df)

    return df
