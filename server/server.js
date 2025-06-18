const express = require('express');
const fs = require('fs');
const cors = require('cors');
const path = require('path');
const logsRoute = require('./logs.cjs'); // rota de logs

const app = express();
const PORT = 4000;
const DATA_FILE = path.join(__dirname, 'HaneyPlanner.json');
const LOG_FILE = path.join(__dirname, 'logs', 'eventos.json');

// Middleware base
app.use(cors());
app.use(express.json());
app.use(logsRoute);

// Validação de estrutura dos dados
const validarDados = (dados) => {
    if (!Array.isArray(dados)) return false;

    return dados.every(semana =>
        typeof semana.semana === 'string' &&
        Array.isArray(semana.atividades) &&
        semana.atividades.every(atividade =>
            typeof atividade.descricao === 'string' &&
            typeof atividade.concluido === 'boolean' &&
            (atividade.topico === undefined || typeof atividade.topico === 'string')
        )
    );
};

// Endpoint para salvar dados e verificar possíveis avisos
app.post('/api/save', (req, res) => {
    const novoConteudo = req.body;

    if (!validarDados(novoConteudo)) {
        return res.status(422).json({ erro: 'Formato inválido nos dados enviados.' });
    }

    // 🚨 Gera um log de nível "warn" se encontrar alguma atividade sem descrição
    const contemDescricaoVazia = novoConteudo.some(semana =>
        semana.atividades.some(atividade =>
            atividade.descricao?.trim() === ''
        )
    );

    if (contemDescricaoVazia) {
        const warnLog = {
            timestamp: new Date().toISOString(),
            nivel: 'warn',
            evento: 'Atividades com descrição vazia detectadas',
            objeto: novoConteudo
        };

        try {
            const logs = fs.existsSync(LOG_FILE)
                ? JSON.parse(fs.readFileSync(LOG_FILE, 'utf8'))
                : [];

            logs.push(warnLog);
            fs.writeFileSync(LOG_FILE, JSON.stringify(logs, null, 2));
        } catch (e) {
            console.error('Erro ao registrar log de warn:', e);
        }
    }

    // Salva os dados
    fs.writeFile(DATA_FILE, JSON.stringify(novoConteudo, null, 2), 'utf8', (err) => {
        if (err) {
            console.error('❌ Erro ao escrever o arquivo:', err);
            return res.status(500).json({ erro: 'Erro ao salvar arquivo.' });
        }

        console.log('✅ Progresso salvo com sucesso.');
        res.json({ mensagem: 'Progresso salvo com sucesso.' });
    });
});

// Endpoint para carregar dados
app.get('/api/data', (req, res) => {
    fs.readFile(DATA_FILE, 'utf8', (err, data) => {
        if (err) {
            console.error('❌ Erro ao ler o arquivo:', err);
            return res.status(500).json({ erro: 'Erro ao carregar dados.' });
        }

        try {
            res.json(JSON.parse(data));
        } catch (parseErr) {
            res.status(500).json({ erro: 'Erro ao interpretar arquivo de dados.' });
        }
    });
});

// Middleware global para capturar exceções e registrar em log
app.use((err, req, res, next) => {
    const erroLog = {
        timestamp: new Date().toISOString(),
        nivel: 'error',
        evento: err.message || 'Erro desconhecido',
        objeto: {
            path: req.originalUrl,
            method: req.method,
            stack: err.stack
        }
    };

    try {
        const logs = fs.existsSync(LOG_FILE)
            ? JSON.parse(fs.readFileSync(LOG_FILE, 'utf8'))
            : [];

        logs.push(erroLog);
        fs.writeFileSync(LOG_FILE, JSON.stringify(logs, null, 2));
    } catch (e) {
        console.error('Erro ao registrar exceção no log JSON:', e);
    }

    res.status(500).json({ erro: 'Erro interno no servidor.' });
});

// Inicia servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor backend rodando em http://localhost:${PORT}`);
});
