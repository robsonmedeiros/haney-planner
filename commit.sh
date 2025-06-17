#!/bin/bash

echo "🔧 Iniciando processo de commit para o HaneyPlanner"

# Solicita o nome da feature
read -p "🌿 Digite o nome da funcionalidade (ex: ajustes-deploy): " branch_suffix

# Adiciona o prefixo 'feature/' automaticamente
branch="feature/$branch_suffix"

# Cria e muda para a branch (ou troca para ela, se já existir)
git checkout -b "$branch" 2>/dev/null || git checkout "$branch"

# Solicita descrição do commit
read -p "✍️  Digite a descrição do commit: " desc

# Executa commit
git add .
git commit -m "🧭 Projeto HaneyPlanner - $desc"
git push origin "$branch"

# Volta para a main
git checkout main

# Faz pull da main
git pull origin main

# Faz o merge da branch criada
git merge "$branch"

# Envia a main atualizada
git push origin main

# Deleta a branch local e remota
git branch -d "$branch"
git push origin --delete "$branch"

echo "✅ Merge da '$branch' finalizado e branch deletada com sucesso."
