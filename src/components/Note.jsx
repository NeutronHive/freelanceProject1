import React, { useState } from "react";
import ReactDOM from "react-dom";
import "./Subject.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";

function Note({ todo, remove, update, toggleComplete }) {
	const [isEditing, setIsEditing] = useState(false);
	const [task, setTask] = useState(todo.task);

	const handleClick = (e) => {
		remove(e);
	};
	const toggleFrom = () => {
		setIsEditing(!isEditing);
	};
	const handleUpdate = (evt) => {
		evt.preventDefault();
		update(todo.id, task);
		toggleFrom();
	};
	const handleChange = (evt) => {
		setTask(evt.target.value);
	};
	const toggleCompleted = (evt) => {
		toggleComplete(evt.target.id);
	};

	let result;
	if (isEditing) {
		result = (
			<div className='Todo'>
				<form className='Todo-edit-form' onSubmit={handleUpdate}>
					<input onChange={handleChange} value={task} type='text' />
					<button>Save</button>
				</form>
			</div>
		);
	} else {
		result = (
			<div className='Todo'>
				<a
					href={todo.url}
					target='_blank'
					style={{ textDecoration: "none", color: "white" }}>
					<li
						id={todo.id}
						className={todo.completed ? "Todo-task completed" : "Todo-task"}>
						{todo.name}
					</li>
				</a>
				<div className='Todo-buttons'>
					<button onClick={toggleFrom}>
						<FontAwesomeIcon icon={faPen} />
					</button>
					<button
						onClick={() => {
							handleClick(todo);
						}}>
						<FontAwesomeIcon icon={faTrash} />
					</button>
				</div>
			</div>
		);
	}
	return result;
}

export default Note;
