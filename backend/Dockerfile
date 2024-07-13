FROM node:21.6.1

WORKDIR /app

COPY package.json ./

RUN npm install

RUN npm install -g @nestjs/cli

RUN npm install -g bcrypt

COPY . .

EXPOSE ${BACKEND_PORT}

CMD ["npm", "run", "start:prod"]
