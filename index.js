const port = 8000;

const express = require('express');
const userController = require('./controllers/userController');
const centersRouter = require('./routes/center');
const connectDB = require('./config/db');
const cors = require('cors');

const app = express();

connectDB();

app.use(cors({ credentials: true, origin: 'http://localhost:3000' })); // CORS 설정
app.use(express.json());
app.use('/user', userController);
app.use('/api', centersRouter);

app.get('/', function (req, res) {
  res.send('Hello World');
});

app.listen(port, () => {
  console.log(`${port}번에서 돌아감`);
});
