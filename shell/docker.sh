#! /bin/sh
# shell program for code pull when github push webhook

# Clear The Screen
clear

# TODO: change the dir
ROOT_DIR="/home/yf/"


#没有值
if [ -z $1 ]; then
  echo ">>>>>>>> Welcome there"
  echo ">>>>>>>> Shell Require 2 Arguments; Such As : python nodejs ..."
  exit
fi
# $1 nodejs/python,project_type or project_dir
# $2 project_name

echo ">>>>>>>> Git Pull Project And Build Dockerfile , Then Restart The Container"
cd $ROOT_DIR/$1/$2
git pull
# build && run
docker-compose up --build -d
exit
