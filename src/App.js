import './App.css';
import Chapters from './components/Chapters';
import InsideUnit from './components/InsideUnit';
import Quiz from './components/Quiz';
import SubjectList from './components/SubjectList';
import UnitList from './components/UnitsList'
import { BrowserRouter,Router,Routes,Route, RouterProvider } from 'react-router-dom';
function App() {
  return (
   <BrowserRouter>
   <Routes>
   <Route path='/:subject/:unit/:topic/quiz' element={<Quiz/>}/>
    <Route path='/:subject/:unit/:topic' element={<InsideUnit/>}/>
    <Route path='/:subject/:unit' element={<Chapters/>}/>
    <Route path='/:subject' element={<UnitList />}/>
    <Route path='/' element={<SubjectList />}/>
   </Routes>
   </BrowserRouter>
      
   
  );
}

export default App;
