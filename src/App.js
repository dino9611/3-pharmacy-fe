// ? css
import './App.css';
// ? pages
import RawMaterials from './pages/admin/RawMaterials';

import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';

function App() {
  return (
    <div>
      <Routes>
        <Route path={'/'} element={<LandingPage />} />
        <Route path={'/raw_material'} element={<RawMaterials />} />
      </Routes>
    </div>
  );
}

export default App;
