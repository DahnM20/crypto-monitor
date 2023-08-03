FROM node:14

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

RUN apt-get update
RUN apt-get install chromium
#chromium-codecs-ffmpeg
RUN npm install

ENV MACHINE_SYSTEM=PI

# Bundle app source
COPY . .

EXPOSE 3001
CMD [ "node", "index.js" ]