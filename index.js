/** @format */

const port = 8000;
const express = require('express');

const app = express();

app.get('/', function (req, res) {
  res.send('Hello World');
});

app.listen(port, () => {
  console.log(`${port}번에서 돌아감`);
});
