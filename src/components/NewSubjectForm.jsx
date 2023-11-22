import React, { useState, useReducer } from "react";
import ReactDOM from "react-dom";
import {v1 as uuid} from "uuid"; 
import "./NewSubjectForm.css";
import { collection, addDoc, getFirestore } from "firebase/firestore";
import firebaseConfig from "../utils/firebase.config";
const app = firebaseConfig()
const db = getFirestore(app);

function NewSubjectForm({ task, createTodo }) {
  const [userInput, setUserInput] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    {
      task: ""
    }
  );

  const handleChange = evt => {
    setUserInput({ [evt.target.name]: evt.target.value });
  };

  const saveToFireBase = async(data) =>{
    try {
      const docRef = await addDoc(collection(db, "subjects"), data);
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }
  const handleSubmit = evt => {
    evt.preventDefault();
    const newTodo = { id: uuid(), task: userInput.task };
    saveToFireBase(newTodo)
    createTodo(newTodo);
    setUserInput({ task: "" });
  };

  return (
    <form className="NewTodoForm" onSubmit={handleSubmit}>
      <label htmlFor="task">Add Subject</label>
      <input
        value={userInput.task}
        onChange={handleChange}
        id="task"
        type="text"
        name="task"
        placeholder="Subject Name"
      />
      <button>Add</button>
    </form>
  );
}

export default NewSubjectForm;
