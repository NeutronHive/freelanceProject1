import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import {useNavigate, useParams} from 'react-router-dom'
import Subject from "./Subject";
import NewSubjectForm from "./NewSubjectForm";
import {v1 as uuid} from "uuid"; 
import "./SubjectList.css";
import { collection, addDoc, getFirestore, getDocs } from "firebase/firestore";
import firebaseConfig from "../utils/firebase.config";
import Unit from "./Unit";
import Chapter from "./Chapter";
const app = firebaseConfig()
const db = getFirestore(app);


async function getSubjects(subject,unit) {
    
  const querySnapshot = await getDocs(collection(db, "topics"));
  const usersArray = [];
  
  querySnapshot.forEach((doc) => {
    if(doc.data().id.split('-')[0]==subject && doc.data().id.split('-')[1]==unit){
    usersArray.push({
      id: doc.id,
      data: doc.data().quizzes
    });
}   
  });
//   console.log(usersArray[0].data);
  return usersArray[0].data;
}

function Chapters(props) {
    const navigate=useNavigate();
    const {subject, unit } = useParams();
    console.log(unit);
  const [todos, setTodos] = useState([]);
  useEffect(() => {
    getSubjects(subject,unit).then((data) => {
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
    navigate(`/${subject}/${unit}/${id}`)
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
    <Chapter
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
        {subject} {unit} List <span>The List Of topics That You Have</span>
      </h1>
      <ul>{todosList}</ul>
      {/* <NewUnitForm createTodo={create} /> */}
    </div>
  );
}

export default Chapters;
