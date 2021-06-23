const fs = require('fs');
const path = require('path');
const { logger, getLogObject } = require('./create-logger');

// const fileName = 'editor';
const targetDirectory = path.resolve(__dirname, '../../dist');

const writeFile = ({ result, fileName, fileExtension }) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(`${targetDirectory}/${fileName}.${fileExtension}`, JSON.stringify(result, null, 2), (err) => {
      if (err) {
        reject({
          err,
          fileName
        });
      } else {
        logger.log(getLogObject({
          level: 'info',
          message: `write file ${fileName} successfully`,
          error: null,
          filename: 'util/index.js'
        }));
        resolve();
      }
    });
  });
};

module.exports = {
  writeFile
};
