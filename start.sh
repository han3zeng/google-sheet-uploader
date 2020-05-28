#!/bin/sh
nodePath=~/.nvm/versions/node/v13.9.0/bin/node
awsPath=/usr/bin/aws
cd /home/ec2-user/code/google-sheet-uploader
$nodePath /home/ec2-user/code/google-sheet-uploader/src/index.js &&
$nodePath /home/ec2-user/code/google-sheet-uploader/src/utils/uploader.js #&&
# $awsPath cloudfront create-invalidation --distribution-id E2RE5FZJI8MX89 --paths "/recall-vote-han-kuo-yu/content.json" "/recall-vote-han-kuo-yu/key-events.json"
