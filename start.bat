@echo off
set ver=16.15.1
set arch=64
set appdata=%CD%\AppData

if not exist "%CD%\node-v%ver%-win-x%arch%" mkdir "%CD%\node-v%ver%-win-x%arch%"
PATH=%PATH%;"%CD%\node-v%ver%-win-x%arch%"
title node-js portable version %ver% LTS by sajima

if not exist "%CD%\node-v%ver%-win-x%arch%\node.exe" (
    echo installation de node-js portable version %ver% LTS
    if not exist "%CD%\cache" mkdir "%CD%\cache"

    powershell "Import-Module BitsTransfer; Start-BitsTransfer 'C:\Program Files\7-Zip\7z.exe' '%CD%\node-v%ver%-win-x%arch%\7z.exe'"
    powershell "Import-Module BitsTransfer; Start-BitsTransfer 'C:\Program Files\7-Zip\7z.dll' '%CD%\node-v%ver%-win-x%arch%\7z.dll'"
    powershell "Import-Module BitsTransfer; Start-BitsTransfer 'https://nodejs.org/dist/v%ver%/node-v%ver%-win-x%arch%.zip' '%CD%\cache\node-js.zip'"

    7z x -o"%CD%\" "%CD%\cache\node-js.zip"
    del "%CD%\node-v%ver%-win-x%arch%\7z.exe"
    del "%CD%\node-v%ver%-win-x%arch%\7z.dll"
    rmdir "%CD%\cache" /S /Q
)
cls
:launch 
npm install && npm start
pause
cls
echo une erreur est survenue
goto :launch