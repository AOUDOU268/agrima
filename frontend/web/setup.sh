#!/bin/bash

# AGRIMA - Script de démarrage

echo "🌾 AGRIMA - Plateforme E-commerce Agricole"
echo "==========================================="
echo ""

# Vérifier si npm est installé
if ! command -v npm &> /dev/null; then
    echo "❌ npm n'est pas installé. Veuillez installer Node.js et npm."
    exit 1
fi

# Vérifier si Angular CLI est installé
if ! command -v ng &> /dev/null; then
    echo "⚠️  Angular CLI n'est pas trouvé. Installation..."
    npm install -g @angular/cli
fi

echo "📦 Installation des dépendances..."
npm install

echo ""
echo "✅ Installation terminée !"
echo ""
echo "Pour lancer le serveur de développement:"
echo "  npm start"
echo ""
echo "Pour faire un build de production:"
echo "  npm run build"
echo ""
echo "L'application sera disponible sur: http://localhost:4200"
echo ""
