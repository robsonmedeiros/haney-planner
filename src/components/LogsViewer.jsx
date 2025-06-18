import React, { useEffect, useState } from 'react';
import logger from '../utils/logger';
// A importação dos ícones do Bootstrap é assumida como global.
// Se não for, adicione: import 'bootstrap-icons/font/bootstrap-icons.css';

/**
 * Componente que renderiza os detalhes de um log de forma estruturada.
 */
const DetailsViewer = ({ data }) => {
    if (!data || Object.keys(data).length === 0) {
        return <p className="text-sm text-gray-500 italic mt-2">Sem detalhes adicionais.</p>;
    }
    return (
        <div className="mt-4 bg-gray-100 p-3 rounded-lg text-xs text-gray-700">
            <pre className="whitespace-pre-wrap break-all">
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
            bar: 'bg-green-500',
            icon: 'bi-info-circle-fill',
            iconColor: 'text-green-500',
        },
        warn: {
            bar: 'bg-yellow-500',
            icon: 'bi-exclamation-triangle-fill',
            iconColor: 'text-yellow-500',
        },
        error: {
            bar: 'bg-red-500',
            icon: 'bi-x-octagon-fill',
            iconColor: 'text-red-500',
        },
    };

    const styles = levelStyles[log.level] || levelStyles.info;

    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm mb-3 overflow-hidden">
            <div className="flex items-start p-4">
                <div className={`w-1.5 h-full self-stretch rounded ${styles.bar} mr-4`}></div>
                <div className="flex-shrink-0">
                    <i className={`text-2xl ${styles.icon} ${styles.iconColor}`}></i>
                </div>
                <div className="flex-grow mx-4">
                    <p className="font-semibold text-gray-800">{log.message}</p>
                    <p className="text-sm text-gray-500 mt-1">
                        {new Date(log.timestamp).toLocaleString('pt-BR')}
                    </p>
                </div>
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="flex items-center text-sm text-blue-600 hover:text-blue-800 font-semibold"
                >
                    Detalhes
                    <i className={`bi bi-chevron-down ms-2 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}></i>
                </button>
            </div>
            {isExpanded && (
                <div className="px-4 pb-4 pl-16">
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
                className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${filterLevel === level
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                    }`}
            >
                {levelLabels[level]}
            </button>
        ));
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen font-sans">
            <header className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800 flex items-center">
                    <i className="bi bi-clipboard-data me-3 text-blue-600"></i>
                    Histórico de Logs
                </h1>
                <button
                    onClick={clearLogs}
                    className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg shadow-sm hover:bg-red-700 transition"
                >
                    <i className="bi bi-trash me-2"></i> Limpar Logs
                </button>
            </header>

            {/* Barra de Ferramentas e Filtros */}
            <div className="p-4 mb-6 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-2 p-1 bg-gray-100 rounded-lg">
                    {renderFilterButtons()}
                </div>
                <div className="relative w-full sm:w-auto">
                    <i className="bi bi-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                    <input
                        type="text"
                        placeholder="Filtrar por mensagem..."
                        value={filterText}
                        onChange={(e) => setFilterText(e.target.value)}
                        className="w-full sm:w-64 ps-10 pe-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
                    <div className="text-center py-16">
                        <i className="bi bi-journal-x text-5xl text-gray-300"></i>
                        <p className="mt-4 text-gray-500">Nenhum log encontrado com os filtros atuais.</p>
                    </div>
                )}
            </main>
        </div>
    );
}