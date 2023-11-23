import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import "./Subject.css";
import {
  collection,
  doc,
  setDoc,
  getFirestore,
  updateDoc,
  getDoc,
  getDocs
} from "firebase/firestore";
import firebaseConfig from "../utils/firebase.config";
import { useParams } from "react-router-dom";
import NewQuizForm from "./NewQuizForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
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
function Quiz(title) {
  const { subject, unit, topic } = useParams();
  console.log("topic",title)
  const [quizObj, setQuizObj] = useState({});
  useEffect(() => {
    const f = async () => {
      const data = await getSubjects(topic);
      setQuizObj(data);
    };
    f();
  }, []);
  const [isFormVisible, setFormVisibility] = useState(false);

  const handleAddButtonClick = () => {
    setFormVisibility(!isFormVisible);
  };
  const handleClick = (text) => {
    try {
      const orignalId = topic
      console.log(text);
      console.log(orignalId);
      const docRef = doc(db, "quizzes", orignalId);
      getDoc(docRef)
      .then((docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          const data2=data
          data2.questions = data.questions.filter(question => question.text !== text);
          updateDoc(docRef, data2).then(() => {
            alert("Question successfully deleted!");
            window.location.reload(true);
            });
          //  window.location.reload();
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
  const buttonStyle = {
    borderRadius: "20px",
    padding: "1rem 1.3rem",
    border: "none",
    // backgroundColor: '#fc3d3d',
    backgroundColor: "#ff6666",
    color: "white",
    textTransform: "uppercase",
    fontWeight: "bold",
    border: "1px solid rgba(255, 255, 255, 0.3)",
    marginLeft: "5px",
    marginTop: "2rem", 
    cursor: "pointer",
    transition: "background 0.2s ease-out",
  };

  const buttonHoverStyle = {
    // backgroundColor: '#fc3d3d',
  };
  console.log(quizObj);
  return (
    <div className="TodoList" style={{ width: "80%", maxWidth: "100%" }}>
      <h1>Question on {quizObj?.title}</h1>
      {quizObj?.questions &&
        quizObj?.questions.map((question,index) => {
          return (
            <div className="Todo`" style={{ margin: "2rem" }}>
              <div id={question.text} onClick={toggleCompleted}>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <li style={{ listStyleType: 'disc'}}>{question.text}</li>
                  <button
                    style={{ fontSize: "1rem",backgroundColor:"transparent",border:"none",cursor:"pointer" }}
                    onClick={() => {
                      handleClick(question.text)
                    }}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
                <div style={{ height: "1rem" }}></div>
                {question?.options?.map((option) => {
                  return option?.correct ? (
                    <div
                      className="Todo"
                      style={{
                        borderRadius: "20px",
                        backgroundColor: "#23ea28",
                      }}
                    >
                      {option.value}
                    </div>
                  ) : (
                    <div style={{ borderRadius: "20px" }} className="Todo">
                      {option?.value}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

      {/* <ul>{todosList}</ul> */}
      <div>
        <button
          style={buttonStyle}
          onMouseOver={() => Object.assign(buttonStyle, buttonHoverStyle)}
          onClick={handleAddButtonClick}
        >
          Add Question
        </button>
        {isFormVisible && <NewQuizForm topic={topic} />}
      </div>
    </div>
  );
}

export default Quiz;
