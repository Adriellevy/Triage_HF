#!/bin/bash

# Inicialización Superset
superset db upgrade
superset init

# Crear usuario si no existe
superset fab create-admin \
  --username admin \
  --firstname Superset \
  --lastname Admin \
  --email admin@superset.com \
  --password admin

superset fab create-admin \
  --username guest \
  --firstname Guest \
  --lastname User \
  --email guest@superset.com \
  --password guest

# Importar dashboards
superset import-dashboards -p /app/dashboards/

# Extraer UUIDs de dashboards y escribir en archivo JSON compartido
python3 <<EOF
from superset import db
from superset.models.dashboard import Dashboard
import json

with db.session.no_autoflush:
    dashboards = db.session.query(Dashboard).all()
    dash_info = [{"id": d.id, "uuid": str(d.uuid), "slug": d.slug or d.dashboard_title} for d in dashboards]

    with open("/app/shared_dash_ids/dashboard_ids.json", "w") as f:
        json.dump(dash_info, f)
EOF

# Arrancar Superset normalmente
echo "Iniciando Superset..."
superset run -p 8088 -h 0.0.0.0 --with-threads --reload --debugger

