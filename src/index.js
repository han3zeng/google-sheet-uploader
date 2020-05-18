const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');
const path = require('path');
const CLINET_SECRET = path.resolve(__dirname, '../client_secret.json');
const TOKEN_PATH = path.resolve(__dirname, '../token.json');
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
const { writeFile } = require('./utils/index');
const { processor, takeawayProcessor } = require('./utils/data-processor');
const logger = require('./utils/create-logger');

function getNewToken (oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error while trying to retrieve access token', err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}

function authorize (credentials, callback) {
  const {client_secret, client_id, redirect_uris} = credentials.web;
  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getNewToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}

function listMajors (auth) {
  const sheets = google.sheets({ version: 'v4', auth });
  // Content
  sheets.spreadsheets.values.get({
    spreadsheetId: '14MvZOZJMpxPXyzZI0UUcvGz6Bmti_CA-_zlNZDIgMf0',
    range: 'Content!A:F'
  }, (err, res) => {
    if (err) return console.log('The API returned an error: ' + err);
    const rows = res.data.values;
    if (rows.length) {
      // Print columns A and E, which correspond to indices 0 and 4.
      const result = processor(rows);
      writeFile({
        result,
        fileName: 'content'
      });
    } else {
      console.log('No data found.');
    }
  });
  // Takeaway
  sheets.spreadsheets.values.get({
    spreadsheetId: '14MvZOZJMpxPXyzZI0UUcvGz6Bmti_CA-_zlNZDIgMf0',
    range: 'Takeaway!A:C'
  }, (err, res) => {
    if (err) return console.log('The API returned an error: ' + err);
    const rows = res.data.values;
    if (rows.length) {
      // Print columns A and E, which correspond to indices 0 and 4.
      const result = takeawayProcessor(rows);
      writeFile({
        result,
        fileName: 'takeaway'
      });
    } else {
      console.log('No data found.');
    }
  });
}

try {
  (function createDirectories () {
    const distTargetDirectory = path.resolve(__dirname, '../dist');
    const logsTargetDirectory = path.resolve(__dirname, '../logs');

    const allDirs = [distTargetDirectory, logsTargetDirectory];

    allDirs.forEach((target) => {
      if (!fs.existsSync(target)) {
        fs.mkdir(target, { recursive: true }, (err) => {
          if (err) throw err;
        });
      }
    });
  })();
  fs.readFile(CLINET_SECRET, (err, content) => {
    if (err) return console.log('Error loading client secret file:', err);
    authorize(JSON.parse(content), listMajors);
  });
} catch (e) {
  logger.log({
    level: 'error',
    message: `top level - exception ${e}`
  });
};
