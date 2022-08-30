const express = require("express");
var cors = require("cors");
const { PrismaClient } = require("@prisma/client");

const { prismaFindUniqueQueryOrThrow } = require("./utils/prisma-query-or-throw.js");
const { PrismaClientKnownRequestError } = require("@prisma/client/runtime/index.js");

<<<<<<< HEAD
const prisma = new PrismaClient();
=======
const prisma = new PrismaClient({log: ['query']})
>>>>>>> 980ce4b (Adding Question)
const app = express();
const port = 3001;

/*
 * Init middlewares
 */
app.use(cors());
app.use(express.json());

/*
 * Init routes
 */

/*
 * Post routes
 */
app.post("/add/user", async (req, res) => {
	const { username, password } = req.body;

	try {
		const user = await prisma.user.create({
			data: req.body
		});

		res.json(user);
	} 
	catch(e) {
		// todo: polish. Capture single errors
		// Example: https://www.prisma.io/docs/concepts/components/prisma-client/handling-exceptions-and-errors
		res.status(400).json({
			message: typeof e === "object" ? e.message: e
		});
	}
}); 

app.get("/user/mock", async (req, res) => {
	// todo get user by id
	const user = await prisma.user.findFirst();
	res.json(user);
});

app.post("/add/question", async (req, res) => {
	const { label } = req.body;
	const Question = await prisma.question.create({
		data: { label: label }
	});
	res.json(Question);
}); 

app.post("/add/answer", async (req, res) => {
	const { label, status, question_id } = req.body;
	const Answer = await prisma.answer.create({
		data: {
			label: label,
			status: status,
			question_id: question_id
		}
	});
	res.json(Answer);
});
/*
 * TODO: To fix AddQuestions route this not working properly createMany()
 */
app.post("/add/questions", async (req, res) => {
	const { label } = req.body;
	const Question = await prisma.answer.createMany({
		data: { label } // = data: { label: label }
	});
	res.json(Question);
	console.log("anss---------", Question);
});
/*
 * TODO: To fix AddAnswers route this not working properly createMany()
 */
app.post("/add/answers", async (req, res) => {
	const { label, status, question_id } = req.body;
	const Answer = await prisma.answer.createMany({
		data: {
			label: label,
			status: status,
			question_id: question_id
		}
	});
	res.json(Answer);
	console.log("anss---------", Answer);
});

/*
 * Get routes
 */
app.get("/questionsWithAnswers", async (req, res) => {
	const Question = await prisma.question.findMany({
		include: { answers: true }
	});
	res.json(Question);
  
	console.log("All Questions with answers", Question);
});

app.get("/questions", async (req, res) => {
	const Question = await prisma.question.findMany({});
	res.json(Question);

	console.log("All Questions: ", Question);
});

app.get("/question/answer/:id", async (req, res) => {
	const { id } = req.params;
	const Question = await prisma.question.findUnique({
		where: { id: Number(id) },
		include: { answers: true }
	});
	res.json(Question);
	console.log("A Question with answers", Question);
}); 

app.get("/question/:id", async (req, res) => {
	const { id } = req.params;
  
	try {
		const Question = await prismaFindUniqueQueryOrThrow({
			where: { id: Number(id) },
		}, "question");

		res.json(Question);
		console.log("Only Question:----", Question);
	}
	catch(e) {
		console.log("catch at route level", e);
     
		res.status(400).json({
			message: typeof e === "object" ? e.message: e
		});
	}
}); 

/*
 * Delete routes
 */
app.delete("/question/:id", async (req, res) => {
	const { id } = req.params;

	try {
		const Question = await prisma.question.delete({
			where: {
				id: Number(id),
			}
		});
		res.json(Question);
	}
	catch(e) {
		// todo handle error so the server doesn't crash
		// for all the queries
		// see add/user route
		if(e instanceof PrismaClientKnownRequestError){
			res.status(400).json({message: e.meta?.cause});
		}
	}
});

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});


