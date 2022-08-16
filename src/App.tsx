import React, { useState } from 'react';

import { Question } from './components/Question';

import './App.css';

import { questions } from './data';
import { verifyAnswers } from './utils/verify-answer';
import { Helpers } from './components/Helpers';

const App = () => {

  const [ result, setResult ] = useState([]);

  const [ endGame, setEndGame ] = useState(false);

  console.log('App-render');
  console.log(result);

  questions.forEach(q => console.log('qqqqq', `question-${ q.id }`));

  const questionsComponents = questions.map(question =>
     <Question
         key={ `question-${ question.id }` }
         result={ result }
         setResult={ setResult }
         endGame={endGame}
         { ...question }
    /> 
  );

  const handleOperation = () => {
     if(!endGame){
        verifyAnswers(setResult, setEndGame);
     } else {
        setResult([]);
        setEndGame(false);
     }
  }

  return (
    <div className="App">
      <Helpers setResult={setResult}/>
      { questionsComponents }
      <div className="quiz-result">
         { endGame && <div>You scored  {result.filter((value: any) => value.isCorrect).length}/{questions.length} correct answers</div> }
         <button type='button' className="verify-answers-btn" onClick={() => handleOperation()} disabled={result.length < questions.length}>
          { endGame ? "Start new game": "Check answers"}
         </button>
      </div>
      
      
    </div>
  );
}

export default App;
