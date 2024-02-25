# AACC - Web Academy

Sistema AACC com Backend (REST Api) desenvolvida em Express e Frontend em React. O repositório tem um diretório para o backend e outro para o frontend, e os dois sistemas são inicializados automaticamente com o docker compose (instruções abaixo). Além dos containers do backend e frontend, o docker compose também cria containers para o banco de dados de desenvolvimento, banco de dados de teste, além do phpmyadmin. Para rodar a aplicação, execute os seguintes comandos:

```
$ git clone https://github.com/tacia68/AACC
$ cd AACC
$ cp .env.example .env
$ cp frontend/.env.example frontend/.env
$ cp backend/.env.example backend/.env
$ cd frontend && npm install && cd ..
$ cd backend && npm install && cd ..
$ docker-compose up
```

## PhpMyAdmin

```
URL: http://localhost:8010
Server: db (serviço do docker compose)
Usersname: root
Senha: 123456
Banco de Dados: aac
```

## Swagger
```
URL: http://localhost:3333/api
```

## Frontend
```
URL: http://localhost:3366
```
