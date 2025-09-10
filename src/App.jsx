import { Route, Routes } from "react-router-dom";
import "./App.css";
import HomePage from "./Pages/HomePage";
import ChatPage from "./Pages/ChatPage";

function App() {
  return (
    <div className="App min-h-screen w-screen">
     <Routes>
       <Route path="/" element={<HomePage/>} />
       <Route path="/chat" element={<ChatPage/>} />
     </Routes>
    </div>
  );
}

export default App;
