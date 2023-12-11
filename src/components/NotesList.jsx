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
	getDoc,
} from "firebase/firestore";
import firebaseConfig from "../utils/firebase.config";
import { useNavigate, useParams } from "react-router-dom";
import NewNoteForm from "./NewNoteForm";
import Note from "./Note";
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

async function getSubjects(subject, unit, topic) {
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

	const farray = [];

	usersArray[0].data.forEach((doc) => {
		if (doc.id == topic) {
			farray.push({
				id: doc.id,
				data: doc.notes,
			});
		}
	});
	console.log(farray[0].data);
	return farray[0].data;
}

function NotesList() {
	const { subject, unit, topic } = useParams();
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
		getSubjects(subject, unit, topic).then((data) => {
			setTodos(data);
		});
	}, [subject, unit, topic]);

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
	const deleteFirebaseDocument = async (mdata) => {
		try {
			if (mdata.url) {
                const name = getFilenameFromUrl(mdata.url).replace('%2F','/');
				deleteFileFromStorage(name);
			}
			const title = await getTitle(subject);
			const orignalId = `${title}-${unit}`;
			const docRef = doc(db, "topics", orignalId);
			getDoc(docRef)
				.then((docSnap) => {
					if (docSnap.exists()) {
						const data = docSnap.data();
						data?.quizzes?.map((quiz) => {
							if (quiz.id == topic) {
								quiz.notes = quiz.notes.filter(
									(note) => note.name !== mdata.name
								);
							}
						});
						updateDoc(docRef, data).then(() => {
							alert("Notes successfully deleted!");
						});
                        window.location.reload(true);   
					} else {
						console.log("No such document!");
					}
				})
				.catch((error) => {
					console.error("Error getting document:", error);
				});
		} catch (e) {
			console.error("Error adding document: ", e);
		}
		//   await setDoc(docRef, data);
		//   console.log("Document written with ID: ", docRef.id);
	};

	const remove = (id) => {
		setTodos(todos.filter((todo) => todo.id !== id));
		deleteFirebaseDocument(id);
	};

	const updateFirebaseDocument = async (todoid, change) => {
		try {
			const title = await getTitle(subject);
			const orignalId = `${title}-${unit}`;
			const docRef = doc(db, "topics", orignalId);
			getDoc(docRef)
				.then((docSnap) => {
					if (docSnap.exists()) {
						const data = docSnap.data();
						data?.quizzes?.map((quiz) => {
							if (quiz.id == topic) {
								quiz.notes = quiz.notes.map((note) => {
									if (note.name === todoid) {
										// Replace the 'name' property with a new value
										return { ...note, name: change.name }; // Replace 'newName' with your desired value
									} else {
										return note; // Return the unchanged note object if the condition is not met
									}
								});
							}
						});
						updateDoc(docRef, data).then(() => {
							alert("Notes successfully deleted!");
						});
                        // window.location.reload(true);   
					} else {
						console.log("No such document!");
					}
				})
				.catch((error) => {
					console.error("Error getting document:", error);
				});
		 
			console.log("Document updated successfully!");
		} catch (e) {
			console.error("Error updating document: ", e);
		}
	};

	const update = async (id, updatedTask) => {
		let newTask, orignalId;
		const updatedTodos = todos?.map((todo) => {
			if (todo.name === id) {
				orignalId = todo.name;
				newTask = { ...todo, name: updatedTask };
				return newTask;
			}
			return todo;
		});
	
		await updateFirebaseDocument(orignalId, newTask);
		setTodos(updatedTodos);
	};

	const toggleComplete = async (id) => {
		navigate(`/${id.split("-")[0]}`);
		return;
	};

	const todosList = todos?.map((todo) => (
		<Note
			toggleComplete={toggleComplete}
			update={update}
			remove={remove}
			key={todo.id}
			todo={todo}
		/>
	));

	return (
		<div className='TodoList'>
			<h1>
				{topic} Notes List <span>The List Of Notes That You Have</span>
			</h1>
			{todos?.length != 0 && <ul>{todosList}</ul>}
			{!todos&& <ul style={{color:'whitesmoke'}}>No Notes Added Yet !</ul>}
			<NewNoteForm
				createTodo={create}
				subject={subject}
				unit={unit}
				topic={topic}
			/>
		</div>
	);
}

export default NotesList;
