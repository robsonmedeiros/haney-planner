const isDev = import.meta.env.DEV;

const LEVELS = {
    INFO: 'info',
    WARN: 'warn',
    ERROR: 'error'
};

/**
 * Armazena uma entrada de log no localStorage.
 * @param {string} level - O nível do log (e.g., 'info', 'warn').
 * @param {string} message - A mensagem descritiva do log.
 * @param {object} details - Um objeto contendo dados detalhados sobre o evento.
 */
const storeLog = (level, message, details = {}) => {
    try {
        const logs = JSON.parse(localStorage.getItem('userLogs') || '[]');
        logs.push({
            timestamp: new Date().toISOString(),
            level,
            message,
            details
        });
        localStorage.setItem('userLogs', JSON.stringify(logs));
    } catch (error) {
        console.error("Falha ao gravar log no localStorage", error);
    }
};

/**
 * Formata e exibe uma mensagem no console de desenvolvimento.
 * @param {'log' | 'warn' | 'error'} level - O tipo de console a ser usado.
 * @param {string} color - A cor do prefixo do log.
 * @param {string} message - A mensagem a ser exibida.
 * @param {object} details - O objeto de detalhes a ser exibido.
 */
const formatConsole = (level, color, message, details) => {
    const timestamp = new Date().toISOString();
    console[level](`%c[${timestamp}] ${level.toUpperCase()}:`, `color:${color};font-weight:bold`, message, details);
};

const logger = {
    /**
     * Registra uma mensagem informativa.
     * @param {string} message - A mensagem da ação.
     * @param {object} [details={}] - Detalhes associados.
     */
    info: (message, details) => {
        isDev && formatConsole('log', 'green', message, details);
        storeLog(LEVELS.INFO, message, details);
    },
    /**
     * Registra um aviso.
     * @param {string} message - A mensagem do aviso.
     * @param {object} [details={}] - Detalhes associados.
     */
    warn: (message, details) => {
        isDev && formatConsole('warn', 'orange', message, details);
        storeLog(LEVELS.WARN, message, details);
    },
    /**
     * Registra um erro.
     * @param {string} message - A mensagem do erro.
     * @param {object} [details={}] - Detalhes associados.
     */
    error: (message, details) => {
        // Sempre loga erros no console
        formatConsole('error', 'red', message, details);
        storeLog(LEVELS.ERROR, message, details);
    },
    /**
     * Retorna todos os logs armazenados.
     * @returns {Array} Uma matriz de objetos de log.
     */
    getAll: () => {
        try {
            return JSON.parse(localStorage.getItem('userLogs') || '[]');
        } catch (error) {
            console.error("Falha ao ler logs do localStorage", error);
            return [];
        }
    },
    /**
     * Limpa todos os logs do localStorage.
     */
    clear: () => localStorage.removeItem('userLogs')
};

export default logger;