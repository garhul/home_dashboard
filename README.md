# About this project
I started this project first as a simple way to control some wifi connected led lights (aurora) via an MQTT interface, 
but as that project changed shape so did this. 

It also became a sort of experimentation platform for different ideas around home automation.

## Infrastructure
Home Dashboard was originally intended to be run in an RPI with acess to an MQTT broker,
there's no database requirement and persistence of server state is performed in simple json files.
The app is now meant to be run in a docker container, so it should be easy to set up as a service running in an RPI

*Please keep in mind that if persistence is enabled then this may mean a lot of write/reads to the rpi sd card and thus resulting in a shorter lifespan*

## Features


## Brief architecture tour
put some images here, explain how it works

## Installation instructions
App is meant to be run in two different docker containers one serving the front end, and the other the backend service which interfaces with mosquitto

Prequisites:
- Mosquitto broker
- Docker

Running it:
 - run `startup.sh`


