FROM node:latest

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

RUN npm install -g @nestjs/cli

COPY . .

EXPOSE ${BACKEND_PORT}

CMD ["nest", "start"]
