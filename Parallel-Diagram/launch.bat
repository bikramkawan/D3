ECHO OFF
ECHO Launching "chrome --allow-file-access-from-files index.html"
start chrome --new-window --allow-file-access-from-files file:///%~dp0/index.html
PAUSE
:: In MacOS 
:: /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --allow-file-access-from-files index.html