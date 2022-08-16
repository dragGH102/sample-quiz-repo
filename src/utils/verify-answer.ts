import { questions } from "../data";

export const selectAnswer = (id: number, questionId: number, setResult: Function) => {
    
    setResult((prevResult: any[]) => {

       if(prevResult.find(res => res.answerId === id)) return prevResult;
       
       let result;

       result = prevResult.filter((res) => res.questionId !== questionId);
       result = [...result, {questionId: questionId, answerId: id, isCorrect: null}]

       return result;      
    })
}
export const verifyAnswers = (setResult: Function, setEndGame: Function) => {
    setResult((prevResult: any[]) => {
        return prevResult.map((value) => {
            const question = questions.find(question => question.id === value.questionId);

            const answer = question?.answers.find(answer => !!answer.correct);

            const correct = answer?.id === value.answerId;

            return {...value, isCorrect: correct};
        })
    })

    setEndGame(true);
}