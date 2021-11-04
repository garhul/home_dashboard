#!/bin/bash

echo "cleaning up previously running containers"
docker container stop dashboard_sv
docker container stop dashboard_client

docker container rm dashboard_sv
docker container rm dashboard_client

echo "Starting up server"
docker run -v "$(pwd)/data":/data --name "dashboard_sv" -d -p 3030:3030 \
  -e SCAN_ADDR_BASE="192.168.0." \
  -e LOG_FILE="/data/dashboard_log.txt" \
  -e MQTT_BROKER="mqtt://192.168.0.135" dash_sv

echo "Starting up client"
docker run --name "dashboard_client" -d -p 3000:3000 dash_web
