#!/usr/bin/env bash

SRV_IP=192.168.0.250
SRV_USR=pi
SRV_PASSWORD=raspberry

SRV_REPO_PATH=/home/pi/project/roadtripper-api
SRV_DEPLOY_SCRIPT=/home/pi/project/roadtripper-api/bin/deploy.sh


ssh $SRV_USR@$SRV_IP "cd $SRV_REPO_PATH; git pull origin master ; sudo  $SRV_DEPLOY_SCRIPT"
