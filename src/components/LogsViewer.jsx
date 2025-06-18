
import React, { useEffect, useState } from 'react';
import { Container, Form, Row, Col } from 'react-bootstrap';
import './LogsViewer.css';

const LogsViewer = () => {
    const [logs, setLogs] = useState([]);
    const [filtro, setFiltro] = useState('');
    const [pesquisa, setPesquisa] = useState('');
    const [paginaAtual, setPaginaAtual] = useState(1);
    const [logsPorPagina, setLogsPorPagina] = useState(10);

    useEffect(() => {
        fetch('/api/logs')
            .then((res) => res.json())
            .then((data) => setLogs(data))
            .catch((error) => console.error('Erro ao buscar logs:', error));
    }, []);

    const indiceInicial = (paginaAtual - 1) * logsPorPagina;
    const indiceFinal = indiceInicial + logsPorPagina;

    const logsFiltrados = logs.filter((log) => {
        const nivelMatch = filtro === '' || log.level === filtro;
        const pesquisaMatch =
            pesquisa === '' || JSON.stringify(log).toLowerCase().includes(pesquisa.toLowerCase());
        return nivelMatch && pesquisaMatch;
    });

    const totalPaginas = Math.ceil(logsFiltrados.length / logsPorPagina);
    const logsPaginados = logsFiltrados.slice(indiceInicial, indiceFinal);

    return (
        <Container className="my-4">
            <div className="d-flex align-items-center mb-4">
                <img src="/logo.png" alt="Logo" height="40" className="me-3" />
                <h2 className="mb-0">Visualizador de Logs - Tech Challenge Haney Motorsync</h2>
            </div>
            <Row className="mb-3">
                <Col md={6}>
                    <Form.Control
                        type="text"
                        placeholder="Pesquisar..."
                        value={pesquisa}
                        onChange={(e) => {
                            setPesquisa(e.target.value);
                            setPaginaAtual(1);
                        }}
                    />
                </Col>
                <Col md={3}>
                    <Form.Select
                        value={logsPorPagina}
                        onChange={(e) => {
                            setLogsPorPagina(Number(e.target.value));
                            setPaginaAtual(1);
                        }}
                    >
                        <option value={10}>10 por página</option>
                        <option value={20}>20 por página</option>
                        <option value={50}>50 por página</option>
                        <option value={100}>100 por página</option>
                    </Form.Select>
                </Col>
                <Col md={3}>
                    <Form.Select
                        value={filtro}
                        onChange={(e) => {
                            setFiltro(e.target.value);
                            setPaginaAtual(1);
                        }}
                    >
                        <option value="">Todos os níveis</option>
                        <option value="info">Info</option>
                        <option value="warn">Warn</option>
                        <option value="error">Error</option>
                    </Form.Select>
                </Col>
            </Row>

            <div className="logs-list">
                {logsPaginados.map((log, index) => (
                    <LogItem key={index} log={log} />
                ))}
            </div>

            {totalPaginas > 0 && (
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mt-4 gap-2">
                    <div className="text-muted small">
                        Exibindo {indiceInicial + 1} a {Math.min(indiceFinal, logsFiltrados.length)} de {logsFiltrados.length} registros
                    </div>

                    <div className="d-flex align-items-center gap-2">
                        <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => setPaginaAtual(1)}
                            disabled={paginaAtual === 1}
                        >
                            « Primeira
                        </button>

                        <button
                            className="btn btn-dark btn-sm"
                            disabled={paginaAtual === 1}
                            onClick={() => setPaginaAtual(paginaAtual - 1)}
                        >
                            ← Anterior
                        </button>

                        <span className="fw-semibold small">
                            Página {paginaAtual} de {totalPaginas}
                        </span>

                        <button
                            className="btn btn-dark btn-sm"
                            disabled={paginaAtual === totalPaginas}
                            onClick={() => setPaginaAtual(paginaAtual + 1)}
                        >
                            Próxima →
                        </button>

                        <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => setPaginaAtual(totalPaginas)}
                            disabled={paginaAtual === totalPaginas}
                        >
                            Última »
                        </button>
                    </div>
                </div>
            )}

        </Container >
    );
};

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
                <div
                    style={{ width: '0.375rem' }}
                    className={`flex-shrink-0 align-self-stretch rounded-start ${styles.bar} me-4`}
                ></div>
                <div className="flex-shrink-0">
                    <i className={`fs-4 ${styles.icon} ${styles.iconColor}`}></i>
                </div>
                <div className="flex-grow-1 mx-4">
                    <p className="fw-semibold text-dark">{log.evento || log.message}</p>
                    <p className="text-sm text-muted mt-1">
                        {new Date(log.timestamp).toLocaleString('pt-BR')}
                    </p>
                </div>
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="btn btn-link text-decoration-none text-secondary fw-semibold d-flex align-items-center"
                >
                    Detalhes
                    <i className={`bi bi-chevron-${isExpanded ? 'up' : 'down'} ms-2`}></i>
                </button>
            </div>
            {isExpanded && (
                <div className="px-4 pb-4 ps-5">
                    <DetailsViewer data={log.details || log.objeto} />
                </div>
            )}
        </div>
    );
};

const DetailsViewer = ({ data }) => {
    if (!data || typeof data !== 'object') return <div className="text-muted">Nenhum detalhe disponível.</div>;

    return (
        <div className="bg-light border rounded p-3">
            <pre className="mb-0 small text-dark">{JSON.stringify(data, null, 2)}</pre>
        </div>
    );
};

export default LogsViewer;