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
const uploadFile = require('./utils/uploader');
const { logger, getLogObject } = require('./utils/create-logger');
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const BUCKET_NAME = 'tpts-public';
const DIRECTORY_NAME = 'covid-19-dashboard';
const FILE_NAME = 'content-covid-19-dashboard-v2';

const targets = [
  {
    fileName: `${FILE_NAME}.json`,
    path: path.resolve(__dirname, `../dist/${FILE_NAME}.json`)
  }
];

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
    scopes: SCOPES,
    spreadsheetId: '1NwXx8Pqx_wR0O3YrpmxnWwiMv_M-6qzXu5giH566QHY',
    range: 'v2!A2:L'
  })
    .then(rawSpreadsheet => {
      const spreadsheet = sheetDataProcessor({
        rawData: rawSpreadsheet
      });
      writeFile({
        result: spreadsheet,
        fileName: FILE_NAME,
        fileExtension: 'json'
      })
        .then(() => {
          // uploadFile({
          //   targets,
          //   contentType: 'application/json',
          //   cacheControl: 'max-age=43200',
          //   bucketName: BUCKET_NAME,
          //   directoryName: DIRECTORY_NAME
          // });
        })
        .catch(({
          err,
          fileName
        }) => {
          logger.log(getLogObject({
            level: 'error',
            message: `fail to write file: ${fileName}: ${err}`,
            error: err,
            filename: 'util/index.js'
          }));
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
