FROM node:slim

WORKDIR /home/node/app

COPY package*.json ./

RUN npm install
COPY . ./

EXPOSE 10000

CMD [ "npm", "run", "start" ]