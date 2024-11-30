import pandas as pd
import random

# Cargar el archivo CSV
df = pd.read_csv("planilla_horarios_salida_entrada.csv")

# Lista de usuarios del archivo db_demo.sql
users = [
    {"name": "Dr. Smith", "role": "DOCTOR"},
    {"name": "Nurse Brown", "role": "NURSE"},
    {"name": "Dr. Smith2", "role": "DOCTOR"},
    {"name": "Hospital Admin", "role": "HOSPITAL"},
    {"name": "GIMENEZ, ALEXIS", "role": "NURSE"},
    {"name": "MESSINA NAHUEL", "role": "DOCTOR"},
    {"name": "CARDOZO FACUNDO MAXIMILIANO", "role": "NURSE"},
    {"name": "VARGAS ROTELA MALENA ELIZABETH", "role": "NURSE"},
    {"name": "VILA HUAJLLIRI ROLY ROLANDO", "role": "NURSE"},
    {"name": "MEZA ERIKA FATIMA", "role": "NURSE"},
    {"name": "ZACARIAS CECILIA BEATRIZ", "role": "NURSE"},
    {"name": "AVILA VALENTIN", "role": "DOCTOR"},
    {"name": "AMAYA ANALIA", "role": "DOCTOR"},
    {"name": "RIVAS PAULA", "role": "DOCTOR"},
    {"name": "RESIDENTES", "role": "DOCTOR"},
]

# Filtrar doctores y enfermeros
doctors = [user["name"] for user in users if user["role"] == "DOCTOR"]
nurses = [user["name"] for user in users if user["role"] == "NURSE"]

# Agregar columnas vacías para doctores y enfermeros
df["DOCTOR"] = ""
df["ENFERMERO"] = ""

# Asignar doctores y enfermeros aleatoriamente a cada fila
for index, row in df.iterrows():
    df.at[index, "DOCTOR"] = random.choice(doctors)
    df.at[index, "ENFERMERO"] = random.choice(nurses)

# Guardar el resultado en un nuevo archivo CSV
df.to_csv("planilla_con_doctores_y_enfermeros.csv", index=False)
