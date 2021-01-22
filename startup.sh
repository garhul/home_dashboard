#!/bin/bash
set -ex
cd server


docker build -t dash_sv .

cd ../client

docker build -t dash_web .

docker run -d dash_sv -p 3030:3030
docker run -d dash_web -p 3000:3000