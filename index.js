const port = 8000;
const mongoose = require('mongoose');
const express = require('express');
const path = require('path');
const connectDB = require('./config/db');
const cors = require('cors');
const app = express();
connectDB();
app.use(cors({ credentials: true, origin: 'http://localhost:3000' })); // CORS 설정
app.use(express.json());

const userController = require('./controllers/userController');
const postController = require('./controllers/postController');
const challengeController = require('./controllers/challengeController');
const crewController = require('./controllers/crewController');
const crewFeedController = require('./controllers/crewFeedController');
const centerController = require('./controllers/centerController');

// 정적 파일 제공 설정
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/user', userController);
app.use('/record', postController);
app.use('/challenge', challengeController);
app.use('/crew', crewController);
app.use('/feed', crewFeedController);
app.use('/center', centerController);

app.get('/', function (req, res) {
  res.send('Hello World');
});

app.listen(port, () => {
  console.log(`${port}번에서 돌아감`);
});

// app.use('/api', centersRouter);
// const centersRouter = require('./routes/center');
