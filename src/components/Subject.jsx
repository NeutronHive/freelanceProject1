import React, { useState } from "react";
import ReactDOM from "react-dom";
import "./Subject.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";

function Subject({ todo, remove, update, toggleComplete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [task, setTask] = useState(todo.task);

  const handleClick = (e) => {

    remove(e);
  };
  const toggleFrom = () => {
    setIsEditing(!isEditing);
  };
  const handleUpdate = evt => {
    evt.preventDefault();
    update(todo.id, task);
    toggleFrom();
  };
  const handleChange = evt => {
    setTask(evt.target.value);
  };
  const toggleCompleted = x => {
    toggleComplete(x);
  };
  let result;
  if (isEditing) {
    result = (
      <div className="Todo">
        <form className="Todo-edit-form" onSubmit={handleUpdate}>
          <input onChange={handleChange} value={task} type="text" />
          <button>Save</button>
        </form>
      </div>
    );
  } else {
    result = (

      <div className="Todo">
        <li
          id={todo.id}
          onClick={()=>toggleCompleted(todo.data.courseCode)}
          className={todo.completed ? "Todo-task completed" : "Todo-task"}
        >
          {todo.id.split("-")[0]}
        </li>
        <div className="Todo-buttons">
          {/* <button onClick={toggleFrom}>
          <FontAwesomeIcon icon={faPen} />
          </button> */}
          <button onClick={() =>{ 
            handleClick(todo?.id)
          }}>
          <FontAwesomeIcon icon={faTrash} />
          </button>
        </div>
      </div>
    );
  }
  return result;
}

export default Subject;
