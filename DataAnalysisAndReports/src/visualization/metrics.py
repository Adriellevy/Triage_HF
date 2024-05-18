# Typed
from typing import Any, Dict, Union
from pandas import DataFrame

def format_number(number: Union[int, float]) -> Union[int, float]:
    if number == int(number):
        return int(number)
    return round(number, 1)

def calculate_total(df: DataFrame, y: str) -> int:
    return df[y].sum()

def calculate_mean(df: DataFrame, y: str) -> float:
    return df[y].mean()

def calculate_max(df: DataFrame, y: str) -> Any:
    return df[y].max()

def calculate_min(df: DataFrame, y: str) -> Any:
    return df[y].min()

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
    string = f'El total de {txt} '
    if z != '' and lvl != '':
        df = df[df[z] == lvl]
        string += f'en {lvl} '
    string += f'fue de {calculate_total(df, y)}'
    return string

def mean(df: DataFrame, y: str, txt: str, z: str = '', lvl: str = '') -> str:
    string = f'La media de {txt} '
    if z != '' and lvl != '':
        df = df[df[z] == lvl]
        string += f'en {lvl} '
    string += f'fue de {round(calculate_mean(df, y), 2)}'
    return string
    
def min(df: DataFrame, y: str, txt: str, x:str, z: str = '', lvl: str = '') -> str:
    string = f'El mínimo de {txt} '
    if z != '' and lvl != '':
        df = df[df[z] == lvl]
        string += f'en {lvl} '
    string += f'fue de {calculate_min(df, y)} ({calculate_min_x(df, y, x)})'
    return string

def max(df: DataFrame, y: str, txt: str, x:str, z: str = '', lvl: str = '') -> str:
    string = f'El máximo de {txt} '
    if z != '' and lvl != '':
        df = df[df[z] == lvl]
        string += f'en {lvl} '
    string += f'fue de {calculate_max(df, y)} ({calculate_max_x(df, y, x)})'
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