FROM node:slim

WORKDIR /home/node/app

COPY package*.json ./
RUN npm install

COPY index.js index.js
COPY .env .env

EXPOSE 9000

CMD [ "npm", "run", "start" ]