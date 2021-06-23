const AWS = require('aws-sdk');
const fs = require('fs');
const { logger, getLogObject } = require('./create-logger');
require('dotenv').config();

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_API_KEY,
  secretAccessKey: process.env.AWS_SECRET
});

const uploadFile = ({
  targets,
  contentType: ContentType,
  cacheControl: CacheControl,
  bucketName,
  directoryName
}) => {
  targets.forEach((target, index) => {
    const { fileName, path } = target;
    const fileContent = fs.readFileSync(path);
    const params = {
      Bucket: bucketName,
      Key: `${directoryName}/${fileName}`,
      Body: fileContent,
      ContentType,
      CacheControl,
      ACL: 'public-read'
    };
    s3.putObject(params, function (err, data) {
      if (err) {
        logger.log(getLogObject({
          level: 'error',
          message: `fail to upload file - erroe messae: ${err}`,
          error: err,
          filename: 'util/uploader.js'
        }));
      } else {
        logger.log(getLogObject({
          level: 'info',
          message: `File uploaded successfully. Etag: ${data.ETag}. file: ${fileName}`,
          error: null,
          filename: 'util/uploader.js'
        }));
      }
    });
  });
};

module.exports = uploadFile;
