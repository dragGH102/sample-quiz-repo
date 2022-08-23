const express = require('express');
var cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient()
const app = express();
const port = 3001;

/*
 * Init middlewares
 */
app.use(cors());
app.use(express.json())

/*
 * Init routes
 */

/*
 * Post routes
 */
app.post('/addQuestion', async (req, res) => {
  const { label } = req.body
  const newQuestion = await prisma.question.create({
    data: {
      label: label,
    }
  })
  res.json(newQuestion)
}) 

app.post('/addAnswer', async (req, res) => {
  const { label, status, question_id } = req.body;
  const ans = await prisma.answer.create({
    data: {
      label: label,
      status: status,
      question_id: question_id
    }
  })
  res.json(ans);
})
/*
 * TODO: To fix AddQuestions route this not working properly createMany()
 */
app.post('/addQuestions', async (req, res) => {
  const { label } = req.body;
  const Quests = await prisma.answer.createMany({
    data: {
      label: label,
    }
  })
  res.json(Quests)
  console.log("anss---------", Quests);
})
/*
 * TODO: To fix AddAnswers route this not working properly createMany()
 */
app.post('/addAnswers', async (req, res) => {
    const { label, status, question_id } = req.body;
    const Ans = await prisma.answer.createMany({
      data: {
        label: label,
        status: status,
        question_id: question_id
      }
    })
    res.json(Ans)
    console.log("anss---------", Ans);
})

/*
 * Get routes
 */
app.get('/', async (req, res) => {
  const questions = await prisma.question.findMany({
    include: { answers: true }
  })
  res.json(questions)
  console.log(`All Questions with answers`, questions)
});

app.get('/questions', async (req, res) => {
  const questions = await prisma.question.findMany({})
  res.json(questions)
  console.log('All Questions: ', questions);
})

app.get('/question_ans/:id', async (req, res) => {
  const { id } = req.params
  const quest = await prisma.question.findUnique({
    where: { id: Number(id) },
    include: { answers: true }
  })
  res.json(quest)
  console.log(`A Question with answers`, quest)
}) 

app.get('/question/:id', async (req, res) => {
  const { id } = req.params
  const quest = await prisma.question.findUnique({
    where: { id: Number(id) },
  })
  res.json(quest)
  console.log(`Only Question:----`, quest)
}) 

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});


