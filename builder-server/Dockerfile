FROM ubuntu:focal

# Install dependencies
RUN apt-get update
RUN apt-get install -y curl
RUN curl -sL https://deb.nodesource.com/setup_20.x | bash -

RUN apt-get upgrade -y
RUN apt-get install -y nodejs
RUN apt-get install -y git

WORKDIR /home/app

COPY script.js script.js
COPY upload_file.js upload_file.js
COPY package*.json .

RUN npm install


CMD [ "node", "script.js" ]