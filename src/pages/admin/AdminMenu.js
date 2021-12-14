import React from 'react';
// ? react-router-dom
import { Routes, Route } from 'react-router-dom';
// ? pages
import AdminSidebar from '../../components/AdminSidebar';

import ManageRawMaterials from './ManageRawMaterials';
import ManageProducts from './ManageProducts';

import RawMaterialsRecord from './RawMaterialsRecord';
import AdminProducts from './AdminProducts';

export default function AdminMenu() {
  return (
    <>
      <AdminSidebar />
      <Routes>
        <Route path={'raw_materials'} element={<ManageRawMaterials />} />
        {/* <Route path={'products'} element={<ManageProducts />} /> */}
        <Route path={'products'} element={<AdminProducts />} />
        <Route path={'raw_materials_record'} element={<RawMaterialsRecord />} />
      </Routes>
    </>
  );
}
