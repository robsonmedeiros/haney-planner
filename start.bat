@echo off
echo Iniciando o backend Express...
cd server
call npm install
start cmd /k "node server.js"
cd ..

echo Iniciando o frontend Vite...
call npm install
set VITE_ENV=development
call npm run dev
