#! /bin/sh

# Clear The Screen
clear
# TODO: change the dir
ROOT_DIR="/home/yf/docker"

#没有值
if [ -z $1 ]; then
  echo ">>>>>>>> Welcome there"
  echo ">>>>>>>> Shell Require 2 Arguments; Such As : restart WorldCup2018 ..."
  exit
fi
# $1 nodejs/python,project_type or project_dir
# $2 project_name

echo ">>>>>>>> Git Pull Project And Build Dockerfile , Then Restart The Container"
cd $ROOT_DIR/$2
git pull
if [ $1 = 'restart']; then
  # build && run
  docker-compose up --build -d
fi
exit
