#!/bin/bash
pname="simi23/ie3"
read -p "MAJOR Version: " vmajor
read -p "MINOR Version: " vminor
read -p "PATCH Version: " vpatch
echo "Building $pname:$vmajor.$vminor.$vpatch..."
docker build -t "$pname:$vmajor.$vminor.$vpatch" -t "$pname:$vmajor.$vminor" -t "$pname:$vmajor" -t "$pname:latest" .
read -p "Push images? (Y/N): " confirm && [[ $confirm == [yY] || $confirm == [yY][eE][sS] ]] || exit 1
docker push "$pname:$vmajor.$vminor.$vpatch"
docker push "$pname:$vmajor.$vminor"
docker push "$pname:$vmajor"
docker push "$pname:latest"
