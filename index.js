const port = 8000;

const express = require('express');
const userController = require('./controllers/userController');
 
const centersRouter = require('./routes/center');
 
const postController = require('./controllers/postController');
<<<<<<< HEAD
const challengeController = require('./controllers/challengeController');
=======
 
>>>>>>> 3c06c71cf3c2ea5152ce5e3cf7fae0f5b4cf3fb5
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
<<<<<<< HEAD
app.use('/challenge', challengeController);

=======
 
>>>>>>> 3c06c71cf3c2ea5152ce5e3cf7fae0f5b4cf3fb5

app.get('/', function (req, res) {
  res.send('Hello World');
});

app.listen(port, () => {
  console.log(`${port}번에서 돌아감`);
});
