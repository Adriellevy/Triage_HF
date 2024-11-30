import pandas as pd
import random
from datetime import datetime, timedelta

# Cargar el archivo CSV
df = pd.read_csv("TRIAGE_2024.csv")

# Identificar filas donde 'FECHA' está vacía
fecha_vacia = df["FECHA"].isna() | (df["FECHA"].str.strip() == "")

# Convertir la columna 'FECHA' a tipo datetime solo para las filas que no están vacías y establecer el año en 2024
df.loc[~fecha_vacia, "FECHA"] = pd.to_datetime(
    df.loc[~fecha_vacia, "FECHA"] + "-2024", format="%d-%m-%Y", errors="coerce"
)


# Función para generar horarios en orden ascendente
def generar_horarios_ascendentes(fecha, num_pacientes):
    hora_inicio = datetime.strptime("08:00", "%H:%M")
    hora_fin = datetime.strptime("20:00", "%H:%M")

    # Dividir el rango de tiempo en intervalos en función del número de pacientes
    intervalo = (hora_fin - hora_inicio) / num_pacientes
    horarios = [hora_inicio + i * intervalo for i in range(num_pacientes)]
    horarios = [h + timedelta(minutes=random.randint(0, 10)) for h in horarios]

    return [fecha + timedelta(hours=h.hour, minutes=h.minute) for h in horarios]


# Generar horarios en orden ascendente para cada fecha no vacía
for fecha in df["FECHA"].dropna().unique():
    indices = df[df["FECHA"] == fecha].index
    horarios = generar_horarios_ascendentes(fecha, len(indices))
    df.loc[indices, "HORA INGRESO"] = horarios


# Función para generar hora de salida aleatoria posterior a la hora de ingreso, con un máximo de 72 horas
def generar_hora_salida(hora_ingreso):
    # Tiempo máximo de estancia hasta 72 horas (3 días)s
    estancia = timedelta(hours=random.randint(1, 72), minutes=random.randint(0, 59))
    return hora_ingreso + estancia


# Generar la 'HORA SALIDA' basada en la 'HORA INGRESO'
df["HORA SALIDA"] = df["HORA INGRESO"].apply(
    lambda x: generar_hora_salida(x) if pd.notna(x) else ""
)

# Dejar en blanco 'HORA INGRESO' y 'HORA SALIDA' para filas con fecha vacía
df.loc[fecha_vacia, "HORA INGRESO"] = ""
df.loc[fecha_vacia, "HORA SALIDA"] = ""

# Guardar el resultado en un nuevo archivo CSV
df.to_csv("planilla_horarios_salida_entrada.csv", index=False)
