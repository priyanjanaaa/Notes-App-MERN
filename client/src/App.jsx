import { useState } from 'react'
import {BrowserRouter,Routes,Route} from 'react-router-dom';
import Signup from './components/Signup.jsx';
import Login from './components/Login.jsx';
import Home from './components/Home.jsx';
import Pinned from './components/Pinned.jsx';
import Trash from './components/Trash.jsx';
import Archived from './components/Archived.jsx';


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Signup />}></Route>
      <Route path='/home' element={<Home />}></Route>
      <Route path='/login' element={<Login />}></Route>
      <Route path='/pinned' element={<Pinned />}></Route>
      <Route path='/trash' element={<Trash />}></Route>
      <Route path='/archived' element={<Archived />}></Route>
      

    </Routes>
    </BrowserRouter>
    
    </>
 
  )
}

export default App
