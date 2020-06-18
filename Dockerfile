FROM node:12-alpine

WORKDIR /usr/source

ADD . ./
RUN ls -ls

RUN npm i -g pm2
RUN npm i --production
RUN npm run typeorm schema:sync
RUN npm run typeorm migration:run
