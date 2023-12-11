import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { useNavigate, useParams } from "react-router-dom";
import Subject from "./Subject";
import NewSubjectForm from "./NewSubjectForm";
import { v1 as uuid } from "uuid";
import "./SubjectList.css";
import {
  collection,
  doc,
  setDoc,
  getFirestore,
  updateDoc,
  getDoc,
  deleteDoc,
  getDocs,
} from "firebase/firestore";
import firebaseConfig from "../utils/firebase.config";
import Unit from "./Unit";
import Chapter from "./Chapter";
import NewChapterForm from "./NewChapterForm";
const app = firebaseConfig();
const db = getFirestore(app);

async function getSubjects(subject, unit) {
  const querySnapshot = await getDocs(collection(db, "topics"));
  const usersArray = [];

  querySnapshot.forEach((doc) => {
    if (
      doc.data().courseCode == subject &&
      doc.data().id.split("-")[1] == unit
    ) {
      usersArray.push({
        id: doc.id,
        data: doc.data().quizzes,
      });
    }
  });
    console.log(usersArray[0]);
  return usersArray[0].data;
}
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

const handleLogout = () => {
  localStorage.clear();
  window.location.reload();
};
function Chapters(props) {
  const navigate = useNavigate();
  const { subject, unit } = useParams();
  const [todos, setTodos] = useState([]);
  const create = (newTodo) => {
    console.log(newTodo);
    // setTodos([...todos, newTodo]);
    // window.location.reload();
  };
  useEffect(() => {
    getSubjects(subject, unit).then((data) => {
      setTodos(data);
    });
  }, [subject, unit]);

  
  const deleteFirebaseDocument = async (documentId) => {
    try {
      const docRef = doc(db, "quizzes", documentId);
      await deleteDoc(docRef);
      console.log("Document deleted successfully!");
    } catch (e) {
      console.error("Error deleting document: ", e);
    }
  };
  const deleteTopics = async (mid) => {
    try {
      const title = await getTitle(subject);
      const orignalId = `${title}-${unit}`
      const docRef = doc(db, "topics", orignalId);
      getDoc(docRef)
      .then((docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          const data2=data
          data2.quizzes = data.quizzes.filter(question => question.id !== mid);
          updateDoc(docRef, data2).then(() => {
            console.log(mid);
            const toDeleteRef = doc(db, 'quizzes', mid);
            deleteDoc(toDeleteRef).then(() => {
                console.log("Chapter successfully deleted!");
                // window.location.reload();
            });
           
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
  }
  const remove = (id) => {
    console.log(id);
    deleteTopics(id);
    setTodos(todos.filter((todo) => todo.id !== id));
  };
  const saveToFireBase = async (mdata) => {
    try {
      const title = await getTitle(subject);
      const orignalId = `${title}-${unit}`;
      const docRef = doc(db, "topics", orignalId);
      getDoc(docRef)
        .then((docSnap) => {
          if (docSnap.exists()) {
            const data=docSnap.data();
            data.quizzes=mdata;
            updateDoc(docRef, data).then(() => { 
              alert("Chapter Name successfully updated!");
              window.location.reload();
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
  const update = (id, updtedTask) => {
    const updatedTodos = todos.map((todo) => {
      if (todo.id === id) {
        return { ...todo, title: updtedTask };
      }
      return todo;
    });
    saveToFireBase(updatedTodos);
    // console.log(updatedTodos);
    setTodos(updatedTodos);
  };

  const toggleComplete = async (id,mtitle) => {
    console.log(mtitle);
    props.setTitle(mtitle)
    navigate(`/${subject}/${unit}/${id}`);
    return;
    // const updatedTodos = todos.map(todo => {
    //   if (todo.id === id) {
    //     return { ...todo, completed: !todo.completed };
    //   }
    //   return todo;
    // });
    // setTodos(updatedTodos);
  };

  const todosList = todos.map((todo) => (
    <Chapter
      toggleComplete={toggleComplete}
      update={update}
      remove={remove}
      key={todo.id}
      todo={todo}
    />
  ));

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
    <div className="TodoList">
      <h1>
        {subject} {unit} List <span>The List Of topics That You Have</span>
      </h1>
      {todos?.length != 0 && <ul>{todosList}</ul>}
			{!todos&& <ul style={{color:'whitesmoke'}}>No Chapters Added Yet !</ul>}
      {/* <NewUnitForm createTodo={create} /> */}
      <NewChapterForm createTodo={create} subject={subject} unit={unit} />
    </div>
    </div>
  );
}

export default Chapters;
