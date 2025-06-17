#!/bin/bash

echo "📦 Instalando dependências do backend (Express)..."
cd server
if [ ! -d "node_modules" ]; then
  npm install
fi

echo "🚀 Iniciando backend Express com Nodemon na porta 4000..."
npx nodemon server.js &
sleep 10

echo "🌐 Abrindo navegador em http://localhost:3000 ..."
start http://localhost:3000

cd ..
echo "📦 Instalando dependências do frontend (React + Vite)..."
if [ ! -d "node_modules" ]; then
  npm install
fi

echo "🧪 Executando em VITE_ENV=development na porta 3000..."
VITE_ENV=development npm run dev