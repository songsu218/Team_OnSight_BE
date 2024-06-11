const port = 8000;

const express = require('express');
const userController = require('./controllers/userController');
const mongoose = require('mongoose');
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

//회원가입 요청
app.get('/register/:emailId/:nick/:password', async (req, res) => {
  const { emailId, nick, password } = req.params;
  res.send(`${emailId}, ${nick}, ${password}`);
  console.log(emailId, nick, password);
  try {
    const userDoc = await User.create({});
    console.log(userDoc);
  } catch (e) {}
});

app.listen(port, () => {
  console.log(`${port}번에서 돌아감`);
});
