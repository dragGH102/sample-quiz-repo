const express = require('express');
var cors = require('cors');

const { questions } = require('./data/questions.js');

const app = express();
const port = 3001;

/*
 * Init middlewares
 */
app.use(cors());

/*
 * Init routes
 */
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/questions', (req, res) => {
  res.json(questions)
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
