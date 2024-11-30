import pandas as pd
import random
from datetime import datetime, timedelta

# Configuración inicial
pacientes_por_dia = 40
dias = 25
inicio_fecha = datetime(2024, 2, 8)  # Fecha de inicio de los nuevos registros

# Listas predefinidas
nombres = ["LUSI", "LO PINTO CARLOS", "BANDERA", "GARCÍA", "PÉREZ", "RODRÍGUEZ", "GÓMEZ"]
motivos_consulta = ["FIEBRE Y TOS", "TOS", "DOLOR ABDOMINAL", "CEFALEA", "CAÍDA", "DOLOR TORÁCICO"]
boxes_triage = {
    4: ["C-01", "C-02", "C-03"],
    1: ["SR-1", "SR-2", "SR-3", "SR-4"],
    2: ["0-5", "0-6", "0-7", "0-8", "0-9", "0-10"],
    3: ["0-11", "0-12", "0-13", "0-14", "0-15", "0-16"]
}
destinos = ["alta", "observación", "internación"]
aislados = ["", "sí"]

# Usuarios
doctors = ["Dr. Smith", "MESSINA NAHUEL", "AVILA VALENTIN", "RIVAS PAULA", "RESIDENTES"]
nurses = ["ERIKA", "SOLEDAD", "GIMENEZ, ALEXIS", "MEZA ERIKA FATIMA", "CARDOZO FACUNDO MAXIMILIANO"]

# Función para generar horarios en orden ascendente
def generar_horarios_ascendentes(fecha, num_pacientes):
    hora_inicio = datetime.strptime("08:00", "%H:%M")
    hora_fin = datetime.strptime("20:00", "%H:%M")
    intervalo = (hora_fin - hora_inicio) / num_pacientes
    horarios = [fecha + timedelta(hours=hora_inicio.hour + i * intervalo.total_seconds() / 3600) for i in range(num_pacientes)]
    return [h + timedelta(minutes=random.randint(0, 10)) for h in horarios]

# Función para generar hora de salida
def generar_hora_salida(hora_ingreso):
    estancia = timedelta(hours=random.randint(1, 72), minutes=random.randint(0, 59))
    return hora_ingreso + estancia

# Función para asignar box y triage
def asignar_box_y_triage():
    triage = random.choices([4, 3, 2, 1], weights=[30, 40, 25, 5])[0]
    box = random.choice(boxes_triage[triage])
    return box, triage

# Función para generar edades (fechas de nacimiento)
def generar_fecha_nacimiento():
    hoy = datetime.now()
    edad_maxima = 120
    edad_minima_dias = 90
    dias_totales = edad_maxima * 365
    dias_random = random.randint(edad_minima_dias, dias_totales)
    fecha_nacimiento = hoy - timedelta(days=dias_random)
    return fecha_nacimiento.strftime('%Y-%m-%d')

# Generar los registros
registros = []
for dia in range(dias):
    fecha_actual = inicio_fecha + timedelta(days=dia)
    horarios_ingreso = generar_horarios_ascendentes(fecha_actual, pacientes_por_dia)
    for i in range(pacientes_por_dia):
        hora_ingreso = horarios_ingreso[i]
        hora_salida = generar_hora_salida(hora_ingreso)
        nombre = random.choice(nombres)
        motivo = random.choice(motivos_consulta)
        box, triage = asignar_box_y_triage()
        enfermero = random.choice(nurses)
        medico = random.choice(doctors)
        destino = random.choice(destinos)
        aislado = random.choice(aislados)
        edad = generar_fecha_nacimiento()
        registros.append({
            "PACIENTES_POR_DIA": i + 1,
            "FECHA": fecha_actual.strftime("%Y-%m-%d %H:%M:%S"),
            "NOMBRE Y APELLIDO": nombre,
            "MOTIVO DE CONSULTA": motivo,
            "BOX": box,
            "TRIAGE": triage,
            "ENFERMERO": enfermero,
            "MEDICO": medico,
            "AISLADO": aislado,
            "HORA INGRESO": hora_ingreso.strftime("%Y-%m-%d %H:%M:%S"),
            "HORA SALIDA": hora_salida.strftime("%Y-%m-%d %H:%M:%S"),
            "EDAD": edad,
        })

# Crear DataFrame y exportar a CSV
df = pd.DataFrame(registros)
df.to_csv("pacientes_simulados_v2.csv", index=False)

print("Se generaron 1000 registros adicionales en 'nuevos_registros_simulados.csv'.")
