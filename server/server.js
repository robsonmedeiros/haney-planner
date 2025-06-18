const express = require('express');
const fs = require('fs');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 4000;
const DATA_FILE = path.join(__dirname, 'HaneyPlanner.json');

app.use(cors());
app.use(express.json());

// 🔐 Validação simples (topico é opcional)
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

app.post('/api/save', (req, res) => {
  const novoConteudo = req.body;

  if (!validarDados(novoConteudo)) {
    return res.status(422).json({ erro: 'Formato inválido nos dados enviados.' });
  }

  fs.writeFile(DATA_FILE, JSON.stringify(novoConteudo, null, 2), 'utf8', (err) => {
    if (err) {
      console.error('❌ Erro ao escrever o arquivo:', err);
      return res.status(500).json({ erro: 'Erro ao salvar arquivo.' });
    }

    console.log('✅ Progresso salvo com sucesso.');
    res.json({ mensagem: 'Progresso salvo com sucesso.' });
  });
});

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

app.listen(PORT, () => {
  console.log(`🚀 Servidor backend rodando em http://localhost:${PORT}`);
});
