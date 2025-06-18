# 🛠️ Haney Planner

**Planner interativo** desenvolvido em React + Vite para organização semanal de atividades técnicas — parte do Tech Challenge inspirado pela Haney 🐾, mascote da oficina Motorsync.

## 📸 Preview

![Preview do Planner](public/preview_haney_planner.png)

---

## 📁 Estrutura do Projeto

```txt
├── public/                          # Arquivos públicos acessíveis no build
│   ├── data/
│   │   └── HaneyPlanner.json        # Base de dados com atividades semanais
│   ├── logo.png                     # Logotipo da aplicação
│   └── preview_haney_planner.png   # Imagem de preview do planner

├── src/                             # Código-fonte principal (frontend)
│   ├── HaneyPlanner.jsx             # Componente principal do planner
│   ├── HaneyPlanner.css             # Estilo do planner
│   └── main.jsx                     # Entrada do app React + Vite

├── server/                          # Backend Node.js (Express)
│   ├── server.js                    # API para salvar e carregar progresso
│   ├── package.json
│   └── package-lock.json

├── .github/workflows/              # CI/CD (deploy GitHub Pages)
│   └── deploy-github-pages.yml

├── .env.development                # Variáveis para ambiente dev
├── .env.production                 # Variáveis para produção
├── .gitignore                      # Arquivos ignorados pelo Git
├── commit.sh                       # Script de commit automatizado
├── index.html                      # HTML principal da aplicação
├── package.json                    # Configuração do projeto frontend
├── package-lock.json
├── start.sh                        # Script de inicialização local (frontend + backend)
├── vite.config.js                  # Configuração do Vite
├── LICENSE                         # Licença MIT
├── README.md                       # Documentação do projeto
```

---

## 🚀 Como Rodar Localmente

### 1. Instale as dependências do frontend

```bash
npm install
```

### 2. Inicie o ambiente de desenvolvimento

```bash
npm run dev
```

> A aplicação estará disponível em: [http://localhost:3000](http://localhost:3000)

### 3. Inicie o backend (Express)

```bash
cd server
npm install
node server.js
```

> Backend responde em: [http://localhost:4000/api](http://localhost:4000/api)

---

## 🧾 Edição de Dados

As tarefas semanais estão no arquivo:

```
/public/data/HaneyPlanner.json
```

Cada atividade possui:

- `descricao`: texto da tarefa
- `concluido`: booleano
- `topico`: campo opcional de observações

---

## 🧪 Testes Automatizados

Este projeto utiliza [Vitest](https://vitest.dev) com [React Testing Library](https://testing-library.com/) para testes de componentes e interações.

### ▶️ Executar os testes

```bash
npm run test
```

### 📊 Executar testes com relatório de cobertura

```bash
npm run coverage
```

Será gerada uma pasta:

```
/coverage/index.html
```

Abra esse arquivo no navegador para visualizar o relatório detalhado de cobertura de código.

---

## ☁️ Deploy

Deploy automático via GitHub Pages:

🔗 [https://robsonmedeiros.github.io/haney-planner/](https://robsonmedeiros.github.io/haney-planner/)

---

## 👨‍💻 Autor

Desenvolvido por [Robson Leonel Medeiros](https://github.com/robsonmedeiros)

---

## 📄 Licença

Distribuído sob a licença MIT. Consulte o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## ⚙️ Scripts Auxiliares

### ▶️ start.sh — Inicialização Local Automatizada

Este script instala dependências, inicia o backend e o frontend, e abre o navegador automaticamente:

```bash
./start.sh
```

#### O que ele faz:

1. Instala dependências do backend (Express)
2. Inicia o backend com Nodemon na porta 4000
3. Abre o navegador em `http://localhost:3000`
4. Instala dependências do frontend
5. Inicia o Vite em modo `development`

---

### 🧭 commit.sh — Automação de Git Flow

Este script facilita o versionamento com branches `feature/`, commit, merge e limpeza:

```bash
./commit.sh
```

#### O que ele faz:

1. Solicita o nome da feature → cria `feature/<nome>`
2. Solicita a descrição do commit
3. Adiciona, commita e dá push na feature branch
4. Faz `checkout main`, `merge`, `push`
5. Deleta a branch local e remota

Ideal para manter seu fluxo Git organizado e padronizado.

---

## 🧪 Testes com Jest

Este projeto usa `Jest` com `Testing Library` para testes unitários.

### Rodar todos os testes:

```bash
npm test
```

### Rodar em modo observação:

```bash
npm run test:watch
```

### Gerar cobertura de testes:

```bash
npm run coverage
```

> O relatório de cobertura estará em `coverage/lcov-report/index.html`

---

## 🛠️ Ferramentas e Configuração

- Babel com presets para React (`.babelrc`)
- Jest configurado via `jest.config.js`
- Suporte a importação de CSS com `identity-obj-proxy`
