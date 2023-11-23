import React, { useState } from "react";
import ReactDOM from "react-dom";
import "./Subject.css";
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function Chapter({ todo, remove, update, toggleComplete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [task, setTask] = useState(todo.title);

  const handleClick = (id) => {
    remove(id);
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
  const toggleCompleted =(id,mtitle) => {
    toggleComplete(id,mtitle);
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
          onClick={()=>toggleCompleted(todo.id,todo.title)}
          className={todo.completed ? "Todo-task completed" : "Todo-task"}
        >
          {todo?.title}
        </li>
        <div className="Todo-buttons">
          {/* <button onClick={toggleFrom}>
          <FontAwesomeIcon icon={faPen} />
          </button> */}
          <button onClick={()=>{handleClick(todo.id)}}>
          <FontAwesomeIcon icon={faTrash} />
          </button>
        </div>
      </div>
    );
  }
  return result;
}

export default Chapter;
