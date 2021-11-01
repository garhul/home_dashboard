#!/bin/bash
set -ex
ROOT_DIR=$(pwd)


build_sv() {
  echo "BUILDING SERVER CODE!"
  cd "$ROOT_DIR/server"
  # docker build -t dash_sv .
};

build_client() {
  echo "Building client"
  cd "$ROOT_DIR/client"
  docker build -t dash_web .
};

run_client() {
  # docker run --restart=always -d -p 3000:3000 dash_web
  docker run -d -p 3000:5000 dash_web 
}


build_client
mkdir -p "$ROOT_DIR/data";

# docker run --restart=always -v "$(pwd)":/data -d -p 3030:3030 dash_sv