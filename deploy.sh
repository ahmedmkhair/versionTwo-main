#!/bin/bash
sudo rm -rf /var/www/project/*
sudo rm -rf /opt/project/server.js
sudo cp -r clientfiles/* /var/www/project
sudo cp server.js /opt/project
