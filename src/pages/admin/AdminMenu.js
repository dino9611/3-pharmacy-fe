import React from 'react';
// ? react-router-dom
import { Routes, Route } from 'react-router-dom';
// ? pages
import AdminSidebar from '../../components/AdminSidebar';

import ManageRawMaterials from './ManageRawMaterials';
// import ManageProducts from './ManageProducts';

import RawMaterialsRecord from './RawMaterialsRecord';
import AdminProducts from './AdminProducts';
import Revenue from './Revenue';

export default function AdminMenu() {
  return (
    <>
      {/* <div className='flex justify-end'> */}
      <AdminSidebar />
      <Routes>
        <Route path={'raw_materials'} element={<ManageRawMaterials />} />
        {/* <Route path={'products'} element={<ManageProducts />} /> */}
        <Route path={'products'} element={<AdminProducts />} />
        <Route path={'raw_materials_record'} element={<RawMaterialsRecord />} />
        <Route path={'revenue'} element={<Revenue />} />
      </Routes>
      {/* </div> */}
    </>
  );
}
