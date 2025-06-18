function enviarLog(nivel, evento, objeto) {
    try {
        fetch('/api/logs', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                nivel,
                evento,
                objeto,
                timestamp: new Date().toISOString(),
            }),
        });
    } catch (error) {
        console.error('Erro ao enviar log:', error);
    }
}

const logger = {
    info: (evento, objeto) => enviarLog('info', evento, objeto),
    warn: (evento, objeto) => enviarLog('warn', evento, objeto),
    error: (evento, objeto) => enviarLog('error', evento, objeto),
};

export default logger;
