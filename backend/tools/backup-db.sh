#!/bin/bash

# Definindo o caminho dos arquivos .env
ENV_FILE=".env"

# Verifica se o arquivo .env existe
if [[ ! -f "$ENV_FILE" ]]; then
  echo "Arquivo de configuração $ENV_FILE não encontrado."
  exit 1
fi

# Carregando as variáveis do arquivo .env
export $(grep -v '^#' "$ENV_FILE" | xargs)

# Verifica se as variáveis necessárias estão definidas
if [[ -z "$MYSQL_HOST_HOST" || -z "$MYSQL_HOST_PORT" || -z "$MYSQL_ROOT_PASSWORD" || -z "$MYSQL_DATABASE" ]]; then
  echo "Variáveis de ambiente para o banco de dados não foram definidas corretamente."
  exit 1
fi

# Verifica se as variáveis de backup estão definidas
if [[ -z "$BACKUP_SERVER_HOST" || -z "$BACKUP_SERVER_DIR" || -z "$BACKUP_SERVER_USER" || -z "$BACKUP_SERVER_USER_PASSWORD" ]]; then
  echo "Variáveis de ambiente para o backup não foram definidas corretamente."
  exit 1
fi

# Define o nome do arquivo de backup
BACKUP_FILE="./temp/backup_${MYSQL_DATABASE}_$(date +%u).sql" # 1 = Segunda-feira, 7 = Domingo

# Executa o mysqldump para gerar o backup
mysqldump -h "$MYSQL_HOST_HOST" -P "$MYSQL_HOST_PORT" -uroot -p"$MYSQL_ROOT_PASSWORD" "$MYSQL_DATABASE" > "$BACKUP_FILE"

# Verifica se o backup foi realizado com sucesso
if [[ $? -eq 0 ]]; then
  echo "Backup realizado com sucesso: $BACKUP_FILE"
else
  echo "Erro ao realizar o backup."
  exit 1
fi

# Transfere o arquivo de backup para o servidor de backup
sshpass -p "$BACKUP_SERVER_USER_PASSWORD" scp "$BACKUP_FILE" "$BACKUP_SERVER_USER@$BACKUP_SERVER_HOST:$BACKUP_SERVER_DIR"

# Verifica se o SCP foi bem-sucedido
if [[ $? -eq 0 ]]; then
  echo "Backup transferido com sucesso para $BACKUP_SERVER_HOST:$BACKUP_SERVER_DIR"
  # Remove o arquivo local após a transferência
  rm "$BACKUP_FILE"
else
  echo "Erro ao transferir o backup para o servidor."
  exit 1
fi
