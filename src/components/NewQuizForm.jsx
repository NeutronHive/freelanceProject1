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
import firebaseConfig from "../utils/firebase.config";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useParams } from "react-router";
const storage = getStorage();
const app = firebaseConfig();
const db = getFirestore(app);

function NewQuizForm(topic) {
	const { subject, unit, } = useParams();
	const [selectedFile, setSelectedFile] = useState(null);
	const [userInput, setUserInput] = useReducer(
		(state, newState) => ({ ...state, ...newState }),
		{
			text: "",
			image: "",
			details: "",
			options: [
				{ value: "", correct: false },
				{ value: "", correct: false },
				{ value: "", correct: false },
				{ value: "", correct: false },
			],
		}
	);

	const [question, setQuestion] = useState(userInput);

	const handleTextChange = (e) => {
		setQuestion({ ...question, text: e.target.value });
	};

	const handleOptionChange = (index, e) => {
		const newOptions = [...question.options];
		newOptions[index].value = e.target.value;
		setQuestion({ ...question, options: newOptions });
	};

	const handleCheckboxChange = (index) => {
		const newOptions = [...question.options];
		newOptions[index].correct = !newOptions[index].correct;
		setQuestion({ ...question, options: newOptions });
	};
	const saveToFireBase = async (mdata) => {
		try {
			const orignalId = topic.topic;
			const docRef = doc(db, "quizzes", orignalId);
			getDoc(docRef)
				.then((docSnap) => {
					if (docSnap.exists()) {
						const data = docSnap.data();
						data.questions.push(mdata);
						updateDoc(docRef, data).then(() => {
							alert("Question successfully added!");
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
	const handleSubmit = async (e) => {
		e.preventDefault();
		console.log("Submitted Question:", question);
    if (selectedFile) {
      const url = await handleFileUpload(selectedFile);
      question.image = url;
    } else {
      console.error('No file selected for upload');
    }
    console.log(question)
		await saveToFireBase(question);
		setQuestion(userInput);
	};
	const handelImageChange = (e) => {
    if(!e.target.files[0]) return;
    const customFileName = `${topic.topic}-${uuid()}`;
		const file = e.target.files[0];
    const renamedFile = new File([file], customFileName, { type: file.type });
		setSelectedFile(renamedFile);
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

	return (
		<form style={formStyle} onSubmit={handleSubmit}>
			<label style={labelStyle}>
				Question Description:
				<input
					type='text'
					value={question.text}
					onChange={handleTextChange}
					style={inputStyle}
					placeholder='Question...'
				/>
			</label>
			<label style={labelStyle}>
				Question Image(if any):
				<input
					type='file'
					onChange={handelImageChange}
					style={inputStyle}
					placeholder='Question Image...'
				/>
			</label>
			<label style={labelStyle}>
				Details(if any):
				<input
					type='text'
					onChange={(e) => {
						setQuestion({ ...question, details: e.target.value });
					}}
					style={inputStyle}
					placeholder='Details...'
				/>
			</label>

			<label style={labelStyle}>
				{question.options.map((option, index) => (
					<div key={index} style={optionContainerStyle}>
						Option {index + 1}:
						<div style={{ display: "flex" }}>
							<input
								type='text'
								value={option.value}
								onChange={(e) => handleOptionChange(index, e)}
								style={inputStyle}
								placeholder={`Option ${index + 1}`}
							/>

							<input
								type='checkbox'
								checked={option.correct}
								onChange={() => handleCheckboxChange(index)}
								style={checkboxStyle}
							/>
						</div>
					</div>
				))}
			</label>

			<button type='submit' style={submitButtonStyle}>
				Submit
			</button>
		</form>
	);
}

// Styles
const formStyle = {
	maxWidth: "400px",
	margin: "auto",
	padding: "20px",
	fontFamily: "Arial, sans-serif",
};

const labelStyle = {
	display: "block",
	marginBottom: "10px",
};

const inputStyle = {
	width: "100%",
	padding: "8px",
	boxSizing: "border-box",
	marginBottom: "10px",
};

const optionContainerStyle = {
	marginBottom: "15px",
};

const checkboxStyle = {
	marginLeft: "5px",
	width: "25px",
};

const submitButtonStyle = {
	backgroundColor: "#4CAF50",
	color: "white",
	padding: "10px 15px",
	border: "none",
	borderRadius: "4px",
	cursor: "pointer",
};
submitButtonStyle[":hover"] = {
	backgroundColor: "#45a049", // Change the background color on hover
};
export default NewQuizForm;
