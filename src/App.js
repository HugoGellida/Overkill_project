import './App.css';
import { Routes, Route } from 'react-router-dom';
import Log_in from './javascript/log_in';
import { useEffect } from 'react';


function App() {
  return (
    <div className="App" style={{height: "100%", width:"100%"}}>
      <Routes>
        <Route path='/' element={<Log_in/>}/>
      </Routes>
    </div>
  );
}

export default App;
