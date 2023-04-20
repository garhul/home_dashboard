#!/bin/bash

echo "cleaning up previously running containers"
docker container stop dashboard_sv
docker container rm dashboard_sv

echo "Starting up server"
docker run -v "$(pwd)/data":/data --name "dash" -d -p 3030:3030 -p 8080:1984 \
  -e SCAN_ADDR_BASE="10.10.1.0." \
  -e LOG_FILE="/data/dashboard_log.txt" \
  -e MQTT_BROKER="mqtt://192.168.0.135" dash_sv