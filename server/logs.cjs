const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const LOG_FILE = path.join(__dirname, 'logs', 'eventos.json');

// Rota para obter os logs
router.get('/api/logs', (req, res) => {
    try {
        if (!fs.existsSync(LOG_FILE)) {
            return res.status(200).json([]); // Retorna lista vazia se não houver arquivo
        }

        const content = fs.readFileSync(LOG_FILE, 'utf-8');
        const data = JSON.parse(content);

        res.json(data);
    } catch (error) {
        console.error('Erro ao ler logs:', error.message);
        res.status(500).json({ erro: 'Erro ao ler o arquivo de logs.' });
    }
});

// Rota para registrar um novo log
router.post('/api/logs', (req, res) => {
    try {
        const novoLog = req.body;

        if (!novoLog || !novoLog.nivel || !novoLog.evento || !novoLog.objeto) {
            return res.status(400).json({ erro: 'Formato inválido de log.' });
        }

        novoLog.timestamp = new Date().toISOString();

        const logs = fs.existsSync(LOG_FILE)
            ? JSON.parse(fs.readFileSync(LOG_FILE, 'utf-8'))
            : [];

        logs.push(novoLog);
        fs.writeFileSync(LOG_FILE, JSON.stringify(logs, null, 2));

        res.status(201).json({ mensagem: 'Log registrado com sucesso.' });
    } catch (error) {
        console.error('Erro ao registrar log:', error.message);
        res.status(500).json({ erro: 'Erro ao registrar log.' });
    }
});

module.exports = router;
