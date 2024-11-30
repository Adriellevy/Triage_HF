import pandas as pd
import random
from datetime import datetime, timedelta

# Configuración inicial
dias_generacion = 25
pacientes_por_dia = 40
fecha_inicio = datetime.strptime("2024-02-08", "%Y-%m-%d")

# Lista de doctores y enfermeros
doctors = [
    "Dr. Smith", "Dr. Smith2", "MESSINA NAHUEL", "AVILA VALENTIN",
    "AMAYA ANALIA", "RIVAS PAULA", "RESIDENTES"
]
nurses = [
    "Nurse Brown", "GIMENEZ, ALEXIS", "CARDOZO FACUNDO MAXIMILIANO",
    "VARGAS ROTELA MALENA ELIZABETH", "VILA HUAJLLIRI ROLY ROLANDO",
    "MEZA ERIKA FATIMA", "ZACARIAS CECILIA BEATRIZ"
]

# Lista de motivos de consulta
motivos_consulta = [
    "FIEBRE Y TOS", "TOS", "HTA", "ASTENIA", "SANGRADO", "DOLOR LUMBAR",
    "DOLOR RODILLA", "HEMATURIA", "FIEBRE", "DOLOR ABDOMINAL"
]

# Lista de boxes y niveles de triage
boxes = list(range(1, 20))
triage_niveles = ["I", "II", "III", "IV"]

# Funciones para generación de datos
def generar_nombre():
    nombres = ["Juan", "María", "Carlos", "Lucía", "Fernando", "Sofía"]
    apellidos = ["Pérez", "Gómez", "Rodríguez", "Fernández", "López", "Martínez"]
    return f"{random.choice(nombres)} {random.choice(apellidos)}"

def generar_edad():
    edad_maxima = 120
    edad_minima_dias = 90  # 3 meses
    dias_totales = edad_maxima * 365
    dias_random = random.randint(edad_minima_dias, dias_totales)
    fecha_nacimiento = datetime.now() - timedelta(days=dias_random)
    return fecha_nacimiento.strftime('%Y-%m-%d')

def generar_horario_ingreso(fecha):
    hora_inicio = datetime.strptime("08:00", "%H:%M")
    hora_fin = datetime.strptime("20:00", "%H:%M")
    horario_random = hora_inicio + timedelta(minutes=random.randint(0, (hora_fin - hora_inicio).seconds // 60))
    return fecha + timedelta(hours=horario_random.hour, minutes=horario_random.minute)

def generar_horario_salida(hora_ingreso):
    estancia = timedelta(hours=random.randint(1, 72), minutes=random.randint(0, 59))
    return hora_ingreso + estancia

# Generar registros
registros = []
for dia in range(dias_generacion):
    fecha_actual = fecha_inicio + timedelta(days=dia)
    for paciente in range(pacientes_por_dia):
        nombre = generar_nombre()
        motivo = random.choice(motivos_consulta)
        box = random.choice(boxes)
        triage = random.choice(triage_niveles)
        enfermero = random.choice(nurses)
        doctor = random.choice(doctors)
        aislado = random.choice(["SI", "NO"])
        hora_ingreso = generar_horario_ingreso(fecha_actual)
        hora_salida = generar_horario_salida(hora_ingreso)
        edad = generar_edad()

        registros.append([
            paciente + 1,  # Número del paciente
            fecha_actual.strftime("%Y-%m-%d 00:00:00"),  # Fecha
            nombre,  # Nombre
            motivo,  # Motivo de consulta
            box,  # Box
            triage,  # Triage
            enfermero,  # Enfermero
            doctor,  # Doctor
            "",  # Destino
            aislado,  # Aislado
            hora_ingreso.strftime("%Y-%m-%d %H:%M:%S"),  # Hora ingreso
            hora_salida.strftime("%Y-%m-%d %H:%M:%S"),  # Hora salida
            edad,  # Edad
            "", "", "", "", "", "", "", "", "", "", "", ""  # Campos adicionales vacíos
        ])

# Crear DataFrame y guardar como CSV
columnas = [
    "PACIENTES_POR_DIA", "FECHA", "NOMBRE Y APELLIDO", "MOTIVO DE CONSULTA",
    "BOX", "TRIAGE", "ENFERMERO", "MEDICO", "DESTINO", "AISLADO",
    "HORA INGRESO", "HORA SALIDA", "edad", "Unnamed: 13", "Unnamed: 14",
    "Unnamed: 15", "Unnamed: 16", "Unnamed: 17", "Unnamed: 18",
    "Unnamed: 19", "Unnamed: 20", "Unnamed: 21", "Unnamed: 22",
    "Unnamed: 23", "Unnamed: 24"
]
df = pd.DataFrame(registros, columns=columnas)
df.to_csv("pacientes_simulados.csv", index=False)

print("Archivo generado: pacientes_simulados.csv")
