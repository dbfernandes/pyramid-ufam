#!/bin/bash

# Carrega as variáveis de ambiente do arquivo .env correspondente
source ./.env


# Define variáveis
DAY_OF_WEEK=$(date +%u)  # 1 = Segunda-feira, 7 = Domingo
BACKUP_PATH=./temp
LAST_SUNDAY_FILE="$BACKUP_PATH/last_sunday_ref"

# Função para criar ou atualizar o arquivo de referência do último backup completo
function update_last_sunday_ref() {
    touch "$LAST_SUNDAY_FILE"
}

# Função para realizar backup
function backup_directory() {
    local dir_path=$1
    local dir_name=$(basename "$dir_path")
    local backup_file="$BACKUP_PATH/${dir_name}-${DAY_OF_WEEK}.tar.gz"

    if [ "$DAY_OF_WEEK" -eq 7 ]; then
        # Backup completo aos domingos
        tar -czf "$backup_file" -C "$(dirname "$dir_path")" "$dir_name"
        update_last_sunday_ref
    else
        # Backup incremental comparando com o último backup completo
        if [ -f "$LAST_SUNDAY_FILE" ]; then
            tar -czf "$backup_file" -C "$(dirname "$dir_path")" "$dir_name" --newer="$(cat "$LAST_SUNDAY_FILE")"
        else
            echo "Arquivo de referência para backup incremental não encontrado. Criando backup completo."
            tar -czf "$backup_file" -C "$(dirname "$dir_path")" "$dir_name"
            update_last_sunday_ref
        fi
    fi
}

# Verifica se as variáveis de backup estão definidas
if [[ -z "$BACKUP_SERVER_HOST" || -z "$BACKUP_SERVER_DIR" || -z "$BACKUP_SERVER_USER" || -z "$BACKUP_SERVER_USER_PASSWORD" ]]; then
  echo "Variáveis de ambiente para o backup não foram definidas corretamente."
  exit 1
fi

# Atualiza o arquivo de referência para o último backup completo
if [ "$DAY_OF_WEEK" -eq 7 ]; then
    update_last_sunday_ref
fi

# Faz backup para cada pasta listada em BACKUP_FOLDER_LIST
IFS=',' read -ra FOLDERS <<< "$BACKUP_FOLDER_LIST"
for folder in "${FOLDERS[@]}"; do
    backup_directory "$folder"
done

# Envia backups para o servidor de backup usando SCP com sshpass
for folder in "${FOLDERS[@]}"; do
    dir_name=$(basename "$folder")
    backup_file="$BACKUP_PATH/${dir_name}-${DAY_OF_WEEK}.tar.gz"

    # Transfere o arquivo de backup para o servidor de backup
    sshpass -p "$BACKUP_SERVER_USER_PASSWORD" scp "$backup_file" "$BACKUP_SERVER_USER@$BACKUP_SERVER_HOST:$BACKUP_SERVER_DIR"
done

# Remove backups antigos para manter apenas os últimos 7
find "$BACKUP_PATH" -type f -name "*.tar.gz" -mtime +7 -exec rm {} \;

# Exibe mensagem de conclusão
echo "Backup concluído com sucesso!"
