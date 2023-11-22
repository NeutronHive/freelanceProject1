import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import Subject from "./Subject";
import NewSubjectForm from "./NewSubjectForm";
import {v1 as uuid} from "uuid"; 
import "./SubjectList.css";
import { collection, addDoc, getFirestore, getDocs } from "firebase/firestore";
import firebaseConfig from "../utils/firebase.config";
const app = firebaseConfig()
const db = getFirestore(app);


async function getSubjects() {
  const querySnapshot = await getDocs(collection(db, "subjects"));
  const usersArray = [];

  querySnapshot.forEach((doc) => {
    usersArray.push({
      id: doc.id,
      data: doc.data()
    });
  });

  const farray = [];
  for(let i=0;i<usersArray.length;i++){
    farray.push(usersArray[i].data);
  }
  return farray;
}

function TodoList() {
  const [todos, setTodos] = useState([]);
  useEffect(() => {
    getSubjects().then((data) => {
      setTodos(data);
    });
  }, []); 

  const create = newTodo => {
    console.log(newTodo);
    setTodos([...todos, newTodo]);
  };

  const remove = id => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const update = (id, updtedTask) => {
    const updatedTodos = todos.map(todo => {
      if (todo.id === id) {
        return { ...todo, task: updtedTask };
      }
      return todo;
    });
    setTodos(updatedTodos);
  };

  const toggleComplete = async(id) => {
    try {
      const docRef = await addDoc(collection(db, "subjects"), todos);
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
    return
    // const updatedTodos = todos.map(todo => {
    //   if (todo.id === id) {
    //     return { ...todo, completed: !todo.completed };
    //   }
    //   return todo;
    // });
    // setTodos(updatedTodos);
  };

  const todosList = todos.map(todo => (
    <Subject
      toggleComplete={toggleComplete}
      update={update}
      remove={remove}
      key={todo.id}
      todo={todo}
    />
  ));

  return (
    <div className="TodoList">
      <h1>
        Subject List <span>The List Of Subjects That You Have</span>
      </h1>
      <ul>{todosList}</ul>
      <NewSubjectForm createTodo={create} />
    </div>
  );
}

export default TodoList;
