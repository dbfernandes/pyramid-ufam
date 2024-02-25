# Sobre a execução do projeto

# Considerações
Não foi possível implementar a autenticação JWT ou a containerização do sistema, tampouco foi possível hospedar o sistema no Google Cloud. O motivo principal foi falta de tempo.\

Caso necessário, posso mostrar outros projetos que participei onde eu pude implementar autenticação JWT. Não tenho nenhum projeto disponível no momento que esteja hospedado em GCP (apesar de já tê-lo feito).\

Entretanto, consegui implementar a contagem de entrada e saída de veículos dos estacionamentos (incluindo o agrupamento por dia, hora e tipo de veículo) e também hospedei a API na plataforma Railway, da qual tenho mais familiaridade.\

Também gostaria de explicitar que meu **PRIMEIRO** contato com TypeORM e NestJS se deu por meio desse teste, porém, eu já tenho 3 anos de experiência com NodeJS utilizando Express, Sequelize e, mais recentemente, Prisma.\

A propósito, meu foco geralmente é em front-end (tenho quase 5 anos de experiência com React). Aqui minha página aliás: https://guilherme.vercel.app/.

# Arquivo README original
Abaixo, eu mantive o arquivo README original até por ter usado como marcador das funcionalidades que concluí.
<br />
<br />
<br />

![Dr Consulta](https://drconsulta.com/_next/image?url=%2Fimages%2FLogo-Dr-Consulta-Branco.png&w=128&q=100 'DrConsulta')

_"Salvar vidas e cuidar das pessoas porque elas não podem esperar nas filas da saúde."_
Conheça: www.drconsulta.com

## Objetivo

O teste é destinado para vaga de Desenvolvedor Back-end entendo como o candidato efetuou a solução e o raciocinio de criação

## Project - API

Criar uma API REST para gerenciar um estacionamento de carros e motos.

#### Stack tecnológica

- NestJS **✓**
- TypeOrm **✓**
- Mysql **✓**
- Swagger **✓**

#### Cadastro de estabelecimento

Criar um cadastro da empresa com os seguintes campos: **✓**

- Nome;
- CNPJ;
- Endereço;
- Telefone;
- Quantidade de vagas para motos;
- Quantidade de vagas para carros.
- **Todos** os campos são de preenchimento obrigatório. **✓**

#### Cadastro de veículos

Criar um cadastro de veículos com os seguintes campos: **✓**

- Marca;
- Modelo;
- Cor;
- Placa;
- Tipo.
- **Todos** os campos são de preenchimento obrigatório. **✓**

#### Funcionalidades

- **Estabelecimento:** CRUD; **✓**
- **Veículos:** CRUD; **✓**
- **Controle de entrada e saída de veículos.** **✓**
  
#### Requisitos

- Controle JWT via Handshake **✕** (Não tive tempo)
- Modelagem de dados; **✓**
- O retorno deverá ser em formato JSON; **✓**
- Requisições GET, POST, PUT ou DELETE, conforme a melhor prática; **✓**
- A persistência dos dados deverá ser em banco _relacional MYSQL_ **✓**
- Criar README do projeto descrevendo as tecnologias utilizadas, chamadas dos serviços e configurações necessário para executar a aplicação. **✓**

#### Ganha mais pontos

- Sumário da quantidade de entrada e saída; **✓**
- Sumário da quantidade de entrada e saída de veículos por hora; **✓**
- Criação relatórios para visão ao dono do estabelecimento;  **✕** (Não entendi o requisito)
- Desenvolver utilizando TDD;  **✕** (Não tive tempo)

## DevOps (Diferencial)

Efetuar deploy da nossa API no ambiente do Google Cloud Platform utilizando os serviços **Obs:** plataforma hospedada no Railway

#### Serviços do GCP
- Container Registry (Subir a imagem docker) **✕**
- Cloud Run **✕**

## Submissão

Crie um fork do teste para acompanharmos o seu desenvolvimento através dos seus commits. **✓**

## Obrigado!

Agradecemos sua participação no teste. Boa sorte! 😄
