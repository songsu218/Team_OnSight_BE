const port = 8000;

const express = require('express');
const userController = require('./controllers/userController');

const cors = require('cors');
const bcrypt = require('bcryptjs');

const User = require('./modules/User');

const app = express();

app.use(cors({ credentials: true, origin: 'http://localhost:3000' })); // cors 이슈
app.use(express.json());
app.use('/user', userController);

app.get('/', function (req, res) {
  res.send('Hello World');
});

app.listen(port, () => {
  console.log(`${port}번에서 돌아감`);
});
