import "./App.css";
import { Routes, Route } from "react-router-dom";
import Log_in from "./pages/login";

function App() {
  // TODO: Mettre le style dans un .css
  return (
    <div className="App" style={{ height: "100%", width: "100%", overflow: "hidden" }}>
      <Routes>
        <Route path="/" element={<Log_in />} />
      </Routes>
    </div>
  );
}

export default App;
