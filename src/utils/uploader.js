const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');
const BUCKET_NAME = 'pts-multimedia';
const DIRECTORY_NAME = 'recall-vote-han-kuo-yu';
const logger = require('./create-logger');
require('dotenv').config();

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_API_KEY,
  secretAccessKey: process.env.AWS_SECRET
});

const targets = [
  {
    fileName: 'content.json',
    path: path.resolve(__dirname, '../../dist/content.json')
  },
  {
    fileName: 'takeaway.json',
    path: path.resolve(__dirname, '../../dist/takeaway.json')
  }
];

const uploadFile = (targets) => {
  targets.forEach((target, index) => {
    const { fileName, path } = target;
    const fileContent = fs.readFileSync(path);
    const params = {
      Bucket: BUCKET_NAME,
      Key: `${DIRECTORY_NAME}/${fileName}`,
      Body: fileContent,
      ContentType: 'application/json',
      CacheControl: 'max-age=300'
    };
    s3.putObject(params, function (err, data) {
      if (err) {
        logger.log({
          level: 'error',
          message: `fail to upload file - erroe messae: ${err}`
        });
      } else {
        logger.log({
          level: 'info',
          message: `File uploaded successfully. Etag: ${data.ETag}. file: ${fileName}`
        });
      }
    });
  });
};

uploadFile(targets);
