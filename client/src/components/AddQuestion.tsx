import React, { useState } from 'react'

export default function AddQuestion() {

    const url = "http://localhost:3001/add/questions"
    const [question, setQuestion] = useState({
        label: ""
    });

    const submit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault()
        console.log("Submit been clicked")
        const data = { ...question }
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
                    <button type='button' onClick={submit} >Add Question</button>
                </div>
                <div>
                    <div className='answers'>
                        <label htmlFor="answers">Add answer</label>
                        <input type="text" placeholder='Please write down answers' size={50} />
                        <button>Add Answer</button>
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
