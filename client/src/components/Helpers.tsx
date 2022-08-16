import { useState } from "react";

import { QuestionType } from "../types";

export const Helpers = ({ questions, setResult }: {
    questions: QuestionType[];
    setResult: Function;
}) => {
    const [activeOperation, setActiveOperation] = useState(false);
    const [inputValue, setInputValue] = useState(1);

    const confirmOperation = () => {
        // find the question with id equal to inputValue
        const question = questions.find(question => question.id === Number(inputValue));
        
        if(!question) return;
        
        // find not correct answers
        if(question.answers.length > 2){
            const numberOfAnswersToRemove = Math.floor(question.answers.length / 2);
            let count = 0;
            for(let i=0;i<question.answers.length;i++){

                if(count === numberOfAnswersToRemove) { break; }
                if(!question.answers[i].correct){
                    question.answers[i].remove = true;
                    count++;
                }
            }

            const removedAnswers = question.answers.filter(q => q.remove);

            setResult((prevResult: any[]) => {
                question.answers = question.answers.filter(q => !q.remove);
                let newResult = prevResult.map(value => {
                    return (value.questionId === question.id && removedAnswers.find(asw => asw.id === value.answerId)) ? {...value, answerId: null} : {...value};
                })
                return newResult.filter(res => res.answerId);
            })
            

        }

    }

    const onValueChange = (ev: any) => {
        setInputValue(ev.target.value);
    }

    return (
       <div className="helpers">
          <button type="button" className="helper-btn" onClick={() => setActiveOperation((active) => !active)}>50:50</button>
          {
            activeOperation &&
             <div>
                <label>Which question?</label>
                <input type="number" value={inputValue} onChange={onValueChange}></input>
                <button type="button" className="confirm-btn" onClick={() => confirmOperation()} disabled={!inputValue}>Confirm</button>
             </div>
            }
       </div>
    )
}