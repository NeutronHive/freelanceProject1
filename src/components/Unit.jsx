import React, { useState } from "react";
import ReactDOM from "react-dom";
import "./Subject.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";

function Unit({ todo, remove, update, toggleComplete }) {
	const [isEditing, setIsEditing] = useState(false);
	const [task, setTask] = useState(todo.task);

	const handleClick = (id) => {
		remove(id);
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
          {todo?.image && (
            <img src={todo.image} style={{ height: "50px", width:'50px', borderRadius:'50%', marginRight:'2rem' }} alt='' srcset='' />
          )}
					<li
						id={todo.id}
						onClick={toggleCompleted}
						className={todo.completed ? "Todo-task completed" : "Todo-task"} style={todo?.image?{marginRight:'9rem'}:null}>
						{todo.id.split("-")[1]}
            
					</li>
					<div className='Todo-buttons'>
						{/* <button onClick={toggleFrom}>
          <FontAwesomeIcon icon={faPen} />
        </button> */}
						<button onClick={() => handleClick(todo.id)}>
							<FontAwesomeIcon icon={faTrash} />
						</button>
					</div>
				</div>
		);
	}
	return result;
}

export default Unit;
