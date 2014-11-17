#!/usr/bin/env bash

apt-get install -y build-essential python-software-properties python g++ make
apt-get update
apt-get install -y nodejs npm
ln -s /usr/bin/nodejs /usr/bin/node
npm config set loglevel warn
npm install -g sails pm2
cd /home/vagrant/current/
npm install
pm2 start app.js
