import React, { useState } from 'react';

import { Question } from './components/Question';
import { QuestionType } from './types';

import './App.css';

import { questions } from './data';

const App = () => {
  const [ result, setResult ] = useState(null);

  console.log('App-render');

  return (
    <div className="App">
      { questions.map(question => <Question
        key={ `question-${ question.id }` }
        setResult={ setResult }
        { ...question }
      />) }

      { result && <div>
        Result: { result }
      </div> }
    </div>
  );
}

export default App;
