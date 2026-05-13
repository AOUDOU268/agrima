@echo off
REM AGRIMA - Script de démarrage Windows

echo 🌾 AGRIMA - Plateforme E-commerce Agricole
echo ===========================================
echo.

REM Vérifier si npm est installé
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ npm n'est pas installé. Veuillez installer Node.js et npm.
    exit /b 1
)

echo 📦 Installation des dépendances...
call npm install

echo.
echo ✅ Installation terminée !
echo.
echo Pour lancer le serveur de développement:
echo   npm start
echo.
echo Pour faire un build de production:
echo   npm run build
echo.
echo L'application sera disponible sur: http://localhost:4200
echo.
pause
