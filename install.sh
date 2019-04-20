#!/bin/bash

runDir=$(dirname "$0")

function install_mac() {
	app=$(ls /Applications/ | grep "Photoshop")
	if [[ $app == *"Photoshop"* ]]; then
		echo "Found $app"
		echo "running cp -r $runDir/* /$app/Presets/Scripts/"
		cp -r "$runDir" "/Applications/$app/Presets/Scripts/"
	else
		echo "Couldn't find Photoshop"
	fi
}

if [[ "$OSTYPE" == "darwin"* ]]; then
  install_mac
else
	echo "This OS is not supported :("
fi
