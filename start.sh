#!/bin/bash

echo "📦 Instalando dependências do backend (Express)..."
cd server
#npm install
#sleep 20

echo "🚀 Iniciando backend Express com Nodemon na porta 4000..."
npx nodemon server.js &
#sleep 10

echo "🌐 Abrindo navegador em http://localhost:3000 ..."
start http://localhost:3000

cd ..
echo "📦 Instalando dependências do frontend (React + Vite)..."
#npm install
#sleep 20

echo "🧪 Executando em VITE_ENV=production na porta 3000..."
VITE_ENV=production
#npm run build:prod
#npm run preview:prod
rm -rf dist
npm run build:prod
npm run preview:prod

echo "📊 Executando testes com cobertura..."
#npm run coverage
