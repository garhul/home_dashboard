#!/bin/bash
set -ex
cd server

docker build -t dash_sv .

cd ../client

docker build -t dash_web .
cd ..

mkdir -p data
cd data

docker run -v "$(pwd)":/data -d -p 3030:3030 dash_sv
docker run -d -p 3000:3000 dash_web