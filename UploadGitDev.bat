@echo off
cd /d %~dp0
start "" "C:\Program Files\Git\bin\sh.exe" --login -i -c "echo 'Git Bash started'; git init > output.txt; git remote add clone https://github.com/Maganor22/Bedflix.git >> output.txt; git add * >> output.txt; git commit -m '%date% %time:~0,2%h%time:~3,2%' >> output.txt; git checkout -b dev >> output.txt; git push clone dev --force >> output.txt; cat output.txt"
