import React, { useState, useReducer } from "react";
import ReactDOM from "react-dom";
import {v1 as uuid} from "uuid"; 

import "./NewSubjectForm.css";
import "./NewSubjectForm.css";
import {
	collection,
	doc,
	setDoc,
	getFirestore,
	updateDoc,
  getDocs,
	getDoc,
} from "firebase/firestore";
// import { collection, doc, setDoc, getFirestore } from "firebase/firestore";
import firebaseConfig from "../utils/firebase.config";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
const app = firebaseConfig();
const storage = getStorage();
const db = getFirestore(app);

function NewUnitForm({ task, createTodo,subject }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isPaid, setIsPaid] = useState(false);
  const [userInput, setUserInput] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    {
      task: "",
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
  const saveToFireBase = async(data) =>{
    try {
      const docRef = doc(db, "topics", data.id);
      if (selectedFile) {
        const url = await handleFileUpload(selectedFile);
        data.image = url;
      } else {
        console.error('No file selected for upload');
      }
      await setDoc(docRef, data);
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }
  const handleSubmit = async(evt) => {
    evt.preventDefault();
    const title=await getTitle(subject); 
    const newTodo = { id: `${title}-${userInput.task}`,title: `${title}-${userInput.task}`, courseCode: subject, quizzes:[], paid:isPaid };
    saveToFireBase(newTodo)
    createTodo(newTodo);
    setUserInput({ task: "", courseCode:"" });
  };
  const handleFileUpload = async (file) => {
		try {
			const storageRef = ref(storage, "Images/" + file.name);
			const snapshot = await uploadBytes(storageRef, file);
			console.log("File uploaded successfully!");
			const downloadURL = await getDownloadURL(snapshot.ref);
			return downloadURL;
		} catch (error) {
			console.error("Error uploading file", error);
		}
	};
	const handleImageChange = (e) => {
		if (!e.target.files[0]) return;
		const customFileName = `${subject}-${uuid()}`;
		const file = e.target.files[0];
		const renamedFile = new File([file], customFileName, { type: file.type });
		setSelectedFile(renamedFile);
	};
  return (
    <form className="NewTodoForm" onSubmit={handleSubmit}>
      <label htmlFor="task">Add Unit</label>
      <input
        value={userInput.task}
        onChange={handleChange}
        id="task"
        type="text"
        name="task"
        placeholder="Unit Name/number"
      />
      	<input
				onChange={handleImageChange}
				type='file'
				style={{ background: "none" }}
				placeholder='Image for unit..'
			/>
      <label style={{fontSize:'20px', paddingLeft:'30px', display:'flex', alignItems:'center', height:'20px', marginBottom:'20px', marginTop:'-20px'}} htmlFor="isPaid">Is paid?
      <input style={{width:'15px'}} type="checkbox" value={isPaid} onChange={(e)=>{
        setIsPaid(e.target.checked);
      }} name="isPaid" id="isPaid" />
      </label>
      <button>Add</button>
    </form>
  );
}

export default NewUnitForm;
