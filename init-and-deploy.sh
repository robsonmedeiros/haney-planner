#!/bin/bash

echo "🧭 Inicializando repositório Git para HaneyPlanner..."

git add .
git commit -m '🧭 Projeto HaneyPlanner - estrutura inicial'

echo "🚀 Enviando código para a branch main..."
git branch -M main
git push -u origin main

echo "✅ Publicação inicial enviada. Ative o GitHub Pages pela interface: Settings → Pages → Deploy from gh-pages"
