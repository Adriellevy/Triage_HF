import statistics as st
# 
# 
# IDEAS METRICAS
# - La media de cantidad de pacientes por fecha ingresados es de {media}
# - La cantidad de pacientes por fecha más frecuente es de {moda}
# - El 50% de las fechas se ingresan más de {mediana} pacientes
# - El dia que menos pacientes ingresaron fue {fecha} con un total de {max} pacientes
# - El dia que más pacientes ingresaron fue {fecha} con un total de {min} pacientes
#
#

#
# TENGO QUE
#   calcular media check
#   calcular moda check 
#   calcular mediana
#   calcular fecha donde más pacientes ingresaron
#   calcular fecha donde menos pacientes ingresaron
#  
# y luego esto mismo para cada nivel de triage
#
#
#

def calculate_total(df, y):
    return df[y].sum()

def calculate_mean(df, y):
    return df[y].mean()

def calculate_mode(df, y):
    return st.mode(df[y])

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
    return f'La media de {txt_y} es de {int(calculate_mean(df, y))}'

def mode(txt_y, df, y):
    return f'La cantidad de {txt_y} más frecuente es de {int(calculate_mode(df, y))}'

def median(txt_x, txt_y, df, y):
    return f'El 50% de {txt_x} se registraron más de {int(calculate_median(df, y))} {txt_y}'

def min(txt_x, txt_y, df, x, y):
    return f'La {txt_x} que menos {txt_y} se registraron fue el {calculate_min_x(df, x, y)} con {calculate_min(df, y)} {txt_y}'

def max(txt_x, txt_y, df, x, y):
    return f'La {txt_x} que más {txt_y} se registraron fue el {calculate_max_x(df, x, y)} con {calculate_max(df, y)} {txt_y}'

def metrics_data(df, x, y, txt_x, txt_y):
    df_sum = df.groupby(df[x])[y].sum().reset_index(name='number_of_patients')
    print(df_sum)
    return {
        'total': total(txt_y, df_sum, y),
        'mean': mean(txt_y, df_sum, y),
        'mode': mode(txt_y, df_sum, y),
        'median': median(txt_x, txt_y, df_sum, y),
        'min': min(txt_x, txt_y, df_sum, x, y),
        'max': max(txt_x, txt_y, df_sum, x, y)
    }
    