const express = require('express');
const app = express();
const portNumber = process.env.PORT;
const fs = require('fs');
const path = require('path');

app.get('/content-covid-19-dashboard-v2', function (req, res, next) {
  const file = fs.readFileSync(path.join(__dirname, '../dist/content-covid-19-dashboard-v2.json'));
  const content = JSON.parse(file);
  res.json(content);
});

app.listen(portNumber, () => {
  console.log(`listening at http://localhost:${portNumber}`);
});
