#!/bin/bash
set -e

scp -r src package.json tsconfig.json coinop-vc:~/voice-server
ssh coinop-vc "source ~/.nvm/nvm.sh ; nvm use 14 && cd voice-server && npm install && npm run build && pm2 restart dist/index.js"
# scp -r src package.json tsconfig.json coinop-vc1:~/voice-server
# ssh coinop-vc1 "source ~/.nvm/nvm.sh ; nvm use 14 && cd voice-server && npm i && npm run build && pm2 restart dist/index.js"
