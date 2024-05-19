# Typed
from typing import Any, Dict, Union
from pandas import DataFrame

import pandas as pd

def calculate_total(df: DataFrame, y: str) -> int:
    return df[y].sum()

def calculate_mean(df: DataFrame, y: str) -> float:
    return df[y].mean() if not pd.isna(df[y].mean()) else 0

def calculate_max(df: DataFrame, y: str) -> Any:
    return df[y].max() if not pd.isna(df[y].max()) else 0

def calculate_min(df: DataFrame, y: str) -> Any:
    return df[y].min() if not pd.isna(df[y].min()) else 0

def calculate_min_x(df: DataFrame, y: str, x: str) -> Any:
    try:
        return df.loc[df[y].idxmin(), x]
    except (ValueError, KeyError):
        return 0

def calculate_max_x(df: DataFrame, y: str, x: str) -> Any:
    try:
        return df.loc[df[y].idxmax(), x]
    except (ValueError, KeyError):
        return 0

def total(df: DataFrame, y: str, txt: str, z: str = '', lvl: str = '') -> str:
    string: str = f'El total de {txt} '
    if z != '' and lvl != '':
        df = df[df[z] == lvl]
        string += f'en {lvl} '
    string += f'fue de {calculate_total(df, y)}'
    return string

def mean(df: DataFrame, y: str, txt: str, z: str = '', lvl: str = '') -> str:
    string: str = f'La media de {txt} '
    if z != '' and lvl != '':
        df = df[df[z] == lvl]
        string += f'en {lvl} '
    string += f'fue de {round(calculate_mean(df, y), 2)}'
    return string
    
def min(df: DataFrame, y: str, txt: str, x:str, z: str = '', lvl: str = '') -> str:
    string: str = f'El mínimo de {txt} '
    if z != '' and lvl != '':
        df = df[df[z] == lvl]
        string += f'en {lvl} '
    min_x: Any = calculate_min_x(df, y, x) 
    string += f'fue de {calculate_min(df, y)}' + (f' ({min_x})' if min_x != 0 else '')
    return string

def max(df: DataFrame, y: str, txt: str, x:str, z: str = '', lvl: str = '') -> str:
    string = f'El máximo de {txt} '
    if z != '' and lvl != '':
        df = df[df[z] == lvl]
        string += f'en {lvl} '
    max_x: Any = calculate_max_x(df, y, x) 
    string += f'fue de {calculate_max(df, y)}' + (f' ({max_x})' if max_x != 0 else '')
    return string

def metrics_data(df: DataFrame, y: str, txt: str, x:str, z: str, expand: Dict[str, str]) -> Dict[str, str]:
    df_sum: DataFrame = df.groupby(df[x])[y].sum().reset_index(name=y)
    dict: Dict[str, str] = {}
    dict['total'] = total(df_sum, y, txt)
    dict['mean'] = mean(df_sum, y, txt)
    dict['min'] = min(df_sum, y, txt, x)
    dict['max'] = max(df_sum, y, txt, x)
    for key, val in expand.items():
        dict['total_' + key] = total(df, y, txt, z, val)
        dict['mean_' + key] = mean(df, y, txt, z, val)
        dict['min_' + key] = min(df, y, txt, x, z, val)
        dict['max_' + key] = max(df, y, txt, x, z, val)
    
    return dict