import { QuestionType } from "../types";
import { verifyAnswer } from "../utils/verify-answer";

export const Question = ({
    id: questionId, label, answers, setResult 
   }: QuestionType & { setResult: Function }) => {
   console.log('Question-render');
 
   return (
     <div className="question">
       <div className="label">{ label }</div>
 
       <div className="answers">
         { answers.map(({ label, id }) => <div>
           <div key={ `answer-${ id }` } onClick={ 
             () => verifyAnswer(id, questionId, setResult) 
           }>{ label } </div>
         </div>) } 
       </div>
     </div>
   )
 }