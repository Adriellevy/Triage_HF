import pandas as pd
from typing import Any, Dict

def calculate_total(df: pd.DataFrame, y: str) -> int:
    return df[y].sum()

def calculate_mean(df: pd.DataFrame, y: str) -> float:
    return df[y].mean()

def calculate_max(df: pd.DataFrame, y: str) -> Any:
    return df[y].max()

def calculate_min(df: pd.DataFrame, y: str) -> Any:
    return df[y].min()

def calculate_min_x(df: pd.DataFrame, y: str, x: str) -> Any:
    return df.loc[df[y].idxmin(), x]

def calculate_max_x(df: pd.DataFrame, y: str, x: str) -> Any:
    return df.loc[df[y].idxmax(), x]

def total(df: pd.DataFrame, y: str, txt: str, z: str = '', lvl: str = '') -> str:
    string = f'El total de {txt} '
    if z != '' and lvl != '':
        df = df[df[z] == lvl]
        string += f'en {lvl} '
    string += f'fue de {calculate_total(df, y)}'
    return string

def mean(df: pd.DataFrame, y: str, txt: str, z: str = '', lvl: str = '') -> str:
    string = f'La media de {txt} '
    if z != '' and lvl != '':
        df = df[df[z] == lvl]
        string += f'en {lvl} '
    string += f'fue de {round(calculate_mean(df, y), 2)}'
    return string
    
def min(df: pd.DataFrame, y: str, txt: str, x:str, z: str = '', lvl: str = '') -> str:
    string = f'El minimo de {txt} '
    if z != '' and lvl != '':
        df = df[df[z] == lvl]
        string += f'en {lvl} '
    string += f'fue de {calculate_min(df, y)} ({calculate_min_x(df, y, x)})'
    return string

def max(df: pd.DataFrame, y: str, txt: str, x:str, z: str = '', lvl: str = '') -> str:
    string = f'El maximo de {txt} '
    if z != '' and lvl != '':
        df = df[df[z] == lvl]
        string += f'en {lvl} '
    string += f'fue de {calculate_max(df, y)} ({calculate_max_x(df, y, x)})'
    return string

def metrics_data(df: pd.DataFrame, y: str, txt: str, x:str, z: str) -> Dict[str, str]:
    df_sum: pd.DataFrame = df.groupby(df[x])[y].sum().reset_index(name=y)
    return {
        'total': total(df, y, txt),
        'total_triage_I': total(df, y, txt, z, 'Nivel I'),
        'total_triage_II': total(df, y, txt, z, 'Nivel II'),
        'total_triage_III': total(df, y, txt, z, 'Nivel III'),
        'total_triage IV': total(df, y, txt, z, 'Nivel IV'),
        'mean': mean(df_sum, y, txt),
        'mean_triage_I': mean(df, y, txt, z, 'Nivel I'),
        'mean_triage_II': mean(df, y, txt, z, 'Nivel II'),
        'mean_triage_III': mean(df, y, txt, z, 'Nivel III'),
        'mean_triage_IV': mean(df, y, txt, z, 'Nivel IV'),
        'min': min(df_sum, y, txt, x),
        'min_triage_I': min(df, y, txt, x, z, 'Nivel I'),
        'min_triage_II': min(df, y, txt, x, z, 'Nivel II'),
        'min_triage_III': min(df, y, txt, x, z, 'Nivel III'),
        'min_triage_IV': min(df, y, txt, x, z, 'Nivel IV'),
        'max': max(df_sum, y, txt, x),
        'max_triage_I': max(df, y, txt, x, z, 'Nivel I'),
        'max_triage_II': max(df, y, txt, x, z, 'Nivel II'),
        'max_triage_III': max(df, y, txt, x, z, 'Nivel III'),
        'max_triage_IV': max(df, y, txt, x, z, 'Nivel IV')
    }