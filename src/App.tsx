import React, { useState } from 'react';

import { Question } from './components/Question';

import './App.css';

import { questions } from './data';

const App = () => {

  const answersToQuestions = questions.map((question) => ({questionId: question.id, answerId: null, isCorrect: false }));

  const [ result, setResult ] = useState(answersToQuestions);

  console.log('App-render');


  const questionsComponents = questions.map(question =>
     <Question
         key={ `question-${ question.id }` }
         setResult={ setResult }
         { ...question }
    />
  );

  return (
    <div className="App">
      { questionsComponents }
      <div>You scored  {result.filter(value => value.isCorrect).length}/{questions.length} correct answers</div>
    </div>
  );
}

export default App;
