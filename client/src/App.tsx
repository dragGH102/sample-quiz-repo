import React, { useEffect, useState } from 'react';

import { Question } from './components/Question';

import './App.css';

import { verifyAnswers } from './utils/verify-answer';
import { Helpers } from './components/Helpers';
import { QuestionType } from './types';

// @ts-ignore
const QuestionList = ({ questions, result, setResult, endGame }) => questions.map((question: QuestionType) => (
   <div>
    <Question
       key={ `question-${ question.id }` }
       result={ result }
       setResult={ setResult }
       endGame={endGame}
       { ...question }
    />
  </div> 
));

const App = () => {
  const [ result, setResult ] = useState([]);
  const [ endGame, setEndGame ] = useState(false);
  const [ questions, setQuestions ] = useState([]);
  const [ loaded, setLoaded ] = useState(false);

  console.log('App-render');
  console.log(result);

  useEffect(() => {
   const getQuestions = async () => {
      const res = await fetch('http://127.0.0.1:3001/questions');
      const resJson = await res.json();

      setQuestions(resJson);

      return 'done';
   };

   getQuestions()
      .then(() => setLoaded(true));
  }, []);

  const handleOperation = () => {
     if(!endGame){
        verifyAnswers(questions, setResult, setEndGame);
     } else {
        setResult([]);
        setEndGame(false);
     }
  }

  return (
    <div className="App">
      <Helpers
         questions={ questions} 
         setResult={ setResult }
      />
      
      <QuestionList
         questions={ questions }
         result={ result }
         setResult={ setResult }
         endGame={endGame}
      />

      <div className="quiz-result">
         { endGame && <div>You scored  {result.filter((value: any) => value.isCorrect).length}/{questions.length} correct answers</div> }
         <button type='button' className="verify-answers-btn" onClick={() => handleOperation()} disabled={result.length < questions.length}>
          { endGame ? "Start new game": "Check answers"}
         </button>
      </div>
      
      <div>State: { loaded ? 'loaded' : 'not loaded' } [todo replace this with a spinner] </div>
    </div>
  );
}

export default App;
