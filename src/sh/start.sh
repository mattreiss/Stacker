#!/bin/bash

runDir=$(dirname "$0")
currentDir=$(pwd)
runDir="$(echo "${runDir/./$currentDir}")"

cd $runDir
cd ..
cd ..

url=http://localhost:1337
status=$(curl $url/status)
if [[ $status == "running" ]]; then
  echo "already running, restarting server"
  curl $url/stop
fi

yarn start
