// ? css
import './App.css';
// ? react-router-dom
import { Routes, Route } from 'react-router-dom';
// ? pages
import LandingPage from './pages/LandingPage';
import AdminMenu from './pages/admin/AdminMenu';

function App() {
  return (
    <div>
      <Routes>
        <Route path={'/'} element={<LandingPage />} />
        <Route path={'/admin/*'} element={<AdminMenu />} />
      </Routes>
    </div>
  );
}

export default App;
