import React, { useState, useReducer } from "react";
import ReactDOM from "react-dom";
import { v1 as uuid } from "uuid";
import "./NewSubjectForm.css";
import {
  collection,
  doc,
  setDoc,
  getFirestore,
  updateDoc,
  getDocs,
  getDoc,
} from "firebase/firestore";
import firebaseConfig from "../utils/firebase.config";
const app = firebaseConfig();
const db = getFirestore(app);

function NewChapterForm({ createTodo, subject, unit }) {
  const [userInput, setUserInput] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    {
      description: "",
      title: "",
    }
  );
  const handleChange = (evt) => {
    setUserInput({ [evt.target.name]: evt.target.value });
  };
  const saveToFireBaseQuizes = async (data) => {
    try {
      const docRef = doc(db, "quizzes", data.id);
      await setDoc(docRef, data);
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };
  async function getTitle(subject) {
    const querySnapshot = await getDocs(collection(db, "courses"));
    const usersArray = [];

    querySnapshot.forEach((doc) => {
      usersArray.push({
        id: doc.id,
        data: doc.data(),
      });
    });

    const farray = [];
    for (let i = 0; i < usersArray.length; i++) {
      // console.log(usersArray[i].data.id);
      if (usersArray[i].data.courseCode != subject) {
        continue;
      }
      farray.push(usersArray[i].data);
    }
    // console.log(farray);
    return farray[0].title;
  }
  const saveToFireBase = async (data) => {
    try {
      const title = await getTitle(subject);
      const orignalId = `${title}-${unit}`;
      console.log(orignalId);
      const docRef = doc(db, "topics", orignalId);
      getDoc(docRef)
        .then((docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            const firstWord = userInput.title.split(" ").join("-");
            const word = orignalId + "-" + firstWord;
            console.log({
              title: userInput.title,
              description: userInput.description,
              id: word,
            });
            data.quizzes.push({
              title: userInput.title,
              description: userInput.description,
              id: word,
              notes: [],
            });
            updateDoc(docRef, data).then(() => {
              console.log("Document successfully updated!");
              window.location.reload();
            });

            const data2 = {
              title: userInput.title,
              topic: userInput.title,
              description: userInput.description,
              id: word,
              questions: [],
            };
            saveToFireBaseQuizes(data2).then(() => {
              console.log("Document successfully updated!");
            });
          } else {
            console.log("No such document!");
          }
        })
        .catch((error) => {
          console.error("Error getting document:", error);
        });
      //   await setDoc(docRef, data);
      //   console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };
  const handleSubmit = (evt) => {
    evt.preventDefault();
    const newTodo = {
      id: userInput.task,
      courseCode: userInput.courseCode,
      quizzes: [],
    };
    saveToFireBase(newTodo);
    createTodo(newTodo);
    setUserInput({ title: "", description: "" });
  };

  return (
    <form className="NewTodoForm" onSubmit={handleSubmit}>
      <label htmlFor="task">Add Chapter</label>
      <input
        value={userInput.title}
        onChange={handleChange}
        id="title"
        type="text"
        name="title"
        placeholder="Chapter title"
      />
      <input
        value={userInput.description}
        onChange={handleChange}
        id="description"
        type="text"
        name="description"
        placeholder="Chapter Description"
      />
      <button>Add</button>
    </form>
  );
}

export default NewChapterForm;
