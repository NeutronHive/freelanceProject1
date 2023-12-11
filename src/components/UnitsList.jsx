import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import {useNavigate, useParams} from 'react-router-dom'
import Subject from "./Subject";
import NewUnitForm from "./NewUnitForm";
import {v1 as uuid} from "uuid"; 
import "./SubjectList.css";
import { collection, addDoc, getFirestore, getDocs ,doc,deleteDoc,where,query} from "firebase/firestore";
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
    // console.log(usersArray[i].data.id);
    if(usersArray[i].data.courseCode!=subject){
      continue;
    }
    farray.push(usersArray[i].data);
  }
  return farray;
}

function UnitList(props) {
    const navigate=useNavigate();
    const { subject } = useParams();
    console.log(subject);
  const [todos, setTodos] = useState([]);
  useEffect(() => {
    getSubjects(subject).then((data) => {
      setTodos(data);
    });
  }, []); 
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
  const create = newTodo => {
    console.log(newTodo);
    setTodos([...todos, newTodo]);
  };
  const deleteTopics = async (mid) => {
    try {
      const unit=mid.split('-')[1]
      const title= await getTitle(subject);
      const orignalId = `${title}-${unit}`
      const docRef = doc(db, "topics", orignalId);
      deleteDoc(docRef)
      .then(() => {
        

        getDocs(collection(db, "quizzes"))
          .then((querySnapshot) => {
            const deletePromises = [];
            
            querySnapshot.forEach((doc) => {
              if(doc.id.includes(orignalId)){
              const deletePromise = deleteDoc(doc.ref);
              deletePromises.push(deletePromise);
              }
            });
        
            // Wait for all delete promises to complete
            return Promise.all(deletePromises);
          })
          .then(() => {
            alert('Unit successfully deleted!');
           
          })
          .catch((error) => {
            console.error('Error deleting documents:', error);
          });
        
           
            });
          //  window.location.reload();
        } 
     
      //   await setDoc(docRef, data);
      //   console.log("Document written with ID: ", docRef.id);
    catch (e) {
      console.error("Error adding document: ", e);
    }
  }
  const remove = id => {
    deleteTopics(id)
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
    navigate(`/${subject}/${id.split('-')[1]}`)
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
      <NewUnitForm createTodo={create} subject={subject} />
    </div>
  );
}

export default UnitList;
