import React from 'react';
// ? react-router-dom
import { Routes, Route } from 'react-router-dom';
// ? pages
import AdminSidebar from '../../components/AdminSidebar';
import ManageRawMaterials from '../../pages/admin/ManageRawMaterials';
import ManageProducts from '../../pages/admin/ManageProducts';

export default function AdminDashboard() {
  return (
    <>
      <AdminSidebar />
      <Routes>
        <Route path={'raw_materials'} element={<ManageRawMaterials />} />
        <Route path={'products'} element={<ManageProducts />} />
      </Routes>
    </>
  );
}
