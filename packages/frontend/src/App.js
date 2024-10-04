import "./App.css";
import { Routes, Route } from "react-router-dom";
import Log_in from "./pages/login";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Log_in />} />
      </Routes>
    </div>
  );
}

export default App;
