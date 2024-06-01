# Use a base image oficial do Node.js
FROM node:latest

# Defina o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copie os arquivos de dependências do Node.js para o diretório de trabalho
COPY package.json package-lock.json ./

# Instale as dependências do Node.js
RUN npm install

# Instale o NestJS CLI globalmente
RUN npm install -g @nestjs/cli

# Copie o restante do código da aplicação para o diretório de trabalho
COPY . .

# Exponha a porta que a aplicação usará
EXPOSE ${BACKEND_PORT}

# Comando para iniciar a aplicação
CMD ["nest", "start"]
