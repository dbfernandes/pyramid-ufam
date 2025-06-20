#!/bin/bash

# Definindo o caminho dos arquivos .env
#ENV_FILE="/home/pyramid/pyramid-ufam/backend/.env"
#BACKUP_FILE="/home/pyramid/pyramid-ufam/backend/temp/backup_${MYSQL_DATABASE}_$(date +%u).sql"
#!/bin/bash

#==============================================================================
# Script de Backup Automático do MySQL
# Descrição: Realiza backup do banco MySQL e transfere para servidor remoto
# Autor: Sistema Pyramid UFAM
# Data: $(date +%Y-%m-%d)
#==============================================================================

set -euo pipefail  # Parar execução em caso de erro, variável indefinida ou pipe failure

# Cores para output
readonly RED='\033[0;31m'
readonly GREEN='\033[0;32m'
readonly YELLOW='\033[1;33m'
readonly BLUE='\033[0;34m'
readonly NC='\033[0m' # No Color

# Configurações
readonly SCRIPT_DIR="/home/francisco/projetos/pyramid-ufam/backend"
readonly ENV_FILE="${SCRIPT_DIR}/.env"
readonly TEMP_DIR="${SCRIPT_DIR}/temp"
readonly LOG_DIR="${SCRIPT_DIR}/logs"
readonly LOG_FILE="${LOG_DIR}/backup_$(date +%Y%m%d).log"
readonly MAX_LOG_DAYS=30
readonly MAX_BACKUP_DAYS=7
readonly BACKUP_TIMEOUT=3600  # 1 hora em segundos

# Função para logging
log() {
    local level="$1"
    shift
    local message="$*"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    
    case "$level" in
        "INFO")  echo -e "${BLUE}[INFO]${NC}  ${timestamp} - $message" | tee -a "$LOG_FILE" ;;
        "WARN")  echo -e "${YELLOW}[WARN]${NC}  ${timestamp} - $message" | tee -a "$LOG_FILE" ;;
        "ERROR") echo -e "${RED}[ERROR]${NC} ${timestamp} - $message" | tee -a "$LOG_FILE" ;;
        "SUCCESS") echo -e "${GREEN}[SUCCESS]${NC} ${timestamp} - $message" | tee -a "$LOG_FILE" ;;
    esac
}

# Função para cleanup em caso de erro
cleanup() {
    local exit_code=$?
    if [[ $exit_code -ne 0 ]]; then
        log "ERROR" "Script finalizado com erro (código: $exit_code)"
        # Remove arquivo de backup parcial se existir
        [[ -f "$BACKUP_FILE" ]] && rm -f "$BACKUP_FILE"
    fi
    exit $exit_code
}

# Função para verificar se comando existe
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Função para verificar conexão com MySQL
check_mysql_connection() {
    log "INFO" "Verificando conexão com MySQL..."
    
    if ! mysql -h "$MYSQL_HOST_HOST" -P "$MYSQL_HOST_PORT" -u"$MYSQL_USER" -p"$MYSQL_PASSWORD" \
         -e "SELECT 1;" "$MYSQL_DATABASE" >/dev/null 2>&1; then
        log "ERROR" "Não foi possível conectar ao MySQL"
        return 1
    fi
    
    log "SUCCESS" "Conexão com MySQL estabelecida"
    return 0
}

# Função para verificar conectividade SSH
check_ssh_connection() {
    log "INFO" "Verificando conectividade SSH com servidor de backup..."
    
    if [[ "$USE_SSH_KEY" == "true" ]]; then
        if ! ssh -o ConnectTimeout=10 -o BatchMode=yes \
             -i "$SSH_KEY_PATH" "$BACKUP_SERVER_USER@$BACKUP_SERVER_HOST" "exit" 2>/dev/null; then
            log "ERROR" "Não foi possível conectar via SSH usando chave"
            return 1
        fi
    else
        if ! sshpass -p "$BACKUP_SERVER_USER_PASSWORD" ssh -o ConnectTimeout=10 \
             "$BACKUP_SERVER_USER@$BACKUP_SERVER_HOST" "exit" 2>/dev/null; then
            log "ERROR" "Não foi possível conectar via SSH usando senha"
            return 1
        fi
    fi
    
    log "SUCCESS" "Conectividade SSH verificada"
    return 0
}

# Função para criar diretórios necessários
create_directories() {
    local dirs=("$TEMP_DIR" "$LOG_DIR")
    
    for dir in "${dirs[@]}"; do
        if [[ ! -d "$dir" ]]; then
            mkdir -p "$dir"
            log "INFO" "Diretório criado: $dir"
        fi
    done
}

# Função para carregar e validar variáveis de ambiente
load_env_variables() {
    log "INFO" "Carregando variáveis de ambiente..."
    
    if [[ ! -f "$ENV_FILE" ]]; then
        log "ERROR" "Arquivo de configuração não encontrado: $ENV_FILE"
        return 1
    fi
    
    # Carrega variáveis do .env
    set -o allexport
    source "$ENV_FILE"
    set +o allexport
    
    # Variáveis obrigatórias
    local required_vars=(
        "MYSQL_HOST_HOST"
        "MYSQL_HOST_PORT"
        "MYSQL_USER"
        "MYSQL_PASSWORD"
        "MYSQL_DATABASE"
        "BACKUP_SERVER_HOST"
        "BACKUP_SERVER_DIR"
        "BACKUP_SERVER_USER"
    )
    
    # Verifica variáveis obrigatórias
    for var in "${required_vars[@]}"; do
        if [[ -z "${!var:-}" ]]; then
            log "ERROR" "Variável obrigatória não definida: $var"
            return 1
        fi
    done
    
    # Define valores padrão
    MYSQL_USER="${MYSQL_USER:-root}"
    USE_SSH_KEY="${USE_SSH_KEY:-false}"
    COMPRESS_BACKUP="${COMPRESS_BACKUP:-true}"
    BACKUP_RETENTION_DAYS="${BACKUP_RETENTION_DAYS:-7}"
    
    # Validação condicional
    if [[ "$USE_SSH_KEY" == "true" ]]; then
        if [[ -z "${SSH_KEY_PATH:-}" ]]; then
            log "ERROR" "SSH_KEY_PATH deve ser definido quando USE_SSH_KEY=true"
            return 1
        fi
        if [[ ! -f "$SSH_KEY_PATH" ]]; then
            log "ERROR" "Arquivo de chave SSH não encontrado: $SSH_KEY_PATH"
            return 1
        fi
    else
        if [[ -z "${BACKUP_SERVER_USER_PASSWORD:-}" ]]; then
            log "ERROR" "BACKUP_SERVER_USER_PASSWORD deve ser definido quando USE_SSH_KEY=false"
            return 1
        fi
    fi
    
    log "SUCCESS" "Variáveis de ambiente carregadas e validadas"
    return 0
}

# Função para verificar dependências
check_dependencies() {
    log "INFO" "Verificando dependências..."
    
    local dependencies=("mysqldump" "mysql")
    
    if [[ "$USE_SSH_KEY" != "true" ]]; then
        dependencies+=("sshpass")
    fi
    
    if [[ "$COMPRESS_BACKUP" == "true" ]]; then
        dependencies+=("gzip")
    fi
    
    for cmd in "${dependencies[@]}"; do
        if ! command_exists "$cmd"; then
            log "ERROR" "Dependência não encontrada: $cmd"
            log "INFO" "Para instalar: sudo apt install mysql-client sshpass gzip"
            return 1
        fi
    done
    
    log "SUCCESS" "Todas as dependências estão disponíveis"
    return 0
}

# Função para realizar backup
perform_backup() {
    local backup_start_time=$(date +%s)
    
    log "INFO" "Iniciando backup do banco de dados: $MYSQL_DATABASE"
    
    # Adiciona timeout ao mysqldump
    if timeout "$BACKUP_TIMEOUT" mysqldump \
        --single-transaction \
        --routines \
        --triggers \
        --events \
        --hex-blob \
        --opt \
        -h "$MYSQL_HOST_HOST" \
        -P "$MYSQL_HOST_PORT" \
        -u"$MYSQL_USER" \
        -p"$MYSQL_PASSWORD" \
        "$MYSQL_DATABASE" > "$BACKUP_FILE"; then
        
        local backup_end_time=$(date +%s)
        local backup_duration=$((backup_end_time - backup_start_time))
        local backup_size=$(du -h "$BACKUP_FILE" | cut -f1)
        
        log "SUCCESS" "Backup realizado com sucesso"
        log "INFO" "Arquivo: $BACKUP_FILE"
        log "INFO" "Tamanho: $backup_size"
        log "INFO" "Duração: ${backup_duration}s"
        
        return 0
    else
        log "ERROR" "Falha ao realizar backup"
        return 1
    fi
}

# Função para comprimir backup
compress_backup() {
    if [[ "$COMPRESS_BACKUP" == "true" ]]; then
        log "INFO" "Comprimindo arquivo de backup..."
        
        if gzip "$BACKUP_FILE"; then
            BACKUP_FILE="${BACKUP_FILE}.gz"
            local compressed_size=$(du -h "$BACKUP_FILE" | cut -f1)
            log "SUCCESS" "Backup comprimido: $compressed_size"
        else
            log "ERROR" "Falha ao comprimir backup"
            return 1
        fi
    fi
}

# Função para transferir backup
transfer_backup() {
    log "INFO" "Transferindo backup para servidor remoto..."
    
    local transfer_start_time=$(date +%s)
    
    if [[ "$USE_SSH_KEY" == "true" ]]; then
        if timeout 1800 scp -i "$SSH_KEY_PATH" "$BACKUP_FILE" \
           "$BACKUP_SERVER_USER@$BACKUP_SERVER_HOST:$BACKUP_SERVER_DIR/"; then
            local transfer_end_time=$(date +%s)
            local transfer_duration=$((transfer_end_time - transfer_start_time))
            log "SUCCESS" "Backup transferido com sucesso (${transfer_duration}s)"
            return 0
        else
            log "ERROR" "Falha na transferência via SSH key"
            return 1
        fi
    else
        if timeout 1800 sshpass -p "$BACKUP_SERVER_USER_PASSWORD" scp "$BACKUP_FILE" \
           "$BACKUP_SERVER_USER@$BACKUP_SERVER_HOST:$BACKUP_SERVER_DIR/"; then
            local transfer_end_time=$(date +%s)
            local transfer_duration=$((transfer_end_time - transfer_start_time))
            log "SUCCESS" "Backup transferido com sucesso (${transfer_duration}s)"
            return 0
        else
            log "ERROR" "Falha na transferência via senha"
            return 1
        fi
    fi
}

# Função para limpeza de arquivos antigos
cleanup_old_files() {
    log "INFO" "Removendo arquivos antigos..."
    
    # Remove logs antigos
    if [[ -d "$LOG_DIR" ]]; then
        find "$LOG_DIR" -name "backup_*.log" -mtime +$MAX_LOG_DAYS -delete 2>/dev/null || true
    fi
    
    # Remove backups locais antigos (caso existam)
    if [[ -d "$TEMP_DIR" ]]; then
        find "$TEMP_DIR" -name "backup_*.sql*" -mtime +$MAX_BACKUP_DAYS -delete 2>/dev/null || true
    fi
    
    # Remove arquivo atual após transferência
    if [[ -f "$BACKUP_FILE" ]]; then
        rm -f "$BACKUP_FILE"
        log "INFO" "Arquivo local removido: $BACKUP_FILE"
    fi
    
    log "SUCCESS" "Limpeza concluída"
}

# Função para verificar espaço em disco
check_disk_space() {
    local required_space_mb=1000  # 1GB em MB
    local available_space_mb=$(df "$TEMP_DIR" | tail -1 | awk '{print int($4/1024)}')
    
    if [[ $available_space_mb -lt $required_space_mb ]]; then
        log "WARN" "Pouco espaço disponível: ${available_space_mb}MB (recomendado: ${required_space_mb}MB)"
    else
        log "INFO" "Espaço em disco suficiente: ${available_space_mb}MB"
    fi
}

# Função principal
main() {
    local script_start_time=$(date +%s)
    
    # Define arquivo de backup
    local date_suffix=$(date +%u)  # 1=Segunda, 7=Domingo
    local backup_filename="backup_${MYSQL_DATABASE}_${date_suffix}"
    [[ "$COMPRESS_BACKUP" == "true" ]] && backup_filename="${backup_filename}.sql" || backup_filename="${backup_filename}.sql"
    BACKUP_FILE="${TEMP_DIR}/${backup_filename}"
    
    log "INFO" "=========================================="
    log "INFO" "Iniciando processo de backup"
    log "INFO" "Data/Hora: $(date)"
    log "INFO" "=========================================="
    
    # Executa funções em sequência
    create_directories
    load_env_variables
    check_dependencies
    check_disk_space
    check_mysql_connection
    check_ssh_connection
    perform_backup
    compress_backup
    transfer_backup
    cleanup_old_files
    
    local script_end_time=$(date +%s)
    local total_duration=$((script_end_time - script_start_time))
    
    log "SUCCESS" "=========================================="
    log "SUCCESS" "Backup BD concluído com sucesso!"
    log "SUCCESS" "Duração total: ${total_duration}s"
    log "SUCCESS" "=========================================="
    
}

# Configura trap para cleanup
trap cleanup EXIT

# Executa função principal
main "$@"