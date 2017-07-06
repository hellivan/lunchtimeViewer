FROM node:8.1.3-alpine

ENV base /srv/app

WORKDIR ${base}

EXPOSE 3000


ADD ./ ./

RUN npm install && yarn build:client

CMD ["yarn", "start"]
