#!/bin/sh
while true; do
  docker exec mysql_container /usr/bin/mysqldump -u root --password=1234 Triage_db > /db/backups/backup.sql
  sleep 3600
done