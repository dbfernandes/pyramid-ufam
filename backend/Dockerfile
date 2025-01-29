FROM node:21.6.1

WORKDIR /app

COPY package.json ./

RUN npm install

RUN npm install -g @nestjs/cli

RUN npm install -g bcrypt

RUN apt-get update && apt-get install -y default-mysql-client && rm -rf /var/lib/apt/lists/*

#RUN apt-get install mysql-client

RUN apt-get update && apt-get install -y sshpass && rm -rf /var/lib/apt/lists/*

COPY wait-for-it.sh /wait-for-it.sh
RUN chmod +x /wait-for-it.sh

COPY . .

EXPOSE ${BACKEND_PORT}

CMD ["/wait-for-it.sh", "db:3306", "--", "npm", "run", "start:prod"]
