#!/bin/bash

echo -e "\033[31m"
xelatex --interaction=batchmode $1
code1=$?
if [ $2 ] ;then
	exit
fi
echo -e "\033[33m"
bibtex $1
code2=$?
echo -e "\033[34m"
xelatex --interaction=batchmode $1
code3=$?
echo -e "\033[32m"
xelatex --interaction=batchmode $1
code4=$?
open $1.pdf
echo -e "\n\033[0mSub process exit code:"
echo $code1, $code2, $code3, $code4
echo -e "If exit code is non-zero, please check if any errors occur.\n"
