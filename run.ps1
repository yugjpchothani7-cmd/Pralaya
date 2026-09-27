# PRALAYA PowerShell Development Runner
param (
    [string]$Command = "help"
)

switch ($Command) {
    "backend" {
        Write-Host "Starting PRALAYA FastAPI Backend on http://127.0.0.1:8000..." -ForegroundColor Cyan
        & ".\backend\.venv\Scripts\python.exe" "backend\run.py"
    }
    "frontend" {
        Write-Host "Starting PRALAYA React Frontend on http://localhost:5173..." -ForegroundColor Cyan
        cd frontend
        npm run dev
    }
    "test" {
        Write-Host "Running Backend Pytest Suite..." -ForegroundColor Cyan
        & ".\backend\.venv\Scripts\pytest.exe" "tests\backend" -v
        Write-Host "Running Frontend TypeScript Build Check..." -ForegroundColor Cyan
        cd frontend
        npm run build
    }
    default {
        Write-Host "PRALAYA Developer Helper:" -ForegroundColor Yellow
        Write-Host "  .\run.ps1 backend   - Run FastAPI server"
        Write-Host "  .\run.ps1 frontend  - Run Vite dev server"
        Write-Host "  .\run.ps1 test      - Run backend and frontend test suites"
    }
}
