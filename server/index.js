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
app.all('*', (req, res) => {
  res.status(404).send({
    msg: "Error 404",
    result: false
  })
})

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/questions', (req, res) => {
  res.json(questions)
});

app.get('/userData', (req, res) => {
  res.json({
    username: 'x'
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
