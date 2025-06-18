import React, { useEffect, useState } from 'react';
import logger from '../utils/logger';
// A importação dos ícones do Bootstrap é assumida como global.
// Se não for, adicione: import 'bootstrap-icons/font/bootstrap-icons.css';

/**
 * Componente que renderiza os detalhes de um log de forma estruturada.
 */
const DetailsViewer = ({ data }) => {
    if (!data || Object.keys(data).length === 0) {
        return <p className="text-muted fst-italic mt-2">Sem detalhes adicionais.</p>;
    }
    return (
        <div className="mt-4 bg-light p-3 rounded text-sm text-secondary">
            <pre className="text-wrap">
                {JSON.stringify(data, null, 2)}
            </pre>
        </div>
    );
};

/**
 * Componente que representa um único item/card de log na lista.
 */
const LogItem = ({ log }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const levelStyles = {
        info: {
            bar: 'bg-success',
            icon: 'bi-info-circle-fill',
            iconColor: 'text-success',
        },
        warn: {
            bar: 'bg-warning',
            icon: 'bi-exclamation-triangle-fill',
            iconColor: 'text-warning',
        },
        error: {
            bar: 'bg-danger',
            icon: 'bi-x-octagon-fill',
            iconColor: 'text-danger',
        },
    };

    const styles = levelStyles[log.level] || levelStyles.info;

    return (
        <div className="card mb-3 overflow-hidden">
            <div className="d-flex align-items-start p-4">
                {/* Bootstrap doesn't have a direct equivalent for w-1.5 h-full bar,
                    so we'll use a custom style or a column with specific width */}
                <div style={{ width: '0.375rem', height: 'auto' }} className={`flex-shrink-0 align-self-stretch rounded-start ${styles.bar} me-4`}></div>
                <div className="flex-shrink-0">
                    <i className={`fs-4 ${styles.icon} ${styles.iconColor}`}></i>
                </div>
                <div className="flex-grow-1 mx-4">
                    <p className="fw-semibold text-dark">{log.message}</p>
                    <p className="text-sm text-muted mt-1">
                        {new Date(log.timestamp).toLocaleString('pt-BR')}
                    </p>
                </div>
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="btn btn-link text-decoration-none text-primary fw-semibold d-flex align-items-center"
                >
                    Detalhes
                    <i className={`bi bi-chevron-down ms-2 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}></i>
                </button>
            </div>
            {isExpanded && (
                <div className="px-4 pb-4 ps-5"> {/* Adjusted padding for alignment */}
                    <DetailsViewer data={log.details} />
                </div>
            )}
        </div>
    );
};

export default function LogsViewer() {
    const [logs, setLogs] = useState([]);
    const [filteredLogs, setFilteredLogs] = useState([]);
    const [filterLevel, setFilterLevel] = useState('all');
    const [filterText, setFilterText] = useState('');

    useEffect(() => {
        const storedLogs = logger.getAll().reverse();
        setLogs(storedLogs);
    }, []);

    useEffect(() => {
        let result = logs;
        if (filterLevel !== 'all') {
            result = result.filter(log => log.level === filterLevel);
        }
        if (filterText) {
            const lowercasedFilter = filterText.toLowerCase();
            result = result.filter(log =>
                log.message.toLowerCase().includes(lowercasedFilter) ||
                JSON.stringify(log.details).toLowerCase().includes(lowercasedFilter)
            );
        }
        setFilteredLogs(result);
    }, [logs, filterLevel, filterText]);

    const clearLogs = () => {
        logger.clear();
        setLogs([]);
    };

    const renderFilterButtons = () => {
        const levels = ['all', 'info', 'warn', 'error'];
        const levelLabels = { all: 'Todos', info: 'Info', warn: 'Warn', error: 'Error' };

        return levels.map(level => (
            <button
                key={level}
                onClick={() => setFilterLevel(level)}
                className={`btn btn-sm ${filterLevel === level
                    ? 'btn-primary'
                    : 'btn-light text-dark' // Using btn-light and text-dark for a light gray button
                    }`}
            >
                {levelLabels[level]}
            </button>
        ));
    };

    return (
        <div className="container py-4 bg-light min-vh-100 font-sans">
            <header className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="h3 fw-bold text-dark d-flex align-items-center">
                    <i className="bi bi-clipboard-data me-3 text-primary"></i>
                    Histórico de Logs
                </h1>
                <button
                    onClick={clearLogs}
                    className="btn btn-danger shadow-sm d-flex align-items-center"
                >
                    <i className="bi bi-trash me-2"></i> Limpar Logs
                </button>
            </header>

            {/* Barra de Ferramentas e Filtros */}
            <div className="p-3 mb-4 bg-white rounded-3 shadow-sm border d-flex flex-column flex-sm-row justify-content-between align-items-center gap-3">
                <div className="btn-group" role="group" aria-label="Filtro de Nível">
                    {renderFilterButtons()}
                </div>
                <div className="position-relative w-100 w-sm-auto">
                    <i className="bi bi-search position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"></i>
                    <input
                        type="text"
                        placeholder="Filtrar por mensagem..."
                        value={filterText}
                        onChange={(e) => setFilterText(e.target.value)}
                        className="form-control ps-5"
                    />
                </div>
            </div>

            {/* Lista de Logs */}
            <main>
                {filteredLogs.length > 0 ? (
                    filteredLogs.map((log, index) => (
                        <LogItem key={`${log.timestamp}-${index}`} log={log} />
                    ))
                ) : (
                    <div className="text-center py-5">
                        <i className="bi bi-journal-x display-4 text-muted"></i>
                        <p className="mt-3 text-muted">Nenhum log encontrado com os filtros atuais.</p>
                    </div>
                )}
            </main>
        </div>
    );
}