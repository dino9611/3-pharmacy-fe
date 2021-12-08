// ? css
import './App.css';
// ? pages
import ManageRawMaterials from './pages/admin/ManageRawMaterials';
// import ManageProducts from './pages/admin/ManageProducts';

import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';

function App() {
  return (
    <div>
      <Routes>
        <Route path={'/'} element={<LandingPage />} />
        <Route path={'/raw_material'} element={<ManageRawMaterials />} />
        {/* <Route path={'/products'} element={<ManageProducts />} /> */}
      </Routes>
    </div>
  );
}

export default App;
