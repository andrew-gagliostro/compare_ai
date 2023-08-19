FROM node:lts

COPY ./tsconfig.json ./
COPY ./package*.json ./

RUN npm install && npm cache clean --force

COPY ./ ./

EXPOSE 8080