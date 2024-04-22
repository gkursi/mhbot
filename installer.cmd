@echo off
node -v >nul 2>&1 && (
    echo found nodejs
) || (
    echo "Could not find NodeJS, please install NodeJS and rerun this script"
    echo Press any key to exit..
    pause >nul
    exit /b 1
)

npm -v >nul 2>&1 && (
    echo found npm
    npm install
    echo [-------------------------------------------------------------]
    echo Installation complete!
    echo If something doesn't work, check the above output for errors.
    echo [-------------------------------------------------------------]
    echo Press any key to exit..
    pause >nul
    exit /b 0
) || (
    echo "Could not find NPM, please install NodeJS and rerun this script"
    echo Press any key to exit..
    pause >nul
    exit /b 1
)

