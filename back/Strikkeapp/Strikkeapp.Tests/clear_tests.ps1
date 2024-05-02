# Check if CoverageReports folder exists
if (Test-Path "CoverageReports") {
    Write-Output "Removing CoverageReports folder..."
    Remove-Item "CoverageReports" -Recurse -Force
    Write-Output "CoverageReports folder removed."
} else {
    Write-Output "CoverageReports folder does not exist."
}

# Check if TestResults folder exists
if (Test-Path "TestResults") {
    Write-Output "Removing TestResults folder..."
    Remove-Item "TestResults" -Recurse -Force
    Write-Output "TestResults folder removed."
} else {
    Write-Output "TestResults folder does not exist."
}