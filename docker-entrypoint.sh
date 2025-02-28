#!/bin/bash
set -e

# Crear un usuario administrador para Superset
echo "Creando el administrador de Superset..."
superset fab create-admin --username admin --firstname Superset --lastname Admin --email admin@example.com --password admin

# Actualizar la base de datos de Superset
echo "Actualizando la base de datos de Superset..."
superset db upgrade

# Inicializar Superset
echo "Inicializando Superset..."
superset init

# Establecer la URI de la base de datos
echo "Estableciendo la URI de la base de datos..."
superset set-database-uri --database_name TriageDB --uri 'mysql://root:1234@mysqldb:3306/Triagedb'

# Importar los dashboards desde el archivo zip
echo "Iniciando importación de dashboards..."

# Intentamos importar los dashboards
superset import-dashboards -p /app/dashboards/dashboard_export.zip --username admin
if [ $? -ne 0 ]; then
  echo "Error al importar los dashboards"
  exit 1
fi

echo "Dashboards importados correctamente"

# Crear un usuario de invitado
echo "Creando el usuario invitado..."
superset fab create-user --username guest --firstname Guest --lastname User --email guest@example.com --password guest --role Gamma

# Iniciar el servidor de Superset
echo "Iniciando Superset..."
superset run -p 8088 -h 0.0.0.0 --with-threads --reload --debugger
