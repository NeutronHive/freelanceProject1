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
import {
	getStorage,
	ref,
	uploadBytes,
	getDownloadURL,
	deleteObject,
} from "firebase/storage";
const app = firebaseConfig();
const db = getFirestore(app);
const storage = getStorage();
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

	const deleteFileFromStorage = (filePath) => {
		const fileRef = ref(storage, filePath);
		deleteObject(fileRef)
			.then(() => {
				console.log(`File ${filePath} deleted successfully.`);
			})
			.catch((error) => {
				console.error(`Error deleting file ${filePath}:`, error);
			});
	};
    const getFilenameFromUrl = (downloadUrl) => {
        const url = new URL(downloadUrl);
        const pathSegments = url.pathname.split('/');
        return pathSegments[pathSegments.length - 1];
    };
  const handleClick = (dquestion) => {
    try {
      const orignalId = topic
      if (dquestion.image) {
        const name = getFilenameFromUrl(dquestion.image).replace('%2F','/');
        deleteFileFromStorage(name);
      }
      console.log(orignalId);
      const docRef = doc(db, "quizzes", orignalId);
      getDoc(docRef)
      .then((docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          const data2=data
          data2.questions = data.questions.filter(question => question.text !== dquestion.text);
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
  const handleLogout = () => {
    localStorage.clear();
    window.location.reload();
  };
  const buttonHoverStyle = {
    // backgroundColor: '#fc3d3d',
  };
  console.log(quizObj);
  return (
    <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-end",
      flexDirection: "column",
    }}
  >
    <button
      style={{
        position: "absolute",
        margin: "2rem",
        padding: "0.5rem 1rem",
        fontSize: "1rem",
        backgroundColor: "#ff6666",
        color: "#fff",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
        transition: "background-color 0.3s",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
      }}
      onClick={handleLogout}
    >
      Logout
    </button>
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
                      handleClick(question)
                    }}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
               {question?.image  && <img src={question?.image} alt="question image" style={{maxWidth:'400px', maxHeight:'200px'}}/>}
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
              <div style={{fontWeight:'bolder'}}>{question.details?"Details: " + question.details:""}</div>
            </div>
          );
        })}

      
			{!quizObj?.questions&& <ul style={{color:'whitesmoke'}}>No Questions Added Yet !</ul>}
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
    </div>
  );
}

export default Quiz;
