import statistics as st
# 
# 
# IDEAS METRICAS
# - La media de cantidad de pacientes por fecha ingresados es de {media}
# - La cantidad de pacientes por fecha mas frecuente es de {moda}
# - El 50% de las fechas se ingresan mas de {mediana} pacientes
# - El dia que menos pacientes ingresaron fue {fecha}
# - El dia que mas pacientes ingresaron fue {fecha}
#
#

#
# TENGO QUE
#   calcular media check
#   calcular moda check 
#   calcular mediana
#   calcular fecha donde menos pacientes ingresaron
#   calcular fecha donde mas pacientes ingresaron
#  
# y luego esto mismo para cada nivel de triage
#
#
#

def calculate_mean(df, y):
    return df[y].mean()

def calculate_mode(df, y):
    return st.mode(df[y])

# def calculate_median(df, y):
    
