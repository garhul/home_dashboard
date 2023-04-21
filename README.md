# About this project
I started this project first as a simple way to control some wifi connected led lights (aurora)[https://github.com/garhul/aurora] via an MQTT interface, then it also started collecting information from (weather stations)[https://github.com/garhul/weather_stations], and as an experimental platform for some home automation ideas.

## Infrastructure
Home Dashboard was originally intended to be run in an RPI with acess to an MQTT broker, though now it is running on a minipc server with an ssd.
There's no database requirement and of server state is kept in simple json files.

The app is now meant to be run in a docker container, so it should be easy to set up as a service running in an RPI
*Please keep in mind that if persistence is enabled then this may mean a lot of write/reads to the rpi sd card and thus resulting in a shorter lifespan*

## Scripts
In the scripts folder there's a few helpful scripts, refer to the readme file in that folder for instructions on each one of those


## Brief architecture tour
Images will come once I find a satisfactory solution for doing a diagram, and not less important the time to do so.

So a brief explanation goes like this:
The server connects to a mosquito broker and can perform a scan on a given ip address range for detecting [aurora devices](https://github.com/garhul/aurora). 

When those are detected they get added to an in-memory list of devices, if persistence is enabled the list gets written to the disc.

From this list the server can send commands to the devices and also work with schedules and groups. 

It also collects information from (weathers stations)[https://github.com/garhul/weather_stations], and presents them on a simple timeseries plot


## How to run it?
Check scripts/start.sh

- prequisites:
  - mqtt broker
  - docker

## How to start a dev env:

Start the server by going into server folder and running `npm run dev` this will start the server in development mode, the server listens for web socket connections in port 3030, and exposes a REST api on port 1984.

Get into client folder and run `npm start` the client is served via react scripts and for dev it proxies api calls to the server port 1984, you can change this on `package.json` for client.
