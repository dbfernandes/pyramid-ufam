#!/bin/bash

# Script de backup incremental e completo de pastas
set -e  # Para na primeira falha

# Definindo caminhos
BASE_DIR="/home/francisco/projetos/pyramid-ufam/backend"
ENV_FILE="$BASE_DIR/.env"
BACKUP_PATH="$BASE_DIR/temp"
LOG_DIR="$BASE_DIR/log"
LOG_FILE="$LOG_DIR/backup_folders_$(date +%Y%m%d).log"
LAST_SUNDAY_FILE="$BACKUP_PATH/last_sunday_ref"

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
mkdir -p "$BACKUP_PATH" "$LOG_DIR"

log "Iniciando processo de backup de pastas..."

# Carrega as variáveis de ambiente
set -a  # Exporta automaticamente as variáveis
source "$ENV_FILE"
set +a

# Verifica se as variáveis necessárias estão definidas
required_vars=("BACKUP_FOLDER_LIST" "BACKUP_SERVER_HOST" "BACKUP_SERVER_DIR" "BACKUP_SERVER_USER" "BACKUP_SERVER_USER_PASSWORD")

for var in "${required_vars[@]}"; do
  if [[ -z "${!var}" ]]; then
    log "ERRO: Variável $var não definida no arquivo .env"
    exit 1
  fi
done

log "Variáveis de ambiente carregadas com sucesso"

# Define variáveis
DAY_OF_WEEK=$(date +%u)  # 1 = Segunda-feira, 7 = Domingo
log "Dia da semana: $DAY_OF_WEEK ($(date '+%A'))"

# Função para criar ou atualizar o arquivo de referência do último backup completo
update_last_sunday_ref() {
    date "+%Y-%m-%d %H:%M:%S" > "$LAST_SUNDAY_FILE"
    log "Arquivo de referência atualizado: $(cat "$LAST_SUNDAY_FILE")"
}

# Função para realizar backup
backup_directory() {
    local dir_path=$1
    local dir_name=$(basename "$dir_path")
    local backup_file="$BACKUP_PATH/${dir_name}-${DAY_OF_WEEK}.tar.gz"

    # Verifica se a pasta existe
    if [[ ! -d "$dir_path" ]]; then
        log "AVISO: Pasta $dir_path não encontrada. Pulando..."
        return 1
    fi

    log "Iniciando backup da pasta: $dir_path"

    if [[ "$DAY_OF_WEEK" -eq 7 ]]; then
        # Backup completo aos domingos
        log "Criando backup completo: $backup_file"
        log "Executando: tar -czf $backup_file -C $(dirname "$dir_path") $dir_name"

        if tar -czf "$backup_file" -C "$(dirname "$dir_path")" "$dir_name" 2>>"$LOG_FILE"; then
            local backup_size=$(du -h "$backup_file" | cut -f1)
            log "✓ Backup completo criado - Tamanho: $backup_size"
            update_last_sunday_ref
        else
            log "✗ ERRO ao criar backup completo de $dir_path"
            return 1
        fi
    else
        # Backup incremental comparando com o último backup completo
        if [[ -f "$LAST_SUNDAY_FILE" ]]; then
            local ref_date=$(cat "$LAST_SUNDAY_FILE")
            log "Criando backup incremental desde: $ref_date"
            log "Executando: tar -czf $backup_file -C $(dirname "$dir_path") $dir_name --newer-mtime='$ref_date'"

            if tar -czf "$backup_file" -C "$(dirname "$dir_path")" "$dir_name" --newer-mtime="$ref_date" 2>>"$LOG_FILE"; then
                local backup_size=$(du -h "$backup_file" | cut -f1)
                log "✓ Backup incremental criado - Tamanho: $backup_size"
            else
                log "✗ ERRO ao criar backup incremental de $dir_path"
                return 1
            fi
        else
            log "AVISO: Arquivo de referência não encontrado. Criando backup completo."
            log "Executando: tar -czf $backup_file -C $(dirname "$dir_path") $dir_name"

            if tar -czf "$backup_file" -C "$(dirname "$dir_path")" "$dir_name" 2>>"$LOG_FILE"; then
                local backup_size=$(du -h "$backup_file" | cut -f1)
                log "✓ Backup completo inicial criado - Tamanho: $backup_size"
                update_last_sunday_ref
            else
                log "✗ ERRO ao criar backup inicial de $dir_path"
                return 1
            fi
        fi
    fi
}

# Função para transferir backup
transfer_backup() {
    local backup_file=$1
    local filename=$(basename "$backup_file")

    if [[ ! -f "$backup_file" ]]; then
        log "AVISO: Arquivo $backup_file não encontrado para transferência"
        return 1
    fi

    log "Iniciando transferência: $filename"
    log "Executando: sshpass scp $backup_file $BACKUP_SERVER_USER@$BACKUP_SERVER_HOST:$BACKUP_SERVER_DIR/"

    if sshpass -p "$BACKUP_SERVER_USER_PASSWORD" scp -o StrictHostKeyChecking=no "$backup_file" "$BACKUP_SERVER_USER@$BACKUP_SERVER_HOST:$BACKUP_SERVER_DIR/" 2>>"$LOG_FILE"; then
        log "✓ Backup transferido: $filename"

        # Remove arquivo local após transferência bem-sucedida
        rm "$backup_file"
        log "✓ Arquivo local removido: $filename"
    else
        log "✗ ERRO na transferência de $filename. Arquivo local mantido."
        return 1
    fi
}

# Processa lista de pastas
log "Processando lista de pastas: $BACKUP_FOLDER_LIST"
IFS=',' read -ra FOLDERS <<< "$BACKUP_FOLDER_LIST"

# Array para armazenar arquivos de backup criados
declare -a backup_files=()

# Faz backup para cada pasta
for folder in "${FOLDERS[@]}"; do
    folder=$(echo "$folder" | xargs)  # Remove espaços em branco

    if backup_directory "$folder"; then
        dir_name=$(basename "$folder")
        backup_file="$BACKUP_PATH/${dir_name}-${DAY_OF_WEEK}.tar.gz"
        backup_files+=("$backup_file")
    fi
done

log "Total de backups criados: ${#backup_files[@]}"

# Transfere todos os backups criados
log "Iniciando transferência dos backups..."
transfer_success=0
transfer_total=${#backup_files[@]}

for backup_file in "${backup_files[@]}"; do
    if transfer_backup "$backup_file"; then
        ((transfer_success++))
    fi
done

log "Transferências: $transfer_success/$transfer_total bem-sucedidas"

# Remove backups antigos (mantém apenas os últimos 7 dias)
log "Removendo backups antigos (>7 dias)..."
removed_count=$(find "$BACKUP_PATH" -type f -name "*.tar.gz" -mtime +7 -print | wc -l)
find "$BACKUP_PATH" -type f -name "*.tar.gz" -mtime +7 -exec rm {} \;

if [[ $removed_count -gt 0 ]]; then
    log "✓ $removed_count arquivos antigos removidos"
else
    log "✓ Nenhum arquivo antigo encontrado"
fi

# Relatório final
if [[ $transfer_success -eq $transfer_total && $transfer_total -gt 0 ]]; then
    log "✓ Backup de pastas concluído com sucesso!"
else
    log "⚠ Backup concluído com algumas falhas. Verifique os logs acima."
    exit 1
fi