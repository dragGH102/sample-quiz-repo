import { QuestionType } from "../types";
import { selectAnswer } from "../utils/verify-answer";

export const Question = ({
   id: questionId, label, imageUrl, answers, result, setResult, endGame
}: QuestionType & {
   result: any[]; setResult: Function; endGame: boolean;
}) => {
   const answerToQuestion = result.find(res => res.questionId === questionId);
   const isCorrect = !!answerToQuestion && answerToQuestion.isCorrect !== null;

   function getButtonClass(id: number, correct: any){
      let buttonClass = "answer-btn " + (endGame ? (correct ? "correct-asw": "wrong-asw"): '');
      
      if (answerToQuestion?.answerId === id) {
         buttonClass += " selected";
      }

      return buttonClass;
   }
 
   return (
     <div className="question">
       <div style={{paddingTop: 10, paddingLeft: 10}}>
          #{questionId}
       </div>
       <div className="question-image">
          <img src={imageUrl} alt={imageUrl} />
       </div>
       <div className="question-body">
          <div className="label">{ label }</div>
          <div className="answers">
            { answers.map(({ label, id, correct }) => 
               <div>
                  <button
                     className={getButtonClass(id, correct)} 
                     key={ `answer-${ id }` }
                     onClick={() => selectAnswer(id, questionId, setResult)}
                     disabled={endGame}
                  >
                        { label }
                  </button>
               </div>
            )} 
         </div>
         { isCorrect && <div>
            Result: {answerToQuestion.isCorrect ? "Correct" : "Incorrect"}
         </div> }
      </div>
   </div>
   ) 
}