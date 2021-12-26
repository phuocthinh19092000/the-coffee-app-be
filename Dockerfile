FROM node:14-alpine

#App workdir
WORKDIR /app

# App dependencies
COPY package*.json ./
RUN npm i

COPY . .

COPY .env.example .env

EXPOSE 8080

CMD [ "npm", "run", "start:dev"]