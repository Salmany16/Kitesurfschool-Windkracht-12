# Kitesurfschool Windkracht-12 - Lokaal Deployment Script
# Dit script automatiseert de volledige build en deployment cyclus voor de lokale Wamp64 PHP 8.3 omgeving.

$ErrorActionPreference = "Stop"
Write-Host "========================================================="
Write-Host "KITESURFSCHOOL WINDKRACHT-12 - LOKALE DEPLOYMENT"
Write-Host "========================================================="

# Paden definieren
$RootFolder = Get-Item .
$FrontendFolder = Join-Path $RootFolder.FullName "frontend"
$BackendFolder = Join-Path $RootFolder.FullName "backend"
$PhpPath = "C:\wamp64\bin\php\php8.3.28\php.exe"

# 1. Controleer of de PHP binary bestaat
if (-not (Test-Path $PhpPath)) {
    Write-Host "Waarschuwing: Wamp64 PHP 8.3 binary niet gevonden op '$PhpPath'."
    Write-Host "Er wordt geprobeerd de standaard systeem 'php' te gebruiken."
    $PhpPath = "php"
}

# 2. Frontend Build
Write-Host ""
Write-Host "[1/4] Frontend bouwen met Vite..."
if (Test-Path $FrontendFolder) {
    Push-Location $FrontendFolder
    try {
        Write-Host "Bezig met installeren van npm packages..."
        npm install
        Write-Host "Bezig met compileren van productie-assets..."
        npm run build
        Write-Host "Frontend succesvol gecompileerd!"
    }
    catch {
        Write-Host "Fout tijdens bouwen van frontend!"
        Pop-Location
        exit 1
    }
    Pop-Location
} else {
    Write-Host "Frontend map niet gevonden!"
    exit 1
}

# 3. Kopieren van Assets naar Laravel public directory
Write-Host ""
Write-Host "[2/4] Distributie-bestanden kopieren naar Laravel public folder..."
$DistFolder = Join-Path $FrontendFolder "dist"
$LaravelPublicFolder = Join-Path $BackendFolder "public"

if (Test-Path $DistFolder) {
    # Zorg dat we bestaande index.html en assets veilig opschonen in public
    $AssetsDest = Join-Path $LaravelPublicFolder "assets"
    if (Test-Path $AssetsDest) {
        Remove-Item -Path $AssetsDest -Recurse -Force
    }
    $IndexDest = Join-Path $LaravelPublicFolder "index.html"
    if (Test-Path $IndexDest) {
        Remove-Item -Path $IndexDest -Force
    }

    # Kopieer alles van frontend/dist naar backend/public
    Copy-Item -Path "$DistFolder\*" -Destination $LaravelPublicFolder -Recurse -Force
    Write-Host "Assets succesvol gekopieerd naar Laravel public!"
} else {
    Write-Host "Dist map niet gevonden! Heeft de build gefaald?"
    exit 1
}

# 4. Backend Database initialiseren (Migrate & Seed)
Write-Host ""
Write-Host "[3/4] Database verversen en seeden..."
if (Test-Path $BackendFolder) {
    Push-Location $BackendFolder
    try {
        Write-Host "Laravel database migraties verversen en seeden via PHP..."
        & $PhpPath artisan migrate:fresh --seed
        Write-Host "Database succesvol gemigreerd en gevuld met testdata!"
    }
    catch {
        Write-Host "Database migratie/seeding mislukt!"
        Pop-Location
        exit 1
    }
    Pop-Location
} else {
    Write-Host "Backend map niet gevonden!"
    exit 1
}

# 5. Afronding
Write-Host ""
Write-Host "[4/4] Afronding van de deployment..."
Write-Host "De applicatie is succesvol lokaal gebouwd en klaargezet!"
Write-Host "Draai de Laravel server met: "
Write-Host "  $PhpPath artisan serve"
Write-Host "En open http://127.0.0.1:8000 in je browser om te surfen!"
Write-Host "========================================================="
