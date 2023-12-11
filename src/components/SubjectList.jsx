import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import Subject from "./Subject";
import NewSubjectForm from "./NewSubjectForm";
import { v1 as uuid } from "uuid";
import "./SubjectList.css";
import {
  collection,
  updateDoc,
  getFirestore,
  getDocs,
  doc,
  deleteDoc,
} from "firebase/firestore";
import firebaseConfig from "../utils/firebase.config";
import { useNavigate } from "react-router-dom";
const app = firebaseConfig();
const db = getFirestore(app);

async function getSubjects() {
  const querySnapshot = await getDocs(collection(db, "courses"));
  const usersArray = [];

  querySnapshot.forEach((doc) => {
    usersArray.push({
      id: doc.id,
      data: doc.data(),
    });
  });
  // console.log(usersArray);
  // const farray = [];
  // const s = new Set();
  // for(let i=0;i<usersArray.length;i++){
  //   if(s.has(usersArray[i].data.id.split('-')[0])){
  //     continue;
  //   }
  //   farray.push(usersArray[i].data);
  //   s.add(usersArray[i].data.id.split('-')[0]);
  // }
  console.log(usersArray);
  return usersArray;
}

function TodoList({ user, setUser, setUserF }) {
  const navigate = useNavigate();
  const [todos, setTodos] = useState([]);
  const create = (newTodo) => {
    if (todos.some((todo) => todo === newTodo)) {
      console.log("Todo already exists!");
    } else {
      console.log(newTodo);
      setTodos([...todos, newTodo]);
    }
  };
  useEffect(() => {
    getSubjects().then((data) => {
      setTodos(data);
    });
  }, []);
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
  const deleteTopics = async (mid, subject) => {
    try {
      const unit = mid.split("-")[1];
      const title = await getTitle(subject);
      const orignalId = `${title}-${unit}`;
      const docRef = doc(db, "topics", orignalId);
      deleteDoc(docRef).then(() => {
        getDocs(collection(db, "quizzes"))
          .then((querySnapshot) => {
            const deletePromises = [];

            querySnapshot.forEach((doc) => {
              if (doc.id.includes(orignalId)) {
                const deletePromise = deleteDoc(doc.ref);
                deletePromises.push(deletePromise);
              }
            });

            // Wait for all delete promises to complete
            return Promise.all(deletePromises);
          })
          .then(() => {
            console.log("Unit successfully deleted!");
          })
          .catch((error) => {
            console.error("Error deleting documents:", error);
          });
      });
      //  window.location.reload();
    } catch (e) {
      //   await setDoc(docRef, data);
      //   console.log("Document written with ID: ", docRef.id);
      console.error("Error adding document: ", e);
    }
  };
  const deleteUnit = async (mid) => {
    try {
      const querySnapshot = await getDocs(collection(db, "topics"));
      const deletePromises = [];

      querySnapshot.forEach((doc) => {
        if (doc.data().courseCode === mid) {
          deletePromises.push(deleteTopics(doc.id, mid));
        }
      });

      await Promise.all(deletePromises);

      // Now, you can delete the unit or perform other operations if needed.
      // For example, you might want to delete the unit itself:
      // await deleteDoc(doc(db, "units", mid));

      console.log("Topics deleted successfully.");
    } catch (e) {
      console.error("Error deleting topics: ", e);
    }
  };

  const deleteFirebaseDocument = async (documentId) => {
    try {
      const docRef = doc(db, "courses", documentId);
      await deleteDoc(docRef);
      alert("Subje deleted successfully!");
    } catch (e) {
      console.error("Error deleting document: ", e);
    }
  };

  const remove = async (id, x) => {
    const flag = window.confirm(
      "Are you sure you want to delete this subject?"
    );
    if (!flag) {
      return;
    }
    setTodos(todos.filter((todo) => todo.id !== id));
    await deleteUnit(x);
    await deleteFirebaseDocument(id);
  };

  const updateFirebaseDocument = async (orignalId, data) => {
    try {
      const docRef = doc(db, "topics", orignalId);
      await updateDoc(docRef, data);
      console.log("Document updated successfully!");
    } catch (e) {
      console.error("Error updating document: ", e);
    }
  };

  const update = async (id, updatedTask) => {
    let newTask, orignalId;
    const updatedTodos = todos.map((todo) => {
      if (todo.id === id) {
        orignalId = todo.id;
        newTask = { ...todo, id: updatedTask };
        return newTask;
      }
      return todo;
    });
    await updateFirebaseDocument(orignalId, newTask);
    setTodos(updatedTodos);
  };

  const toggleComplete = async (id) => {
    navigate(`/${id}`);
    return;
  };

  const todosList = todos.map((todo) => (
    <Subject
      toggleComplete={toggleComplete}
      update={update}
      remove={remove}
      key={todo.id}
      todo={todo}
    />
  ));
  const handleLogout = () => {
    localStorage.clear();
    window.location.reload();
  };
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
          Subject List <span>The List Of Subjects That You Have</span>
        </h1>
        <ul>{todosList}</ul>
        <NewSubjectForm createTodo={create} />
      </div>
    </div>
  );
}

export default TodoList;
