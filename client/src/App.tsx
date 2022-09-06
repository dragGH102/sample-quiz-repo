import React, { useEffect, useState } from 'react';

import { Question } from './components/Question';

import './App.css';

import { verifyAnswers } from './utils/verify-answer';
import { Helpers } from './components/Helpers';
import { QuestionType } from './types';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const QuestionList = ({ questions, result, setResult, endGame }): any => questions.map((question: QuestionType) => (
   <div>
      <Question
         {...question}
         key={`question-${question.id}`}
         result={result}
         setResult={setResult}
         endGame={endGame}
      />
   </div>
));

const App = () => {
   const [result, setResult] = useState([]);
   const [endGame, setEndGame] = useState(false);
   const [questions, setQuestions] = useState([]);
   const [userData, setUserData] = useState({});
   const [loaded, setLoaded] = useState(false);
   const [error, setError] = useState<string | null>(null);

   console.log('App-render');

   useEffect(() => {
      // todo use this component structure to CREATE a question with multiple answers provided via inputs
      // (no need for an effect)
      // - set state of each input on chage
      // - use the states on form submit
      // Ideally use router to put this 'create question' as a separate page 
      // https://reactrouter.com/docs/en/v6/getting-started/tutorial

      const baseUrl = 'http://127.0.0.1:3001';

      const fetchData = async (route: string) => {
         const res = await fetch(`${baseUrl}/${route}`);

         const resJson = await res.json();

         return resJson;
      }

      const getQuestions = async () => {
         try {
            const data = await fetchData('questionsWithAnswers');

            setQuestions(data);

            return true;
         }
         catch (e) {
            return false;
         }
      };

      const getUserData = async () => {
         // todo task 1: complete this
         try {
            const data = await fetchData('user/mock');

            setUserData(data);

            return true;
         } catch (e) {
            return false;
         }

         // todo (when app is more complex) task 3(together with task 4@components/UserData.ts): aside of setUserData, store the user data in the AppReducer
         // TIP: dispatch(setUserData)
         // setUserData is the action
         // userData: a property of the INITIAL state of the reducer (which will initially = null)
      };

      const getAllData = async () => {
         try {
            const questions = await getQuestions();
            if (!questions) return setError('failed getting questions');

            const userData = await getUserData();
            if (!userData) return setError('failed getting user data');

            setLoaded(true);
         }
         catch (e) {
            throw new Error(`Errore getting data. Error: ${e}`);
         }
      }

      getAllData()
   }, []);



   const handleOperation = () => {
      setError(null);

      if (!endGame) {
         verifyAnswers(questions, setResult, setEndGame);
      } else {
         setResult([]);
         setEndGame(false);
      }
   }

   return (
      <div className="App">
         {/* <UserData /> */}

         { /* TODO here 'add question' component */}

         <Helpers
            questions={questions}
            setResult={setResult}
         />

         <QuestionList
            questions={questions}
            result={result}
            setResult={setResult}
            endGame={endGame}
         />

         <div className="quiz-result">
            {
               endGame &&
               <div>
                  You scored {result.filter((value: any) => value.isCorrect).length}/{questions.length}
                  &nbsp;correct answers
               </div>
            }
            <button type='button' className="verify-answers-btn" onClick={() => handleOperation()} disabled={result.length < questions.length}>
               {endGame ? "Start new game" : "Check answers"}
            </button>
         </div>

         <div>State: {loaded ? 'loaded' : 'not loaded'} [todo replace this with a spinner] </div>

         {error && <div>{error}</div>}
      </div>
   );
}

export default App;
