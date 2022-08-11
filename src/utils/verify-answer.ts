import { questions } from "../data";

export const verifyAnswer = (id: number, questionId: number, setResult: Function) => {
    const question = questions.find(question => {
        return question.id === questionId
    });

    if (!question) return;

    const answer = question.answers.find(answer => answer.id === id);
    
    if (!answer) return;

    const correct = !!answer.correct;

    setResult((prevResult: any[]) => prevResult.map((questionAnswer) => {
        return questionAnswer.questionId === questionId ? {...questionAnswer, isCorrect: correct} : questionAnswer;
    }));
}