FROM node:14-alpine
WORKDIR /app

RUN apk add python alpine-sdk
RUN npm install -g nodemon knex

COPY package.json package.json
COPY package-lock.json package-lock.json

RUN npm install

COPY . ./

CMD yarn start
