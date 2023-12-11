import React, { useState, useReducer } from "react";
import ReactDOM from "react-dom";
import {v1 as uuid} from "uuid"; 
import "./NewSubjectForm.css";
import { collection, doc, setDoc,getDocs, getFirestore, getDoc, updateDoc } from "firebase/firestore";
import firebaseConfig from "../utils/firebase.config";
import { useParams } from "react-router";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
const storage = getStorage();
const app = firebaseConfig()
const db = getFirestore(app);

function NewNoteForm({ task, createTodo, subject, unit, topic }) {
    // const {subject, unit, topic} = useParams();    
    const [selectedFile, setSelectedFile] = useState(null);
  const [userInput, setUserInput] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    {
      name: "",
      url:""
    }
  );

  const handleChange = evt => {
    setUserInput({ [evt.target.name]: evt.target.value });
  };
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
  const saveToFireBase = async (mdata) => {
    try {
        const title= await getTitle(subject);
        const orignalId = `${title}-${unit}`;
        console.log(orignalId);
        const docRef = doc(db, "topics", orignalId);
        getDoc(docRef)
            .then((docSnap) => {
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    data?.quizzes?.map((quiz) => {
                        if (quiz.id == topic) {
                            quiz.notes.push(mdata);
                        }
                    });
                    updateDoc(docRef, data).then(() => {
                        alert("Notes successfully added!");
                        window.location.reload(true);
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
  const handleSubmit = async(evt) => {
    evt.preventDefault();
    const newTodo = { name: userInput.name, url:null};
    if(selectedFile){
        const url = await handleFileUpload(selectedFile);
        newTodo.url = url;
    }
    saveToFireBase(newTodo)
    createTodo(newTodo);
    setUserInput({ name: "", url:"" });
  };
  const handelImageChange = (e) => {
    if(!e.target.files[0]) return;
    const customFileName = `${topic}-notes-${uuid()}`;
	const file = e.target.files[0];
    const renamedFile = new File([file], customFileName, { type: file.type });
		setSelectedFile(renamedFile);
	};
    const handleFileUpload = async (file) => {
		try {
			const storageRef = ref(storage, "Notes/" + file.name);
			const snapshot = await uploadBytes(storageRef, file);
			console.log("File uploaded successfully!");
			const downloadURL = await getDownloadURL(snapshot.ref);
            return downloadURL;
		} catch (error) {
			console.error("Error uploading file", error);
		}
	};
  return (
    <form className="NewTodoForm" onSubmit={handleSubmit}>
      <label htmlFor="task">Add Notes</label>
      <input
        value={userInput.name}
        onChange={handleChange}
        id="task"
        type="text"
        name="name"
        placeholder="Name"
      />
      <input style={{backgroundColor:'transparent'}}
        onChange={handelImageChange}
        id="url"
        type="file"
        name="url"
        // placeholder="url Name"
      />
      <button>Add</button>
    </form>
  );
}

export default NewNoteForm;
