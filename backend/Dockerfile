FROM node:latest

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

RUN npm install -g @nestjs/cli

RUN npm install -g bcrypt

COPY . .

EXPOSE ${BACKEND_PORT}

CMD ["npm", "run", "start:prod"]
