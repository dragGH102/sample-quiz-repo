import React, { useState } from 'react'

export default function AddQuestion() {

    const url = "add/question"
    const [question, setQuestion] = useState({
        label: ""
    });

    //{ label: "", question_id: null, status: false }
    const [answer, setAnswer] = useState({ label: "", question_id: null, status: false });

    const submit = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        console.log("Submit been clicked")

        const btn: HTMLButtonElement = e.target as HTMLButtonElement;

        const url = btn.id === "submitQuestion" ? "add/question" : "add/answer";

        let data;

        if (btn.id === "submitAnswer") {
            //get question id. Valid input is of type LABEL;QUESTION_ID
            //where QUESTION_ID is a valid number
            const resultArray = answer.label.split(";");
            if (resultArray && resultArray.length > 0) {
                const answerLabel = resultArray[0];
                const questionId = Number(resultArray[1]);
                data = { ...answer, label: answerLabel, question_id: questionId }
            }
        } else {
            data = { ...question };
        }

        console.log("Data.....------", data)

        fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
            .then((res) => res.json())
            .then((data) => {
                console.log("Success : ", data)
            })
            .catch((error) => {
                console.error("Error", error)
            })
    }
    const addQuestionHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newQuestion = { ...question }
        newQuestion[e.target.id] = e.target.value
        setQuestion(newQuestion)
        console.log("Added Question...", newQuestion)
    }

    const answerHandler = (e: React.ChangeEvent<HTMLInputElement>) => {

        setAnswer((oldAnswer) => {
            return { ...oldAnswer, label: e.target.value }
        })
    }

    const correctAnswerHandler = (e: React.ChangeEvent<HTMLInputElement>) => {

        setAnswer((oldAnswer) => {
            return { ...oldAnswer, status: e.target.checked }
        })
    }

    return (
        <div>
            <div className='add-question'>
                <h1>Add Questions</h1>
                <div className='question-block'>
                    <label htmlFor="question">Question</label>
                    <input id="label" name='add-question' type="text" placeholder='Write down the question please...'
                        size={50}
                        onChange={(e) => addQuestionHandler(e)}
                        value={question.label} />
                    <button id="submitQuestion" type='button' onClick={(e) => submit(e)} >Add Question</button>
                </div>
                <div>
                    <div className='answers'>
                        <label htmlFor="answers">Add answer</label>
                        <input type="text" placeholder='Please write down answer' size={50} value={answer.label} onChange={(e) => answerHandler(e)} />
                        &nbsp;&nbsp;
                        <label htmlFor="correct">Is the correct answer?</label>
                        <input type="checkbox" id="correct" checked={answer.status} onChange={(e) => correctAnswerHandler(e)} />
                        &nbsp;&nbsp;
                        <button id="submitAnswer" type='button' onClick={(e) => submit(e)}>Add Answer</button>
                    </div>
                    <div>
                        <label htmlFor="" color='blue' >Question Added: {question.label} </label>
                    </div>
                    <div>
                        <label htmlFor="">Added Answers:</label>
                    </div>
                    <div>
                        <label htmlFor="">Correct Answer:</label>
                    </div>
                    <div>
                    </div>
                </div>
            </div>
        </div>
    )
}
