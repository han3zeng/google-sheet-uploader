const fs = require('fs');
const path = require('path');
const { logger, getLogObject } = require('./create-logger');

// const fileName = 'editor';
const targetDirectory = path.resolve(__dirname, '../../dist');

const writeFile = ({ result, fileName, fileExtension }) => {
  fs.writeFile(`${targetDirectory}/${fileName}.${fileExtension}`, JSON.stringify(result, null, 2), (err) => {
    if (err) {
      logger.log(getLogObject({
        level: 'error',
        message: `fail to write file: ${fileName}: ${err}`,
        error: err,
        filename: 'util/index.js'
      }));
    } else {
      logger.log(getLogObject({
        level: 'info',
        message: `write file ${fileName} successfully`,
        error: null,
        filename: 'util/index.js'
      }));
    }
  });
};

module.exports = {
  writeFile
};
