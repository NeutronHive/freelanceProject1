import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import {useParams} from 'react-router-dom'
import Subject from "./Subject";
import NewSubjectForm from "./NewSubjectForm";
import {v1 as uuid} from "uuid"; 
import "./SubjectList.css";
import { collection, addDoc, getFirestore, getDocs } from "firebase/firestore";
import firebaseConfig from "../utils/firebase.config";
import Unit from "./Unit";
const app = firebaseConfig()
const db = getFirestore(app);


async function getSubjects(subject) {
    
  const querySnapshot = await getDocs(collection(db, "topics"));
  const usersArray = [];

  querySnapshot.forEach((doc) => {
    usersArray.push({
      id: doc.id,
      data: doc.data()
    });
  });

  const farray = [];
  const s = new Set();
  for(let i=0;i<usersArray.length;i++){
    if(s.has(usersArray[i].data.id.split('-')[1]) || usersArray[i].data.id.split('-')[0]!=subject){
      continue;
    }
    farray.push(usersArray[i].data);
    s.add(usersArray[i].data.id.split('-')[1]);
  }
  return farray;
}

function UnitList(props) {
    const { subject } = useParams();
    console.log(subject);
  const [todos, setTodos] = useState([]);
  useEffect(() => {
    getSubjects(subject).then((data) => {
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
      const docRef = await addDoc(collection(db, "topics"), todos);
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
    <Unit
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
        {subject} Unit List <span>The List Of Units That You Have</span>
      </h1>
      <ul>{todosList}</ul>
      {/* <NewUnitForm createTodo={create} /> */}
    </div>
  );
}

export default UnitList;
