#!/bin/bash

runDir=$(dirname "$0")
currentDir=$(pwd)
runDir="$(echo "${runDir/./$currentDir}")"

cd $runDir
cd ..


if [[ "$OSTYPE" == "darwin"* ]]; then
  osascript "./scpt/photoshop.scpt" "$(pwd)/jsx/Main.jsx" $@
elif grep -q Microsoft /proc/version; then
  path="$(pwd)/jsx/Main.jsx"
  path=$(echo $path | sed 's/\//\\/g')
  path=$(echo $path | sed 's/\\mnt\\c/C:/g')
  echo "running: cscript.exe ./vbs/photoshop.vbs ${path} $@"
  cscript.exe ./vbs/photoshop.vbs "${path}" $@
else
  echo "native Linux is not supported"
fi
