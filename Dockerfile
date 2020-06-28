FROM node:12-alpine

WORKDIR /usr/source

ADD . ./
RUN ls -ls

RUN apk add sqlite-dev
RUN apk add g++ gcc make python3

RUN npm i sqlite3 --build-from-source --sqlite=/usr
RUN npm i --production
RUN npm run typeorm schema:sync
RUN npm run typeorm migration:run
RUN npm i -g pm2
