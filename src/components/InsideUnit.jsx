import React from 'react'
import "./SubjectList.css";
import "./Subject.css";
import { useParams } from 'react-router-dom';
const InsideUnit = (title) => {
    const {subject, unit ,topic } = useParams();
    title.setTitle(title.title)
   console.log(title);
   const handleLogout = () => {
		localStorage.clear();
		window.location.reload();
	  };
  return (
         <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-end",
        flexDirection: "column",
      }}
    >
      <button
        style={{
          position: "absolute",
          margin: "2rem",
          padding: "0.5rem 1rem",
          fontSize: "1rem",
          backgroundColor: "#ff6666",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          transition: "background-color 0.3s",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        }}
        onClick={handleLogout}
      >
        Logout
      </button>
    <div className="TodoList">
      <h1>
        {topic.split("-").slice(2).join(" ")} <span>The List Of options That You Have</span>
      </h1>
      <ul >
        <li className='Todo'><a href={`/${subject}/${unit}/${topic}/quiz`}  style={{textDecoration:"none",color:"white"}}>Quiz</a></li>
        <li className='Todo'><a href={`/${subject}/${unit}/${topic}/notes`}  style={{textDecoration:"none",color:"white"}}>Notes</a></li>
      </ul>
      {/* <NewUnitForm createTodo={create} /> */}
    </div>
    </div>
  )
}

export default InsideUnit