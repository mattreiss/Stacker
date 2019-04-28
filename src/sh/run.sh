#!/bin/bash

runDir=$(dirname "$0")
currentDir=$(pwd)
runDir="$(echo "${runDir/./$currentDir}")"

cd $runDir
cd ..


if [[ "$OSTYPE" == "darwin"* ]]; then
  osascript "./scpt/photoshop.scpt" "$(pwd)/jsx/Main.jsx" $@
else
	echo "This OS is not supported :("
fi
