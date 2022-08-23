import React, { useEffect, useState } from 'react';

import { Question } from './components/Question';

import './App.css';

import { verifyAnswers } from './utils/verify-answer';
import { Helpers } from './components/Helpers';
import { QuestionType } from './types';
import { UserData } from './components/UserData';

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
   // todo use this component structure to CREATE a question with multiple answers provided via inputs
   // (no need for an effect)
   // - set state of each input on chage
   // - use the states on form submit
   // Ideally use router to put this 'create question' as a separate page 
   // https://reactrouter.com/docs/en/v6/getting-started/tutorial

   const getQuestions = async () => {
      try {
         const res = await fetch('http://127.0.0.1:3001/questions');
         const resJson = await res.json();

         setQuestions(resJson);

         return 'done';
      }
      catch(e) {
         console.log(e);
      }
   };

   const getUserData = async () => {
      // todo task 1: complete this

      // todo (when app is more complex) task 3(together with task 4@components/UserData.ts): aside of setUserData, store the user data in the AppReducer
      // TIP: dispatch(setUserData)
      // setUserData is the action
      // userData: a property of the INITIAL state of the reducer (which will initially = null)
   };

   getQuestions()
      .then(() => setLoaded(true));

      // todo task 2: set loaded when both user data and questions and fetched
      // TIP:
      // - create async getAllData()
      // - call getQuestions and getUserData with await from within
      // - finally set loaded true
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
      {/* <UserData /> */}

      { /* TODO here 'add question' component */ }
      
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
