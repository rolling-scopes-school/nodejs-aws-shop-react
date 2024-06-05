# Run npm run build
Write-Host "Building web application..."
npm run build

# Get the directory of the current script
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition

# Change directory to the CDK project
$cdkProjectDir = Join-Path -Path $scriptDir -ChildPath "cdk-project"
Write-Host "Changing directory to $cdkProjectDir..."
Set-Location $cdkProjectDir

# Run cdk deploy
Write-Host "Deploying CDK stack..."
cdk deploy
