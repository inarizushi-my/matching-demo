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
import MatchMusic from "./components/MatchMusic";
import MatchPerformer from "./components/MatchPerformer"; 
import RegisterHistoryPage from "./components/RegisterHistoryPage";
import EditEntryPage from "./pages/EditEntryPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/history" element={<RegisterHistoryPage />} />
        <Route path="/recruit" element={<RecruitList />} />
        <Route path="/performer" element={<PerformerList />} />
        <Route path="/recruit/:id" element={<RecruitDetail />} />
        <Route path="/performer/:id" element={<PerformerDetail />} />
        <Route path="/entry" element={<RegisterMenu />} />
        <Route path="/entry/recruit" element={<RecruitForm />} />
        <Route path="/entry/performer" element={<PerformerForm />} />
        <Route path="/matching" element={<MatchMenu />} />
        <Route path="/matching/recruit" element={<MatchMusic />} />
        <Route path="/matching/performer" element={<MatchPerformer />} />
        <Route path="/edit/:type/:id" element={<EditEntryPage />} />


      </Routes>
    </Router>
  );
}

export default App;
