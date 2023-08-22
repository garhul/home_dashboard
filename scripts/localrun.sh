#!/bin/bash

echo "cleaning up previously running containers"
docker container stop dashboard_dev
docker container rm dashboard_dev

echo "Starting up dashboard dev"
docker run  \
  --name "dashboard_dev" \
  -p 3030:3030 -p 8080:1984 \
  -v $(pwd)/data:/data \
	-e SCAN_ADDR_BASE="10.10.1." \
	-e LOG_FILE="/data/dashboard.log" \
	-e MQTT_BROKER="mqtt://10.10.1.46" \
  home_dash:develop