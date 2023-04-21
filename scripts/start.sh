#!/bin/bash

echo "cleaning up previously running containers"
docker container stop dashboard
docker container rm dashboard

echo "Starting up server"
docker run -v $(pwd)/data:/data --name "dashboard"  -p 3030:3030 -p 8080:1984 \
	-e SCAN_ADDR_BASE="10.10.1." \
	-e LOG_FILE="/data/dashboard.log" \
	-e MQTT_BROKER="mqtt://10.10.1.46" ghcr.io/garhul/home_dash:latest
