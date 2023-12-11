import './App.css';
import Chapters from './components/Chapters';
import InsideUnit from './components/InsideUnit';
import Quiz from './components/Quiz';
import SubjectList from './components/SubjectList';
import UnitList from './components/UnitsList'
import Login from './components/LOGIN'
import {useEffect, useState} from 'react';
import { BrowserRouter,Router,Routes,Route, RouterProvider, useNavigate, Link, Navigate } from 'react-router-dom';
import NotesList from './components/NotesList';
function App() {
  const [title,setTitle]=useState('')
  const isAuthenticated = (localStorage.getItem('user') === 'true');
 
  // const isAuthenticated = 'true';
  return (
   <BrowserRouter>
   <Routes>
   <Route path='/:subject/:unit/:topic/notes' element={isAuthenticated?<NotesList title={title}/>:<Navigate to={'/login'} replace />}/>
   <Route path='/:subject/:unit/:topic/quiz' element={isAuthenticated?<Quiz title={title}/>:<Navigate to={'/login'} replace />}/>
    <Route path='/:subject/:unit/:topic' element={isAuthenticated?<InsideUnit title={title} setTitle={setTitle}/>:<Navigate to={'/login'} replace />}/>
    <Route path='/:subject/:unit' element={isAuthenticated?<Chapters title={title} setTitle={setTitle}/>:<Navigate to={'/login'} replace />}/>
    <Route path='/:subject' element={isAuthenticated?<UnitList />:<Navigate to={'/login'} replace />}/>
    <Route path='/login' element={!isAuthenticated?<Login />:<Navigate to={'/'} replace />}/>
    <Route path='/' element={isAuthenticated? <SubjectList />:<Navigate to={'/login'} replace />}/>
   </Routes>
   </BrowserRouter>
      
   
  );
}

export default App;
