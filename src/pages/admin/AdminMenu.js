import React from 'react';
// ? react-router-dom
import { Routes, Route } from 'react-router-dom';
// ? pages
import AdminSidebar from '../../components/AdminSidebar';

import ManageRawMaterials from './ManageRawMaterials';
import ManageProducts from './ManageProducts';

import RawMaterialsRecord from './RawMaterialsRecord';

export default function AdminMenu() {
  return (
    <>
      <div className='flex justify-between'>
        <AdminSidebar />
        <Routes>
          <Route path={'raw_materials'} element={<ManageRawMaterials />} />
          <Route path={'products'} element={<ManageProducts />} />

          <Route
            path={'raw_materials_record'}
            element={<RawMaterialsRecord />}
          />
        </Routes>
      </div>
    </>
  );
}
