$command1 = "yarn emulate"
$command2 = "yarn dev:functions"
$command3 = "yarn dev:frontend"

$currentDirectory = Get-Location

Start-Process -FilePath "powershell.exe" -ArgumentList "-NoExit", "-Command", "cd '$currentDirectory'; $command1"
Start-Process -FilePath "powershell.exe" -ArgumentList "-NoExit", "-Command", "cd '$currentDirectory'; $command2"
Start-Process -FilePath "powershell.exe" -ArgumentList "-NoExit", "-Command", "cd '$currentDirectory'; $command3"