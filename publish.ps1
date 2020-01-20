Get-ChildItem -Path ".\dist\" -Exclude .git,privacy | Remove-Item -Recurse -Force
Copy-Item -Path ".\build\*" -Recurse -Destination ".\dist\" -Force
Copy-Item -Path ".\build\index.html" -Recurse -Destination ".\dist\privacy\index.html" -Force
Set-Location .\dist
git add .
git commit -a -m 'publish'
git push origin master
Set-Location ..