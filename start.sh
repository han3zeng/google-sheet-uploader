#!/bin/sh
nodePath=~/.nvm/versions/node/v13.9.0/bin/node
cd /home/ec2-user/code/google-sheet-uploader
$nodePath /home/ec2-user/code/google-sheet-uploader/src/index.js && $nodePath /home/ec2-user/code/google-sheet-uploader/src/utils/uploader.js
