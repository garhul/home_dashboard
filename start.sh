#!/bin/bash

echo "Starting up server"
docker run -v "$(pwd)":/data -d -p 3030:3030 dash_sv

echo "Starting up client"
docker run -d -p 3000:5000 dash_web
