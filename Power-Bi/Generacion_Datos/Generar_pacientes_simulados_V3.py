import pandas as pd
import random
from datetime import datetime, timedelta

# Cargar el archivo CSV con los pacientes reales
file_path = "planilla_con_edades.csv"
df = pd.read_csv(file_path)

# Configuración para la generación de datos
boxes_niveles_altos = ["C-01", "C-02", "C-03"]
boxes_niveles_bajos = ["SR-1", "SR-2", "SR-3", "SR-4"]
boxes_observacion = [f"{i:02}" for i in range(6, 19)]  # De 06 a 18
doctors = ["Dr. Smith", "Dr. Smith2", "MESSINA NAHUEL", "AVILA VALENTIN", "AMAYA ANALIA"]
nurses = ["Nurse Brown", "GIMENEZ, ALEXIS", "CARDOZO FACUNDO MAXIMILIANO",
          "VARGAS ROTELA MALENA ELIZABETH", "MEZA ERIKA FATIMA"]

# Función para generar valores aleatorios
def generar_nombre():
    nombres = ["LUSI", "LO PINTO CARLOS", "BANDERA", "RODRIGO", "MARIA", "JUAN"]
    apellidos = ["PEREZ", "GOMEZ", "SANCHEZ", "RAMIREZ", "DOMINGUEZ"]
    return f"{random.choice(nombres)} {random.choice(apellidos)}"

def generar_motivo_consulta():
    motivos = ["FIEBRE Y TOS", "DOLOR ABDOMINAL", "DESMAYO", "HERIDA CORTANTE", "DOLOR DE CABEZA"]
    return random.choice(motivos)

def generar_box(triage):
    if triage == "I":
        return random.choice(boxes_niveles_altos + boxes_observacion)
    elif triage in ["II", "III"]:
        return random.choice(boxes_observacion)
    else:
        return random.choice(boxes_niveles_bajos)

def generar_triage():
    niveles = ["I", "II", "III", "IV"]
    probabilidades = [0.1, 0.2, 0.3, 0.4]  # Niveles I son menos frecuentes
    return random.choices(niveles, probabilidades)[0]

def generar_horarios(fecha):
    hora_ingreso = datetime.strptime(fecha, "%Y-%m-%d") + timedelta(
        hours=random.randint(8, 20), minutes=random.randint(0, 59)
    )
    hora_salida = hora_ingreso + timedelta(hours=random.randint(1, 72), minutes=random.randint(0, 59))
    return hora_ingreso, hora_salida

def generar_fecha_nacimiento():
    hoy = datetime.now()
    dias_totales = random.randint(90, 120 * 365)  # Entre 3 meses y 120 años
    fecha_nacimiento = hoy - timedelta(days=dias_totales)
    return fecha_nacimiento.strftime("%Y-%m-%d")

# Detectar filas vacías y completar los datos
for idx, row in df.iterrows():
    if pd.isna(row["PACIENTES_POR_DIA"]):
        continue  # Saltar filas vacías delimitadoras de días

    if pd.isna(row["NOMBRE Y APELLIDO"]):
        # Fecha base para los horarios
        fecha = row["FECHA"].split()[0]

        # Generar datos aleatorios
        nombre_apellido = generar_nombre()
        motivo_consulta = generar_motivo_consulta()
        triage = generar_triage()
        box = generar_box(triage)
        enfermero = random.choice(nurses)
        medico = random.choice(doctors)
        destino = random.choice(["alta", "observación", "internación"])
        aislado = random.choice(["sí", "no"])
        hora_ingreso, hora_salida = generar_horarios(fecha)
        edad = generar_fecha_nacimiento()

        # Completar fila con los datos generados
        df.at[idx, "NOMBRE Y APELLIDO"] = nombre_apellido
        df.at[idx, "MOTIVO DE CONSULTA"] = motivo_consulta
        df.at[idx, "BOX"] = box
        df.at[idx, "TRIAGE"] = triage
        df.at[idx, "ENFERMERO"] = enfermero
        df.at[idx, "MEDICO"] = medico
        df.at[idx, "DESTINO"] = destino
        df.at[idx, "AISLADO"] = aislado
        df.at[idx, "HORA INGRESO"] = hora_ingreso.strftime("%Y-%m-%d %H:%M:%S")
        df.at[idx, "HORA SALIDA"] = hora_salida.strftime("%Y-%m-%d %H:%M:%S")
        df.at[idx, "edad"] = edad

# Guardar el archivo modificado
output_file = "planilla_con_edades_completada.csv"
df.to_csv(output_file, index=False)
print(f"Archivo guardado con éxito en: {output_file}")
