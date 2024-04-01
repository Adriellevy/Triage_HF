import statistics as st
# 
# 
# IDEAS METRICAS
#
#

#
# TENGO QUE
#
#   
# checkear metricas para cada nivel de triage
#
#
#

def calculate_total(df, y):
    return df[y].sum()

def calculate_mean(df, y):
    return df[y].mean()

def calculate_median(df, y):
    return df[y].median()
    
def calculate_max(df, y):
    return df[y].max()

def calculate_min(df, y):
    return df[y].min()

def calculate_min_x(df, x, y):
    return df.loc[df[y].idxmin(), x]

def calculate_max_x(df, x, y):
    return df.loc[df[y].idxmax(), x]

def total(txt_y, df, y):
    return f'El total de {txt_y} ingresados es de {calculate_total(df, y)}'

def mean(txt_y, df, y):
    return f'La media de {txt_y} es de {round(calculate_mean(df, y),2)}'

def min(txt_x, txt_y, df, x, y):
    return f'La {txt_x} que menos {txt_y} se registraron fue el {calculate_min_x(df, x, y)} con {calculate_min(df, y)} {txt_y}'

def max(txt_x, txt_y, df, x, y):
    return f'La {txt_x} que más {txt_y} se registraron fue el {calculate_max_x(df, x, y)} con {calculate_max(df, y)} {txt_y}'

def metrics_data(df, x, y, txt_x, txt_y):
    df_sum = df.groupby(df[x])[y].sum().reset_index(name='number_of_patients')
    return {
        'total': total(txt_y, df_sum, y),
        'mean': mean(txt_y, df_sum, y),
        'min': min(txt_x, txt_y, df_sum, x, y),
        'max': max(txt_x, txt_y, df_sum, x, y)
    }
    