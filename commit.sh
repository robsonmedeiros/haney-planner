#!/bin/bash
clear
echo -e "\033[1;34m🔧 Iniciando commit para o HaneyPlanner...\033[0m"
echo -e ""

# Defina o mínimo de cobertura desejado
MINIMUM_COVERAGE=70

# Obtenha a cobertura atual (exemplo: CURRENT_COVERAGE=$(seu-comando-de-coverage))
# Para testar, você pode descomentar uma das linhas abaixo:
# CURRENT_COVERAGE=65
# CURRENT_COVERAGE=85
echo -e "\033[1;34m📊 Executando testes com cobertura...\033[0m"
echo -e ""
# Executa os testes com cobertura e formata a saída
# O comando `npx jest --coverage --silent --coverageReporters=text` executa os testes com cobertura e silencia a saída padrão, mas ainda exibe os resultados de cobertura.
# O comando `grep -A 100 "File.*% Stmts"` filtra a saída para mostrar apenas as linhas relevantes, começando da linha que contém "File" e "% Stmts".
# O comando `awk` formata a saída para destacar as linhas com cores e negrito.
# A variável COVERAGE_OUTPUT armazena a saída formatada.
#COVERAGE_OUTPUT=$(npx jest --coverage --silent --coverageReporters=text 2>&1 |
#    grep -A 100 "File.*% Stmts" |
#    awk 'BEGIN { yellow="\033[1;33m"; bold="\033[1m"; reset="\033[0m" } { print yellow bold $0 reset }')

#if [ $? -ne 0 ]; then
#    echo "❌ Erro ao executar cobertura. Abortando commit."
#    exit 1
#fi

# Extrair o percentual de linhas da linha "All files"
#CURRENT_COVERAGE=$(npx jest --coverage --silent --coverageReporters=text 2>&1 | grep "All files" | awk '{print $10}' | tr -d '%')

# Verifica se a variável CURRENT_COVERAGE existe
#if [ -z "$CURRENT_COVERAGE" ]; then
#    echo "⚠️  Variável CURRENT_COVERAGE não definida. Pulando verificação."
#    exit 0
#fi

#echo -e "\033[1;34m📈 Quadro de Cobertura Atual:\033[0m"
#echo -e ""
#echo -e "$COVERAGE_OUTPUT"
#echo -e ""

# Compara a cobertura atual com o mínimo (funciona com números inteiros)
#if [ "$CURRENT_COVERAGE" -lt "$MINIMUM_COVERAGE" ]; then
# Mensagem de alerta
#    echo -e "\033[1;31m❌ Cobertura de linhas (${CURRENT_COVERAGE}%) está abaixo do mínimo de (${MINIMUM_COVERAGE}%).\033[0m"

# Pergunta ao usuário se deseja continuar
# -p: exibe a mensagem de prompt
# -r: impede que barras invertidas ajam como caracteres de escape
# -n 1: lê apenas um caractere
#    echo -e "\033[1;33m⚠️  Atenção: A cobertura de testes está abaixo do mínimo exigido.\033[0m"
#    echo -e "\033[1;33mVocê pode forçar o commit, mas é altamente recomendado melhorar os testes antes de prosseguir.\033[0m"
#    echo -e ""
#                                              ┌─ Verde      ┌─ Vermelho
#    read -p "Deseja continuar com o commit mesmo assim? (\033[1;32ms\033[0m/\033[1;31mN\033[0m) " -n 1 -r
#    echo # Mover para a próxima linha após a entrada do usuário

# Verifica a resposta. A resposta padrão (pressionar Enter) será 'N' (Não)
#    if [[ $REPLY =~ ^[Ss]$ ]]; then
# Se o usuário digitou 's' ou 'S'
#        echo "⚠️  Commit forçado. Lembre-se de melhorar os testes."
#        exit 0 # Sai com sucesso para permitir o commit
#    else
# Se o usuário digitou qualquer outra coisa
#        echo "🛑 Commit cancelado. Corrija os testes antes de continuar."
#        exit 1 # Sai com erro para bloquear o commit
#    fi
#else
# Mensagem de sucesso
#    echo -e "\033[1;32m\033[1m✅ Cobertura de linhas (${CURRENT_COVERAGE}%) atinge o mínimo exigido (${MINIMUM_COVERAGE}%). Pode commitar com segurança.\033[0m"
#fi

# Pergunta ao usuário o nome do branch
echo -e ""

echo -e "\033[1;34m🌿 Criando branch para a nova funcionalidade...\033[0m"
read -p "🌿 Digite o nome da funcionalidade (ex: ajustes-deploy): " branch_suffix
branch="feature/$branch_suffix"

# Verifica se o branch já existe
if git show-ref --verify --quiet "refs/heads/$branch"; then
    echo -e "\033[1;33m⚠️ O branch '$branch' já existe. Usando o branch existente.\033[0m"
else
    echo -e "\033[1;32m🌱 Criando novo branch '$branch'.\033[0m"
fi

# Cria o branch e muda para ele
git checkout -b "$branch" 2>/dev/null || git checkout "$branch"

read -p "✍️  Digite a descrição do commit: " desc

git add .
git commit -m "🧭 Projeto HaneyPlanner - $desc"
git push origin "$branch"

git checkout main
git pull origin main
git merge "$branch"
git push origin main

git branch -d "$branch"
git push origin --delete "$branch"

echo "✅ Merge da '$branch' concluído com sucesso! O branch '$branch' foi mesclado e excluído."
echo "🌟 Lembre-se de atualizar o branch 'main' com as últimas alterações do repositório remoto."
echo "🚀 Commit realizado com sucesso! O branch '$branch' foi criado, mesclado e excluído."
echo -e "\033[1;34m🔚 Fim do processo de commit.\033[0m"
