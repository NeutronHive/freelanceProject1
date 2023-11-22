import './App.css';
import SubjectList from './components/SubjectList';
import UnitList from './components/UnitsList'
import { BrowserRouter,Router,Routes,Route, RouterProvider } from 'react-router-dom';
function App() {
  return (
   <BrowserRouter>
   <Routes>
    <Route path='/' element={<SubjectList />}/>
    <Route path='/:subject' element={<UnitList />}/>
   </Routes>
   </BrowserRouter>
      
   
  );
}

export default App;
