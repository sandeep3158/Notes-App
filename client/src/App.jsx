import React, { useState } from 'react';
import Navbar from './components/navbar';
import Home from './components/home';
import About from './components/about';
import Login from './components/login';
import Signup from './components/signup';
import Alert from './components/alert';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NoteState from './context/Notestate';
const App = () => {
  const [alert, setAlert] = useState(null);
  const showAlert = (message, type) => {
    setAlert({
      msg: message,
      type: type
    })
    setTimeout(() => {
      setAlert(null);
    }, 1500);
  }
  return (
    <>
      <NoteState>
        <Router>
          <Navbar />
          <Alert alert={alert} />
          <div className='container my-5'>
            <Routes>
              <Route path="/" element={<Home showAlert={showAlert} />} />
              <Route path="/about" element={<About  />} />
              <Route path="/login" element={< Login showAlert={showAlert}/>} />
              <Route path="/signup" element={<Signup showAlert={showAlert} />} />

            </Routes>
          </div>
        </Router>
      </NoteState>
    </>
  );
}

export default App;
