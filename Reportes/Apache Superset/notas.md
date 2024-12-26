
-- Documentacion 
https://superset.apache.org/docs/quickstart
--tutorial


--Recursos

* Funciona con Posgress en vez de MySQL

1-  Clonar repositorio de git  https://github.com/apache/superset.git
2- Reemplazar el yaml con el archivo docker-compose-image-tag.yml que esta en la carpeta base.
3- Ejecutar docker compose -f docker-compose-image-tag.yml up
4- Conectar el cliente de BBDD con la dirección 127.0.0.1:5432 a la base de datos "examples" de Superset  con el 
usuario: examples password: examples
5- Se ejecuta el script postgress_triage_demo_datos.sql desde el cliente de BBDD en mi caso Dbeaver
6- Ir a la pestaña de Dashboards e importar dashboard_export_20241219T233635.zip

--> Para ejecutar 
docker compose -f docker-compose-image-tag.yml up

--> Ingresar app
http://localhost:8088/login/
usuario admin
contraseña admin





