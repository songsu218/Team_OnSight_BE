const port = 8000;
const mongoose = require('mongoose');
const express = require('express');

const userController = require('./controllers/userController');
const postController = require('./controllers/postController');
const challengeController = require('./controllers/challengeController');

const centersRouter = require('./routes/center');

const connectDB = require('./config/db');
const cors = require('cors');

const app = express();

connectDB();

app.use(cors({ credentials: true, origin: 'http://localhost:3000' })); // CORS 설정
app.use(express.json());

app.use('/user', userController);

app.use('/api', centersRouter);

app.use('/uploads', express.static('uploads'));
app.use('/record', postController);
app.use('/challenge', challengeController);

app.get('/', function (req, res) {
  res.send('Hello World');
});

app.listen(port, () => {
  console.log(`${port}번에서 돌아감`);
});
