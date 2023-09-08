#!/bin/bash
set -e

scp -r src package.json tsconfig.json 2up-vc:~/voice-server
ssh 2up-vc "source ~/.nvm/nvm.sh ; nvm use 14 && cd voice-server && npm install && npm run build && pm2 restart dist/index.js"
# scp -r src package.json tsconfig.json 2up-vc1:~/voice-server
# ssh 2up-vc1 "source ~/.nvm/nvm.sh ; nvm use 14 && cd voice-server && npm i && npm run build && pm2 restart dist/index.js"
