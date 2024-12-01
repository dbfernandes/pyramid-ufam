FROM node:21.6.1

WORKDIR /app

COPY package.json ./

RUN npm install

RUN npm install -g @nestjs/cli

RUN npm install -g bcrypt

RUN apt-get install mysql-client

RUN apt-get install sshpass

COPY wait-for-it.sh /wait-for-it.sh
RUN chmod +x /wait-for-it.sh

COPY . .

EXPOSE ${BACKEND_PORT}

CMD ["/wait-for-it.sh", "db:3306", "--", "npm", "run", "start:prod"]
