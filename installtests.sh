#!/bin/bash
sudo npm install
sudo npm i -g eslint
sudo npm install jest
sudo npm install mysql
sudo npm install axios
sudo npm install puppeteer --unsafe-perm=true
sudo npm install jsonwebtoken
sudo npm install express
sudo npm install bcryptjs
sudo pm2 delete all
sudo pm2 start test/server.js
