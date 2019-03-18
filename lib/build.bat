@echo off

color 04
xelatex --interaction=batchmode %1
set /A code1=%errorlevel%
if %2 (
	exit
)
color 06
bibtex %1
set /A code2=%errorlevel%
color 01
xelatex --interaction=batchmode %1
set /A code3=%errorlevel%
color 02
xelatex --interaction=batchmode %1
set /A code4=%errorlevel%
start %1.pdf
echo -e "Sub process exit code:"
echo %code1% %code2% %code3% %code4%
echo -e "If exit code is non-zero, please check if any errors occur."
