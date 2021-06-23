const fs = require('fs');
const path = require('path');
const CLINET_SECRET = path.resolve(__dirname, '../client_secret.json');
const TOKEN_PATH = path.resolve(__dirname, '../token.json');
// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
const getSpreadsheetData = require('./utils/fetch-from-spreadsheet');
const {
  sheetDataProcessor
} = require('./utils/data-processor/covid-19-dashboard');
const {
  writeFile
} = require('./utils/index');
const { logger, getLogObject } = require('./utils/create-logger');
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.

function createDirectories () {
  const distTargetDirectory = path.resolve(__dirname, '../dist');
  const logsTargetDirectory = path.resolve(__dirname, '../logs');

  const allDirs = [distTargetDirectory, logsTargetDirectory];

  allDirs.forEach(target => {
    if (!fs.existsSync(target)) {
      fs.mkdir(target, { recursive: true }, err => {
        if (err) throw err;
      });
    }
  });
}

try {
  createDirectories();
  getSpreadsheetData({
    tokenPath: TOKEN_PATH,
    clientSecret: CLINET_SECRET,
    scopes: SCOPES
  })
    .then(rawSpreadsheet => {
      const spreadsheet = sheetDataProcessor({
        rawData: rawSpreadsheet
      });
      writeFile({
        result: spreadsheet,
        fileName: 'content-covid-19-dashboard',
        fileExtension: 'json'
      });
    })
    .catch(({ message, error }) => {
      logger.log(
        getLogObject({
          level: 'error',
          message,
          error,
          filename: 'index.js'
        })
      );
    });
} catch (e) {
  logger.log(
    getLogObject({
      level: 'error',
      message: 'main error',
      error: e,
      filename: 'index.js'
    })
  );
}
