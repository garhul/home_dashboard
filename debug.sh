#!/bin/bash

echo "stopping all containers"
docker container stop $(docker container ls -q)

debug_sv() {
	docker run -v "$(pwd)/data":/data -i -p 3030:3030 -e SCAN_ADDR_BASE="192.168.0." -e LOG_PATH="/data/dashboard_log.txt" -e MQTT_BROKER="mqtt://127.0.0.1" -t dash_sv /bin/sh
}

debug_cli() {
	docker run -p 3000:3000 -t -i dash_web /bin/sh
}

if [ -z $1 ]; 
  then 
    echo "no target specified";
    echo "Specify one of ['client', 'server']"
  else
    if [ "$1" == "client" ]; then debug_cli;
      elif [ "$1" == "server" ]; then debug_sv;
      else echo "$1 not recognized as valid target";
    fi;
fi

