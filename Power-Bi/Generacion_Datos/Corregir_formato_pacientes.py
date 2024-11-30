import pandas as pd
import random
from datetime import datetime, timedelta


# Generar una fecha de nacimiento aleatoria
def generar_fecha_nacimiento():
    # Edad mínima: 0 años (3 meses)
    # Edad máxima: 120 años
    hoy = datetime.now()
    edad_maxima = 120
    edad_minima_dias = 90  # 3 meses en días
    dias_totales = edad_maxima * 365
    dias_random = random.randint(edad_minima_dias, dias_totales)
    fecha_nacimiento = hoy - timedelta(days=dias_random)
    return fecha_nacimiento.strftime("%Y-%m-%d")


# Leer el archivo CSV
input_file = "planilla_horarios_salida_entrada.csv"
output_file = "planilla_con_edades.csv"

# Cargar datos
try:
    df = pd.read_csv(input_file)

    # Generar la columna "edad" con fechas de nacimiento aleatorias
    nueva_columna = [generar_fecha_nacimiento() for _ in range(len(df))]

    # Reemplazar o renombrar la columna "Unnamed: 12"
    if "Unnamed: 12" in df.columns:
        df["Unnamed: 12"] = nueva_columna
        df.rename(columns={"Unnamed: 12": "EDAD"}, inplace=True)
    else:
        print(
            "La columna 'Unnamed: 12' no existe en el archivo. Agregando 'EDAD' como nueva columna."
        )
        df["EDAD"] = nueva_columna

    # Eliminar la columna "Aisaldo"
    if "DESTINO" in df.columns:
        df = df.drop(columns=["DESTINO"])

    columns_to_drop = [col for col in df.columns[12:25] if col.startswith("Unnamed")]
    df = df.drop(columns=columns_to_drop)
    # Guardar el archivo modificado
    df.to_csv(output_file, index=False)
    print(f"Archivo guardado con éxito en: {output_file}")

except FileNotFoundError:
    print(
        f"El archivo {input_file} no fue encontrado. Asegúrate de que el archivo exista en el mismo directorio."
    )
except Exception as e:
    print(f"Ocurrió un error: {e}")
