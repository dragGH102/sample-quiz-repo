import { questions } from "../data";

export const verifyAnswer = (id: number, questionId: number, setResult: Function) => {
    const question = questions.find(question => {
        return question.id === questionId
    });

    if (!question) return;

    const answer = question.answers.find(answer => !!answer.correct);
    if (!answer) return;

    const correct = id === answer.id;

    setResult(correct ? 'Correct!' : 'Incorrect!');
}