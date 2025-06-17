#!/bin/bash

echo "🧭 Inicializando repositório Git para HaneyPlanner..."

echo "🔧 Iniciando processo de commit para o HaneyPlanner"
read -p "✍️  Digite a descrição do commit: " desc

git add .
git commit -m "🧭 Projeto HaneyPlanner - $desc"

echo "🚀 Enviando código para a branch main..."
git branch -M main
git push -u origin main

echo "✅ Publicação inicial enviada. Ative o GitHub Pages pela interface: Settings → Pages → Deploy from gh-pages"
