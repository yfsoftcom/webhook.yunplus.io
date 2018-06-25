#! /bin/sh
# shell program for code pull when github push webhook

# Clear The Screen
clear

# TODO: change the dir
PROJECT_DIR="/home/yf/nodejs/projects"
WEB_SITE_DIR="$PROJECT_DIR/demo.yunplus.io"


#没有值
if [ -z $1 ]; then
  echo ">>>>>>>> Welcome there"
  echo ">>>>>>>> Shell Require 2 Arguments; Such As : list -w/-p , pull -w/-p ..."
  exit

elif [ $1 = "list" ]; then
  echo ">>>>>>>> Show All The Projects"
  if [ $2 = "-p" ]; then
    ls -p $PROJECT_DIR/ | grep /
  elif [ $2 = "-w" ]; then
    ls -p $WEB_SITE_DIR/ | grep /
  fi
  exit

elif [ $1 = "pull" ]; then
  echo ">>>>>>>> Pull The Projects Code"
  if [ $2 = "-p" ]; then
    cd $PROJECT_DIR/$3
    git pull
    yarn
    pm2 restart $3
  elif [ $2 = "-w" ]; then
    cd $WEB_SITE_DIR/$3
    git pull
  fi
  echo "DONE"


  exit
fi
