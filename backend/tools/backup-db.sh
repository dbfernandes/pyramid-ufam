#!/bin/bash

# Script de backup MySQL com transferência para servidor remoto
set -e  # Para na primeira falha

# Definindo caminhos
BASE_DIR="/home/francisco/projetos/pyramid-ufam/backend"
ENV_FILE="$BASE_DIR/.env"
TEMP_DIR="$BASE_DIR/temp"
LOG_DIR="$BASE_DIR/log"
LOG_FILE="$LOG_DIR/backup_$(date +%Y%m%d).log"

# Função para log com timestamp
log() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

# Verifica se o arquivo .env existe
if [[ ! -f "$ENV_FILE" ]]; then
  log "ERRO: Arquivo $ENV_FILE não encontrado."
  exit 1
fi

# Cria diretórios se não existirem
mkdir -p "$TEMP_DIR" "$LOG_DIR"

log "Iniciando processo de backup..."

# Carrega as variáveis do arquivo .env
set -a  # Exporta automaticamente as variáveis
source "$ENV_FILE"
set +a

# Verifica se as variáveis necessárias estão definidas
required_vars=("MYSQL_HOST_HOST" "MYSQL_HOST_PORT" "MYSQL_ROOT_PASSWORD" "MYSQL_DATABASE" 
               "BACKUP_SERVER_HOST" "BACKUP_SERVER_DIR" "BACKUP_SERVER_USER" "BACKUP_SERVER_USER_PASSWORD")

for var in "${required_vars[@]}"; do
  if [[ -z "${!var}" ]]; then
    log "ERRO: Variável $var não definida no arquivo .env"
    exit 1
  fi
done

log "Variáveis de ambiente carregadas com sucesso"

# Cria diretório temp se não existir
mkdir -p "$TEMP_DIR"

# Define o arquivo de backup (1=Segunda, 7=Domingo)
BACKUP_FILE="$TEMP_DIR/backup_${MYSQL_DATABASE}_$(date +%u).sql"

log "Iniciando backup do banco $MYSQL_DATABASE para $BACKUP_FILE"
mysql -h "$MYSQL_HOST_HOST" -P "$MYSQL_HOST_PORT" -uroot -p"$MYSQL_ROOT_PASSWORD" -e "SHOW DATABASES;" | grep "$MYSQL_DATABASE"

# Executa o mysqldump
if mysqldump -h "$MYSQL_HOST_HOST" -P "$MYSQL_HOST_PORT" -uroot -p"$MYSQL_ROOT_PASSWORD" "$MYSQL_DATABASE" > "$BACKUP_FILE" 2>>"$LOG_FILE"; then
  BACKUP_SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
  log "✓ Backup criado com sucesso - Tamanho: $BACKUP_SIZE"
else
  log "✗ ERRO ao criar backup do banco de dados"
  exit 1
fi

log "Iniciando transferência para servidor remoto..."
log "Executando: sshpass  -p $BACKUP_SERVER_USER_PASSWORD scp $BACKUP_FILE $BACKUP_SERVER_USER@$BACKUP_SERVER_HOST:$BACKUP_SERVER_DIR/"

# Transfere o arquivo via SCP
if sshpass -p "$BACKUP_SERVER_USER_PASSWORD" scp "$BACKUP_FILE" "$BACKUP_SERVER_USER@$BACKUP_SERVER_HOST:$BACKUP_SERVER_DIR/" 2>>"$LOG_FILE"; then
  log "✓ Backup transferido para $BACKUP_SERVER_HOST:$BACKUP_SERVER_DIR"
  
  # Remove arquivo local
  rm "$BACKUP_FILE"
  log "✓ Arquivo local removido"
else
  log "✗ ERRO na transferência. Arquivo local mantido: $BACKUP_FILE"
  exit 1
fi

log "Backup concluído com sucesso!"