import './App.css';
import Chapters from './components/Chapters';
import InsideUnit from './components/InsideUnit';
import Quiz from './components/Quiz';
import SubjectList from './components/SubjectList';
import UnitList from './components/UnitsList'
import {useState} from 'react';
import { BrowserRouter,Router,Routes,Route, RouterProvider } from 'react-router-dom';
function App() {
  const [title,setTitle]=useState('')
  return (
   <BrowserRouter>
   <Routes>
   <Route path='/:subject/:unit/:topic/quiz' element={<Quiz title={title}/>}/>
    <Route path='/:subject/:unit/:topic' element={<InsideUnit title={title} setTitle={setTitle}/>}/>
    <Route path='/:subject/:unit' element={<Chapters title={title} setTitle={setTitle}/>}/>
    <Route path='/:subject' element={<UnitList />}/>
    <Route path='/' element={<SubjectList />}/>
   </Routes>
   </BrowserRouter>
      
   
  );
}

export default App;
