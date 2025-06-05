import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import RecruitList from "./components/RecruitList";
import PerformerList from "./components/PerformerList";
import RecruitDetail from "./components/RecruitDetail";
import PerformerDetail from "./components/PerformerDetail";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/recruit" element={<RecruitList />} />
        <Route path="/performer" element={<PerformerList />} />
        <Route path="/recruit/:id" element={<RecruitDetail />} /> 
        <Route path="/performer/:id" element={<PerformerDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
