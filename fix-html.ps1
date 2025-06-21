Get-ChildItem -Path "out" -Filter "*.html" -Recurse | ForEach-Object {
    $content = Get-Content $_.FullName -Raw
    $content = $content -replace '/_next/', '/next-static/'
    Set-Content $_.FullName $content -Encoding UTF8
    Write-Host "Fixed: $($_.FullName)"
} 