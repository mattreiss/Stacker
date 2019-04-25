#!/bin/bash

runDir=$(dirname "$0")
currentDir=$(pwd)
runDir="$(echo "${runDir/./$currentDir}")"

cd $runDir
cd ..


if [[ "$OSTYPE" == "darwin"* ]]; then
  main="$(pwd)/jsx/Main.jsx"
  osascript "./scpt/photoshop.scpt" $main $@
else
	echo "This OS is not supported :("
fi
