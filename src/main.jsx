import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import HaneyPlanner from './HaneyPlanner';
import LogsViewer from './components/LogsViewer';
import logger from './utils/logger';
import './HaneyPlanner.css'; // Importa o CSS do Haney Planner

/**
 * Extrai detalhes relevantes de um elemento HTML para logging.
 * @param {HTMLElement} element - O elemento do qual extrair dados.
 * @returns {object} Um objeto com detalhes do elemento.
 */
const getElementDetails = (element) => {
    if (!element) return {};
    const details = {
        tag: element.tagName,
        id: element.id || 'N/A',
        className: element.className || 'N/A',
        text: element.textContent?.trim().slice(0, 100) || 'N/A',
    };
    if (element.name) details.name = element.name;
    if (element.type) details.type = element.type;
    if (element.value) {
        // Evita registrar informações sensíveis de campos de senha
        details.value = element.type === 'password' ? '********' : element.value;
    }
    return details;
};

/**
 * Componente que instala listeners de eventos globais para registrar ações do usuário.
 */
function GlobalActionLogger() {
    const location = useLocation();

    // Log de mudanças de rota
    useEffect(() => {
        logger.info('Navegação para nova rota', { path: location.pathname });
    }, [location]);

    // Log de interações gerais do usuário
    useEffect(() => {
        const handleUserClick = (e) => {
            logger.info('Clique do usuário', getElementDetails(e.target));
        };

        const handleInputChange = (e) => {
            logger.info('Entrada de dados do usuário', getElementDetails(e.target));
        };

        const handleFormSubmit = (e) => {
            const form = e.target;
            const formData = new FormData(form);
            const formDetails = getElementDetails(form);
            const data = {};

            // Captura dados do formulário, com atenção a dados sensíveis
            for (let [key, value] of formData.entries()) {
                const input = form.elements[key];
                if (input && input.type === 'password') {
                    data[key] = '********';
                } else {
                    data[key] = value;
                }
            }
            logger.info('Envio de formulário', { ...formDetails, data });
        };

        // Adiciona listeners usando captura para garantir que sejam acionados
        window.addEventListener('click', handleUserClick, true);
        window.addEventListener('change', handleInputChange, true); // Captura o valor final de inputs, selects, etc.
        window.addEventListener('submit', handleFormSubmit, true);

        return () => {
            window.removeEventListener('click', handleUserClick, true);
            window.removeEventListener('change', handleInputChange, true);
            window.removeEventListener('submit', handleFormSubmit, true);
        };
    }, []);

    return null; // Este componente não renderiza nada na UI.
}

function App() {
    return (
        <Router>
            <GlobalActionLogger /> {/* Componente responsável pelo logging global */}
            <Routes>
                <Route path="/" element={<HaneyPlanner />} />
                <Route path="/logs" element={<LogsViewer />} />
            </Routes>
        </Router>
    );
}

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);