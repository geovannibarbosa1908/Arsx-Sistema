@echo off
setlocal
set ROOT=%~dp0

:: Verifica .env
if not exist "%ROOT%.env" (
    echo [AVISO] .env nao encontrado. Copiando .env.example...
    copy "%ROOT%.env.example" "%ROOT%.env" >nul
    echo          Preencha %ROOT%.env antes de continuar.
    echo.
)

:: Verifica node_modules
if not exist "%ROOT%frontend\node_modules" (
    echo [INFO] node_modules nao encontrado. Rodando npm install...
    pushd "%ROOT%frontend"
    npm install
    popd
    echo.
)

:: Inicia backend
start "ON Backend  :7000" cmd /k "cd /d %ROOT% && uvicorn app.main:app --reload --port 7000"

:: Aguarda 1s para o backend subir antes do frontend
timeout /t 1 /nobreak >nul

:: Inicia frontend
start "ON Frontend :5123" cmd /k "cd /d %ROOT%frontend && npm run dev"

echo.
echo Servicos iniciados:
echo   Backend   http://localhost:7000
echo   Frontend  http://localhost:5123
echo   API Docs  http://localhost:7000/docs
echo.
