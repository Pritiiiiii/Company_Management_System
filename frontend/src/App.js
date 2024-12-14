import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import CompanyPage from './components/Company'; // Import CompanyPage

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/company" element={<CompanyPage />} />
      </Routes>
    </Router>
  );
}

export default App;
