#!/bin/bash

echo "Starting up server"
docker run -v "$(pwd)":/data --name "dashboard_sv" -d -p 3030:3030 \
  -e SCAN_ADDR_BASE="192.168.0." \
  -e LOG_PATH="/data/dashboard_log.txt" \
  -e MQTT_BROKER="mqtt://127.0.0.1" dash_sv

echo "Starting up client"
docker run --name "dashboard_client"-d -p 3000:5000 dash_web
