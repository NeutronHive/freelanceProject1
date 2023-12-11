import React, { useState } from "react";
import ReactDOM from "react-dom";
import "./Subject.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";

function Subject({ todo, remove, update, toggleComplete }) {
  console.log(todo);
  const [isEditing, setIsEditing] = useState(false);
  const [task, setTask] = useState(todo.task);

  const handleClick = (e,x) => {

    remove(e,x);
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
          {todo?.data?.image && (
            <img src={todo.data.image} style={{ height: "50px", width:'50px', borderRadius:'50%', marginRight:'2rem'  }} alt='' srcset='' />
          )}
        <li
          id={todo.id}
         
          onClick={()=>toggleCompleted(todo.data.courseCode)}
          className={todo.completed ? "Todo-task completed" : "Todo-task"} style={todo?.data?.image?{marginRight:'7rem'}:null}>
        
          {todo.id.split("-")[0]}
        </li>
        <div className="Todo-buttons">
          {/* <button onClick={toggleFrom}>
          <FontAwesomeIcon icon={faPen} />
          </button> */}
          <button onClick={() =>{ 
            handleClick(todo?.id,todo?.data?.courseCode)
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
