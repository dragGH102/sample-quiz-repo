import React, { useEffect, useState, useRef } from 'react';

import { Question } from './components/Question';

import './App.css';

import { verifyAnswers } from './utils/verify-answer';
import { Helpers } from './components/Helpers';
import { QuestionType } from './types';
import AddQuestion from './components/AddQuestion';
import { UserData } from './components/UserData';

let options = {
   credentials: 'include',
   headers: {
      "Content-Type": "application/json"
   },
} as unknown as RequestInit;

// @ts-ignore
const Results = ({ userLogged, loginData, score, setScore }): any => {

   if (score.message) {
      return (<div></div>);
   }

   return score.map((value: any) => (
      <div>
         CreatedAt: {value.createdAt}     Tot.questions: {value.totQuestions}    Score: {value.score}
      </div>
   ));

}

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
   const [answers, setAnswers] = useState([]);
   const [userData, setUserData] = useState({});
   const [loaded, setLoaded] = useState(false);
   const [error, setError] = useState<string | null>(null);
   const [userLogged, setUserLogged] = useState(false);
   const [loginData, setLoginData] = useState({ username: '', password: '' });
   const [score, setScore] = useState([]);




   console.log('App-render');

   const getResultsByUser = async (username: string) => {
      return await fetch('/results', options);
   }

   const setResults = async () => {
      let results;
      if (userLogged) {
         results = await (await getResultsByUser(loginData.username)).json();
      }
      setScore(results);
   }

   useEffect(() => {
      setResults();
   }, [userLogged]);





   useEffect(() => {
      // todo use this component structure to CREATE a question with multiple answers provided via inputs
      // (no need for an effect)
      // - set state of each input on chage
      // - use the states on form submit
      // Ideally use router to put this 'create question' as a separate page 
      // https://reactrouter.com/docs/en/v6/getting-started/tutorial

      const token = localStorage.getItem('token');



      //check token expiration by calling /expired api
      const isTokenExpired = async () => {
         return await fetch('/expired', { ...options, method: 'POST', body: JSON.stringify({ token: token }) }).then(res => res.json());
      };

      const initApp = async () => {
         const { isExpired } = await isTokenExpired();
         setUserLogged(!isExpired);
      }

      const getQuestions = async () => {
         try {
            const data = await makeApiRequest('questionsWithAnswers');

            setQuestions(data);

            return true;
         }
         catch (e) {
            return false;
         }
      };

      const getUserData = async () => {
         try {
            const data = await makeApiRequest('user/mock');

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
            const questions = getQuestions();
            if (!questions) return setError('failed getting questions');

            const userData = getUserData();
            if (!userData) return setError('failed getting user data');

            setLoaded(true);
         }
         catch (e) {
            throw new Error(`Errore getting data. Error: ${e}`);
         }
      }

      initApp()
      getAllData()


   }, []);

   const getJsonData = async (promise: Promise<any>) => {
      return (await promise).json();
   }

   /**
    * Make an API Call to backend. If the token is expired,
    * call refresh api.
    * @param route 
    * @param httpMethod 
    * @returns {Promise<any>}
    */
   const makeApiRequest = async (route: string, httpMethod?: string, body?: any) => {

      const token = JSON.stringify({ token: localStorage.getItem("token") });

      const tokenApiOptions = { ...options, method: 'POST', body: token };

      let apiOptions = { ...options };

      if (httpMethod) {
         apiOptions = { ...options, method: httpMethod };
      }

      if (body) {
         apiOptions = { ...apiOptions, body: body };
      }

      //check if token is expired
      const result: any = await getJsonData(fetch('/expired', tokenApiOptions));

      if (result.isExpired) {
         //make refresh

         const response = await getJsonData(fetch('/refresh', tokenApiOptions));

         const { token: newToken } = response;

         if (newToken) {
            //updates localstorage with new token
            localStorage.setItem("token", newToken);
         }
      }

      const response = fetch(`/${route}`, apiOptions).then(res => res.json());

      return response;
   }

   const saveResult = async (questions: any[], result: any) => {
      const data = JSON.stringify({ username: loginData.username, totQuestions: questions.length, score: result.filter((ans: { isCorrect: any; }) => ans.isCorrect).length });
      await makeApiRequest('result', 'POST', data);
   }

   const handleOperation = () => {
      setError(null);

      if (!endGame) {
         verifyAnswers(questions, setResult, setEndGame);
         saveResult(questions, result);
      } else {
         setResult([]);
         setEndGame(false);
      }
   }

   const updateLoginData = (event: { target: any; }) => {
      const element = event.target;
      setLoginData((prev) => (
         { ...prev, [element.name]: element.value }
      ));
   }

   const login = async (evt: React.FormEvent<HTMLFormElement>) => {

      evt.preventDefault();

      const { token } = await (await fetch(`/login`, { ...options, method: 'POST', body: JSON.stringify(loginData) })).json();

      if (token) {


         setUserLogged(true);


         localStorage.setItem('token', token);
      }
   };

   const logout = async () => {

      const response = await fetch(`/logout`, { ...options, method: 'POST', body: JSON.stringify(loginData) });

      if (response.ok) {
         localStorage.clear();
         setUserLogged(false);
      }
   };



   return (
      <div className="App">
         {
            !userLogged &&
            <div>
               {
                  <form onSubmit={(e) => login(e)}>
                     <input type="text" name="username" placeholder='username' value={loginData.username} onChange={updateLoginData} />
                     <br />
                     <br />
                     <input type="password" name="password" placeholder='password' value={loginData.password} onChange={updateLoginData} />
                     <br /><br />
                     <button type="submit">Login</button>
                  </form>
               }
            </div>
         }

         {

            userLogged &&
            <div>
               {
                  score &&
                  <UserData username={loginData.username} />
               }

               <br />
               <Results userLogged={userLogged} loginData={loginData} score={score} setScore={setScore} />

               <div style={{ display: 'flex', width: '200px', justifyContent: 'space-between' }}>
                  <Helpers
                     questions={questions}
                     setResult={setResult}
                  />
                  <button type="button" onClick={logout}>Logout</button>
               </div>

               <AddQuestion />

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
            </div>
         }

         <div>State: {loaded ? 'loaded' : 'not loaded'} [todo replace this with a spinner] </div>

         {error && <div>{error}</div>}

      </div>
   );
}

export default App;
