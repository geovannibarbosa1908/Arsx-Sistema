# Script de desenvolvimento — Open Networking
# Inicia backend (uvicorn :8000) e frontend (vite :5173) em janelas separadas

$Root = $PSScriptRoot

# Verifica .env
if (-not (Test-Path "$Root\.env")) {
    Write-Host "[AVISO] .env nao encontrado. Copiando .env.example..." -ForegroundColor Yellow
    Copy-Item "$Root\.env.example" "$Root\.env"
    Write-Host "         Preencha D:\OpenNetworking\.env antes de continuar." -ForegroundColor Yellow
    Write-Host ""
}

# Verifica node_modules do frontend
if (-not (Test-Path "$Root\frontend\node_modules")) {
    Write-Host "[INFO] node_modules nao encontrado. Rodando npm install..." -ForegroundColor Cyan
    Push-Location "$Root\frontend"
    npm install
    Pop-Location
    Write-Host ""
}

# Detecta Windows Terminal (wt) para abrir em abas, senão usa janelas separadas
$useWT = $null -ne (Get-Command wt -ErrorAction SilentlyContinue)

if ($useWT) {
    Write-Host "[INFO] Abrindo no Windows Terminal..." -ForegroundColor Cyan
    $backendCmd  = "Set-Location '$Root'; uvicorn app.main:app --reload --port 7000"
    $frontendCmd = "Set-Location '$Root\frontend'; npm run dev"
    wt `
        --title "ON Backend" powershell -NoExit -Command $backendCmd `; `
        new-tab --title "ON Frontend" powershell -NoExit -Command $frontendCmd
} else {
    Write-Host "[INFO] Abrindo em janelas PowerShell separadas..." -ForegroundColor Cyan
    Start-Process powershell -ArgumentList "-NoExit", "-Command",
        "Set-Location '$Root'; Write-Host 'BACKEND — http://localhost:7000' -ForegroundColor Cyan; uvicorn app.main:app --reload --port 7000"
    Start-Sleep -Milliseconds 500
    Start-Process powershell -ArgumentList "-NoExit", "-Command",
        "Set-Location '$Root\frontend'; Write-Host 'FRONTEND — http://localhost:5123' -ForegroundColor Green; npm run dev"
}

Write-Host ""
Write-Host "Servicos iniciados:" -ForegroundColor Green
Write-Host "  Backend   http://localhost:7000"
Write-Host "  Frontend  http://localhost:5123"
Write-Host "  API Docs  http://localhost:7000/docs"
Write-Host ""
