import pandas as pd
import random
from datetime import datetime, timedelta

# Configuración inicial
inicio_fecha = datetime(2024, 2, 8)
dias = 25
pacientes_por_dia = 40
total_registros = dias * pacientes_por_dia

# Configuración para generar valores
boxes_altos = ["C-01", "C-02", "C-03"]
boxes_bajos = ["SR-1", "SR-2", "SR-3", "SR-4"]
boxes_intermedios = [f"O-{i}" for i in range(0, 19)]
nombres = ["LUSI", "LO PINTO CARLOS", "BANDERA", "JUAREZ", "CASTILLO", "FERNANDEZ"]
motivos = ["FIEBRE Y TOS", "DOLOR ABDOMINAL", "ACCIDENTE", "DESMAYO", "FALTA DE AIRE"]
triage_niveles = ["I", "II", "III", "IV"]
destinos = ["alta", "internación", "derivación", "observación", "aislamiento"]
aislado_opciones = ["NO", "SI"]

# Lista de médicos y enfermeros (tomada de tu ejemplo)
doctors = [
    "Dr. Smith", "Dr. Smith2", "MESSINA NAHUEL", "AVILA VALENTIN",
    "AMAYA ANALIA", "RIVAS PAULA", "RESIDENTES"
]
nurses = [
    "Nurse Brown", "GIMENEZ, ALEXIS", "CARDOZO FACUNDO MAXIMILIANO",
    "VARGAS ROTELA MALENA ELIZABETH", "MEZA ERIKA FATIMA",
    "ZACARIAS CECILIA BEATRIZ"
]


# Generar una fecha de nacimiento aleatoria
def generar_fecha_nacimiento():
    hoy = datetime.now()
    edad_maxima = 120
    edad_minima_dias = 90  # 3 meses en días
    dias_totales = edad_maxima * 365
    dias_random = random.randint(edad_minima_dias, dias_totales)
    fecha_nacimiento = hoy - timedelta(days=dias_random)
    return fecha_nacimiento.strftime('%Y-%m-%d')


# Generar hora de ingreso y salida
def generar_horarios(fecha):
    hora_ingreso = fecha + timedelta(
        hours=random.randint(8, 20), minutes=random.randint(0, 59)
    )
    estancia = timedelta(hours=random.randint(1, 72), minutes=random.randint(0, 59))
    hora_salida = hora_ingreso + estancia
    return hora_ingreso, hora_salida


# Función para determinar el box según triage
def asignar_box(triage):
    if triage == "I":
        return random.choice(boxes_bajos + boxes_intermedios)
    elif triage == "IV":
        return random.choice(boxes_altos + boxes_intermedios)
    else:
        return random.choice(boxes_intermedios)


# Generar registros
registros = []
for dia in range(dias):
    fecha_actual = inicio_fecha + timedelta(days=dia)

    # Añadir fila vacía al cambiar de día
    registros.append([fecha_actual.strftime('%Y-%m-%d'), *["" for _ in range(12)]])

    for paciente in range(pacientes_por_dia):
        triage = random.choice(triage_niveles)
        box = asignar_box(triage)
        hora_ingreso, hora_salida = generar_horarios(fecha_actual)
        registro = [
            paciente + 1,
            fecha_actual.strftime('%Y-%m-%d'),
            random.choice(nombres),
            random.choice(motivos),
            box,
            triage,
            random.choice(nurses),
            random.choice(doctors),
            random.choice(destinos),
            random.choice(aislado_opciones),
            hora_ingreso.strftime('%Y-%m-%d %H:%M:%S'),
            hora_salida.strftime('%Y-%m-%d %H:%M:%S'),
            generar_fecha_nacimiento(),
            *["" for _ in range(12)]  # Campos no especificados
        ]
        registros.append(registro)

# Convertir a DataFrame
columnas = [
    "PACIENTES_POR_DIA", "FECHA", "NOMBRE Y APELLIDO", "MOTIVO DE CONSULTA",
    "BOX", "TRIAGE", "ENFERMERO", "MEDICO", "DESTINO", "AISLADO",
    "HORA INGRESO", "HORA SALIDA", "edad", "Unnamed: 13", "Unnamed: 14",
    "Unnamed: 15", "Unnamed: 16", "Unnamed: 17", "Unnamed: 18",
    "Unnamed: 19", "Unnamed: 20", "Unnamed: 21", "Unnamed: 22",
    "Unnamed: 23", "Unnamed: 24"
]
df = pd.DataFrame(registros, columns=columnas)

# Guardar en un archivo CSV
df.to_csv("pacientes_simulados_V3.csv", index=False)
print("Archivo generado: pacientes_simulados_V3.csv")
