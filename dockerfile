FROM docker.io/node:lts-slim

WORKDIR /server

RUN mkdir -p /server/data

COPY ./server/dist .
COPY ./server/package.json .
COPY ./server/package-lock.json .

RUN npm ci
COPY ./client/build ./public

ENV NODE_ENV=prod

ENV WS_PORT=3030
ENV SV_PORT=1984

EXPOSE 3030
EXPOSE 1984

CMD ["node", "./src/main.js"]