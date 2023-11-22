import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import Subject from "./Subject";
import NewSubjectForm from "./NewSubjectForm";
import {v1 as uuid} from "uuid"; 
import "./SubjectList.css";
import { collection, updateDoc, getFirestore, getDocs, doc, deleteDoc } from "firebase/firestore";
import firebaseConfig from "../utils/firebase.config";
import { useNavigate } from "react-router-dom";
const app = firebaseConfig()
const db = getFirestore(app);


async function getSubjects() {
  const querySnapshot = await getDocs(collection(db, "topics"));
  const usersArray = [];

  querySnapshot.forEach((doc) => {
    usersArray.push({
      id: doc.id,
      data: doc.data()
    });
  });
  console.log(usersArray);
  const farray = [];
  const s = new Set();
  for(let i=0;i<usersArray.length;i++){
    if(s.has(usersArray[i].data.id.split('-')[0])){
      continue;
    }
    farray.push(usersArray[i].data);
    s.add(usersArray[i].data.id.split('-')[0]);
  }
  return farray;
}

function TodoList() {
  const navigate=useNavigate();
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
  const deleteFirebaseDocument = async (documentId) => {
    try {
      const docRef = doc(db, "topics", documentId);
      await deleteDoc(docRef);
      console.log("Document deleted successfully!");
    } catch (e) {
      console.error("Error deleting document: ", e);
    }
  };
  
  const remove = id => {
    setTodos(todos.filter(todo => todo.id !== id));
    deleteFirebaseDocument(id);
  };

  const updateFirebaseDocument = async (orignalId,data) => {
    try {
      const docRef = doc(db, "topics", orignalId);
      await updateDoc(docRef, data);
      console.log("Document updated successfully!");
    } catch (e) {
      console.error("Error updating document: ", e);
    }
  };


  const update = async(id, updatedTask) => {
    let newTask, orignalId;
    const updatedTodos = todos.map(todo => {
      if (todo.id === id) {
        orignalId = todo.id;
        newTask = { ...todo, id: updatedTask };
        return newTask;
      }
      return todo;
    });
    await updateFirebaseDocument(orignalId,newTask);
    setTodos(updatedTodos);
  };

  const toggleComplete = async(id) => {
    navigate(`/${id.split('-')[0]}`)
    return
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
