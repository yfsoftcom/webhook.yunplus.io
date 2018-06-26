@echo off

curl -H "Content-Type:application/json" -X POST --data '{"id":10}' http://localhost:9003/webhook/docker/python/WorldCup2018

pause