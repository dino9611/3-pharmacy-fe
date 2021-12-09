// ? css
import './App.css';
// ? react-router-dom
import { Routes, Route } from 'react-router-dom';
// ? pages
import LandingPage from './pages/LandingPage';
import Admin from './pages/admin/AdminDashboard';

function App() {
  return (
    <div>
      <Routes>
        <Route path={'/'} element={<LandingPage />} />
        <Route path={'/admin/*'} element={<Admin />} />
      </Routes>
    </div>
  );
}

export default App;
