import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import RecruitList from "./components/RecruitList";
import PerformerList from "./components/PerformerList";
import RecruitDetail from "./components/RecruitDetail";
import PerformerDetail from "./components/PerformerDetail";
import RegisterMenu from "./components/RegisterMenu";
import RecruitForm from "./components/RecruitForm";
import PerformerForm from "./components/PerformerForm";
import MatchMenu from "./components/MatchMenu";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/recruit" element={<RecruitList />} />
        <Route path="/performer" element={<PerformerList />} />
        <Route path="/recruit/:id" element={<RecruitDetail />} />
        <Route path="/performer/:id" element={<PerformerDetail />} />
        <Route path="/entry" element={<RegisterMenu />} />
        <Route path="/entry/recruit" element={<RecruitForm />} />
        <Route path="/entry/performer" element={<PerformerForm />} />
        <Route path="/matching" element={<MatchMenu />} />
      </Routes>
    </Router>
  );
}

export default App;
