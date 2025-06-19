import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import HaneyPlanner from './HaneyPlanner';
import LogsViewer from './components/LogsViewer';
import logger from './utils/logger';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

/**
 * Extrai detalhes relevantes de um elemento HTML para logging.
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
        details.value = element.type === 'password' ? '********' : element.value;
    }
    return details;
};

/**
 * Componente que instala listeners de eventos globais para registrar ações do usuário.
 */
function GlobalActionLogger() {
    const location = useLocation();

    useEffect(() => {
        logger.info('Navegação para nova rota', { path: location.pathname });
    }, [location]);

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

            for (let [key, value] of formData.entries()) {
                const input = form.elements[key];
                data[key] = input?.type === 'password' ? '********' : value;
            }
            logger.info('Envio de formulário', { ...formDetails, data });
        };

        window.addEventListener('click', handleUserClick, true);
        window.addEventListener('change', handleInputChange, true);
        window.addEventListener('submit', handleFormSubmit, true);

        return () => {
            window.removeEventListener('click', handleUserClick, true);
            window.removeEventListener('change', handleInputChange, true);
            window.removeEventListener('submit', handleFormSubmit, true);
        };
    }, []);

    return null;
}

function App() {
    return (
        <Router basename={import.meta.env.VITE_BASE_PATH || '/'}>
            <GlobalActionLogger />
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
