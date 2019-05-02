#!/bin/bash

runDir=$(dirname "$0")
currentDir=$(pwd)
runDir="$(echo "${runDir/./$currentDir}")"

function install_mac() {
	app=$(ls /Applications/ | grep "Photoshop")
	if [[ $app == *"Photoshop"* ]]; then
		echo "Insalling script for $app"
		echo "app.system(\"${runDir}/start.sh\")" > "/Applications/$app/Presets/Scripts/Start Server.jsx"
	else
		echo "Couldn't find Photoshop"
	fi
}

if [[ "$OSTYPE" == "darwin"* ]]; then
  install_mac
else
	echo "This OS is not supported :("
fi
