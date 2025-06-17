
const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

app.post('/api/save', (req, res) => {
  const data = req.body;
  const filePath = path.join(__dirname, '../public/data/HaneyPlanner.json');

  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    res.status(200).json({ message: 'Dados salvos com sucesso.' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao salvar os dados.' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor backend rodando em http://localhost:${PORT}`);
});
