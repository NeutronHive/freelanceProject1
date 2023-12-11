import React, { useState, useReducer } from "react";
import ReactDOM from "react-dom";
import { v1 as uuid } from "uuid";
import "./NewSubjectForm.css";
import {
	collection,
	doc,
	setDoc,
	getFirestore,
	updateDoc,
	getDoc,
} from "firebase/firestore";
// import { collection, doc, setDoc, getFirestore } from "firebase/firestore";
import firebaseConfig from "../utils/firebase.config";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
const app = firebaseConfig();
const storage = getStorage();
const db = getFirestore(app);

function NewSubjectForm({ task, createTodo }) {
	const [selectedFile, setSelectedFile] = useState(null);
	const [userInput, setUserInput] = useReducer(
		(state, newState) => ({ ...state, ...newState }),
		{
			task: "",
			courseCode: "",
		}
	);

	const handleChange = (evt) => {
		setUserInput({ [evt.target.name]: evt.target.value });
	};

	const saveToFireBase = async (data) => {
		try {
			const docRef = doc(db, "courses", data.id);
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
	};
	const handleSubmit = (evt) => {
		evt.preventDefault();
    if(!userInput.task) {
      alert('Please enter a subject name');
      return;
    }
		const newTodo = {
			id: userInput.task,
			courseCode: userInput.courseCode,
			title: userInput.task,
		};
		saveToFireBase(newTodo);
		createTodo(newTodo);
		setUserInput({ task: "", courseCode: "" });
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
		const customFileName = `subject-${uuid()}`;
		const file = e.target.files[0];
		const renamedFile = new File([file], customFileName, { type: file.type });
		setSelectedFile(renamedFile);
	};
	return (
		<form className='NewTodoForm' onSubmit={handleSubmit}>
			<label htmlFor='task'>Add Subject</label>
			<input
				value={userInput.task}
				onChange={handleChange}
				id='task'
				type='text'
				name='task'
				placeholder='Subject Name'
			/>
			<input
				value={userInput.courseCode}
				onChange={handleChange}
				id='courseCode'
				type='text'
				name='courseCode'
				placeholder='courseCode Name'
			/>
			<input
				onChange={handleImageChange}
				type='file'
				style={{ background: "none" }}
				placeholder='Image for subject..'
			/>
			<button>Add</button>
		</form>
	);
}

export default NewSubjectForm;
