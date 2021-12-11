import React from 'react';
// ? react-router-dom
import { Routes, Route } from 'react-router-dom';
// ? pages
import AdminSidebar from '../../components/AdminSidebar';
import ManageRawMaterials from './ManageRawMaterials';
import ManageProducts from './ManageProducts';

export default function AdminMenu() {
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