import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import "./Subject.css";
import { collection, addDoc, getFirestore, getDocs } from "firebase/firestore";
import firebaseConfig from "../utils/firebase.config";
import { useParams } from "react-router-dom";
const app = firebaseConfig();
const db = getFirestore(app);
async function getSubjects(topic) {
  const querySnapshot = await getDocs(collection(db, "quizzes"));
  const usersArray = [];

  querySnapshot.forEach((doc) => {
    if (doc.id == topic) {
      usersArray.push({
        title: doc.data().title,
        id: doc.id,
        questions: doc.data().questions,
      });
    }
  });

  return usersArray[0];
}
function Quiz() {
  const { subject, unit, topic } = useParams();
  const [quizObj, setQuizObj] = useState({});
  useEffect(() => {
    const f = async () => {
      const data = await getSubjects(topic);
      setQuizObj(data);
    };
    f();
  });
  const handleClick = (evt) => {
    // remove(evt.target.id);
  };
  const toggleFrom = () => {
    // setIsEditing(!isEditing);
  };
  const handleUpdate = (evt) => {
    // evt.preventDefault();
    // update(todo.id, task);
    // toggleFrom();
  };
  const handleChange = (evt) => {
    // setTask(evt.target.value);
  };
  const toggleCompleted = (evt) => {
    // toggleComplete(evt.target.id);
  };
  console.log(quizObj);
  return (
    <div className="TodoList" style={{ width: "80%", maxWidth: "100%" }}>
      <h1>Question on {quizObj?.title}</h1>
      {quizObj?.questions &&
        quizObj?.questions.map((question) => {
          return (
          
                <div className="Todo`"       style={{margin:"2rem"}}>
              <li
                id={question.text}
                onClick={toggleCompleted}
              >
                {question.text}
                <div style={{height:"1rem"}}></div>
                {question?.options?.map((option)=>{

                   return option?.correct?<div className="Todo" style={{borderRadius:"20px",backgroundColor:"#23ea28"}}>{option.value}</div>:<div style={{borderRadius:"20px"}} className="Todo" >{option?.value}</div>
                })}
                
              </li>
            
            </div>
          );
        })}

      {/* <ul>{todosList}</ul> */}
      {/* <NewSubjectForm createTodo={create} /> */}
    </div>
  );
}

export default Quiz;
