FROM node:21.6.1

WORKDIR /app

COPY package.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE ${FRONTEND_PORT}

CMD ["npm", "run", "start"]
