import { QuestionType } from "../types";
import { verifyAnswer } from "../utils/verify-answer";

export const Question = ({
    id: questionId, label, imageUrl, answers, result, setResult 
   }: QuestionType & {result: any[]} & { setResult: Function }) => {
   console.log('Question-render');

   const question = result.find(res => res.questionId === questionId);
 
   return (
     <div className="question">
       <div className="question-image">
          <img src={imageUrl} alt={imageUrl} />
       </div>
       <div className="question-body">
          <div className="label">{ label }</div>
          <div className="answers">
             { answers.map(({ label, id }) => 
                   <div>
                      <div key={ `answer-${ id }` } onClick={() => verifyAnswer(id, questionId, setResult)}>{ label }</div>
                   </div>
                         )
             } 
          </div>
          {
             (!!question && question.isCorrect !== null) &&  <div>Result: {question.isCorrect ? "Correct" : "Incorrect"}</div>
          }
       </div>
     </div>
   )
 }