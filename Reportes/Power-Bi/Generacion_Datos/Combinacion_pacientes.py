import pandas as pd

# Cargar los dos archivos CSV
csv1_path = "pacientes_simulados_V4.csv"  # Reemplaza con la ruta de tu primer archivo
csv2_path = "planilla_con_edades.csv"  # Reemplaza con la ruta de tu segundo archivo

df1 = pd.read_csv(csv2_path)
df2 = pd.read_csv(csv1_path)

# Combinar los dos DataFrames
combined_df = pd.concat([df1, df2], ignore_index=True)

# Guardar el resultado en un nuevo archivo CSV
output_path = "Datos_combinados.csv"  # Reemplaza con la ruta del archivo de salida
combined_df.to_csv(output_path, index=False)

print(f"Archivos combinados y guardados en {output_path}")