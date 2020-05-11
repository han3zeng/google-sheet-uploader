const fs = require('fs');
const path = require('path');
const logger = require('./create-logger');

const fileName = 'editor';
const targetDirectory = path.resolve(__dirname, '../../dist');
const fileExtension = 'json';

const writeFile = ({ result }) => {
  fs.writeFile(`${targetDirectory}/${fileName}.${fileExtension}`, JSON.stringify(result, null, 2), (err) => {
    if (err) {
      logger.log({
        level: 'error',
        message: `fail to write file: ${fileName}: ${err}`
      });
    } else {
      logger.log({
        level: 'info',
        message: `write file ${fileName} successfully`
      });
    }
  });
};

module.exports = {
  writeFile
};
