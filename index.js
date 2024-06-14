const port = 8000;

const express = require('express');
const userController = require('./controllers/userController');
const searchController = require('./controllers/searchController');
const postController = require('./controllers/postController');
const connectDB = require('./config/db');

const cors = require('cors');

const app = express();

connectDB();

app.use(cors({ credentials: true, origin: 'http://localhost:3000' })); // cors 이슈
app.use(express.json());
app.use('/user', userController);
// app.use('/search', searchController);
app.use('/uploads', express.static('uploads'));
app.use('/record', postController);

app.get('/', function (req, res) {
  res.send('Hello World');
});

app.listen(port, () => {
  console.log(`${port}번에서 돌아감`);
});
