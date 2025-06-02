import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import RecruitList from "./components/RecruitList";
import RecruitDetail from "./components/RecruitDetail";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/recruit" element={<RecruitList />} />
        <Route path="/recruit/:id" element={<RecruitDetail />} />
        {/* 今後追加するページはここに */}
      </Routes>
    </Router>
  );
}

export default App;
