#!/bin/bash
sudo apt update && sudo apt install postgresql postgresql-contrib nodejs npm
npm install pm2@latest -g
curl -sL https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add 
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
sudo apt update && sudo apt install --no-install-recommends yarn
sudo -u postgres psql

