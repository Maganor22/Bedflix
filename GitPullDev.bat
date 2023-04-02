@echo off
cd /d %~dp0
start "" "C:\Program Files\Git\bin\sh.exe" --login -i -c "echo 'Git Bash started'; git init; git remote add clone https://github.com/Maganor22/Bedflix.git; git pull clone dev"
