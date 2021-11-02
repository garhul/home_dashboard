#!/bin/bash
set -e
ROOT_DIR=$(pwd)

build_sv() {
  echo "Building server!"
  cd "$ROOT_DIR/server"
  mkdir -p "$ROOT_DIR/data";
  docker build -t dash_sv .
};

build_client() {
  echo "Building client"
  cd "$ROOT_DIR/client"
  docker build -t dash_web .
};

if [ -z $1 ]; 
  then 
    echo "no target specified";
    echo "Specify one of ['client', 'server', all]"
  else
    if [ "$1" == "client" ]; then build_client;
      elif [ "$1" == "server" ]; then build_sv;
      elif [ "$1" == "all" ]; then build_client; build_sv; 
      else echo "$1 not recognized as valid target";
    fi;
fi


# build_client

# docker run --restart=always -v "$(pwd)":/data -d -p 3030:3030 dash_sv