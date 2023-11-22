import React from 'react'
import "./SubjectList.css";
import "./Subject.css";
import { useParams } from 'react-router-dom';
const InsideUnit = () => {
    const {subject, unit ,topic } = useParams();
   
   
  return (
    <div>
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