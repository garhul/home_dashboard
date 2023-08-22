#!/bin/bash

set -ex
# This script is meant to reproduce the build steps that happen on github for a release build so that it can be done locally for testing

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

cd $SCRIPT_DIR/../server/
npm run build

cd $SCRIPT_DIR/../client
npm run build

docker build -t home_dash:develop $SCRIPT_DIR/../ -f $SCRIPT_DIR/../dockerfile



