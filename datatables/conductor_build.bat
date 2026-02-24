set WORKSPACE=.\
set LUBAN_DLL=%WORKSPACE%\tools\Luban\Luban.dll
set CONF_ROOT=.

dotnet %LUBAN_DLL% ^
    -t conductor ^
    -c typescript-json ^
    -d json ^
    --conf %CONF_ROOT%\luban.conf ^
    -x outputCodeDir=..\conductor\src\data ^
    -x outputDataDir=..\conductor\dara

pause