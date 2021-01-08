FROM node:12-alpine
WORKDIR /app

COPY package.json package.json
COPY package-lock.json package-lock.json

RUN if [ "$ENV" = "production" ]; then npm install -g serve; fi
RUN npm install

COPY . ./

ARG ENV
ARG REACT_APP_API_URL

RUN if [ "$ENV" = "production" ]; then REACT_APP_API_URL=${REACT_APP_API_URL} npm run-script build; fi

CMD [ "yarn", "host" ]
