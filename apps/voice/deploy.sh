#!/bin/bash
set -e

scp -r src package.json tsconfig.json truffles-vc:~/voice-server
ssh truffles-vc "source ~/.nvm/nvm.sh ; nvm use 14 && cd voice-server && npm install && npm run build && pm2 restart dist/index.js"
# scp -r src package.json tsconfig.json truffles-vc1:~/voice-server
# ssh truffles-vc1 "source ~/.nvm/nvm.sh ; nvm use 14 && cd voice-server && npm i && npm run build && pm2 restart dist/index.js"
