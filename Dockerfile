FROM node:12-alphine

WORKDIR /usr/application

ADD . ./

ADD ./page /var/www/page

RUN apk add sqlite-dev
RUN apk add g++ gcc make python3

RUN npm i sqlite3 --build-from-source --sqlite=/usr
RUN npm i --production
RUN npm run typeorm schema:sync
RUN npm i -g pm2
