import React, { useState, useReducer } from "react";
import ReactDOM from "react-dom";
import {v1 as uuid} from "uuid"; 

import "./NewSubjectForm.css";
import { collection, doc,getDocs, setDoc, getFirestore } from "firebase/firestore";
import firebaseConfig from "../utils/firebase.config";
const app = firebaseConfig()
const db = getFirestore(app);

function NewUnitForm({ task, createTodo,subject }) {
  const [userInput, setUserInput] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    {
      task: "",
    }
  );

  const handleChange = evt => {
    setUserInput({ [evt.target.name]: evt.target.value });
  };
  async function getTitle(subject) {
  
    const querySnapshot = await getDocs(collection(db, "courses"));
    const usersArray = [];
  
    querySnapshot.forEach((doc) => {
      usersArray.push({
        id: doc.id,
        data: doc.data()
      });
    });
  
    const farray = [];
    for(let i=0;i<usersArray.length;i++){
      // console.log(usersArray[i].data.id);
      if(usersArray[i].data.courseCode!=subject){
        continue;
      }
      farray.push(usersArray[i].data);
    }
    // console.log(farray);
    return farray[0].title;
  }
  const saveToFireBase = async(data) =>{
    try {
      const docRef = doc(db, "topics", data.id);
      await setDoc(docRef, data);
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }
  const handleSubmit = async(evt) => {
    evt.preventDefault();
    const title=await getTitle(subject); 
    const newTodo = { id: `${title}-${userInput.task}`,title: `${title}-${userInput.task}`, courseCode: subject, quizzes:[] };
    saveToFireBase(newTodo)
    createTodo(newTodo);
    setUserInput({ task: "", courseCode:"" });
  };
  
  return (
    <form className="NewTodoForm" onSubmit={handleSubmit}>
      <label htmlFor="task">Add Unit</label>
      <input
        value={userInput.task}
        onChange={handleChange}
        id="task"
        type="text"
        name="task"
        placeholder="Unit Name/number"
      />
      <button>Add</button>
    </form>
  );
}

export default NewUnitForm;
