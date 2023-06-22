import { Route, Routes } from 'react-router-dom';
import './App.css';
import Footer from './component/layout/Footer';
import Header from './component/layout/Header';
import TodoTemplate from './component/todo/TodoTemplate';
import Join from './component/user/Join';
import Login from './component/user/Login';

function App() {
  return (
    <>
      <Header/>
      
      <Routes>
        <Route path='/' element={ <TodoTemplate/>}/>
        <Route path='/login' element={ <Login/>}/>
        <Route path='/join' element={ <Join/>}/>
      </Routes>

      <Footer/>
    </>
  );
}

export default App;
