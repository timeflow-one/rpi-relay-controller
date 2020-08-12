FROM node:12-alpine

WORKDIR /usr/application

ADD . ./

RUN apk add sqlite-dev
RUN apk add g++ gcc make python3

RUN npm i sqlite3 --build-from-source --sqlite=/usr
RUN npm i --production
RUN npm i -g pm2
