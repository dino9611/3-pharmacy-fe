import React from 'react';
// ? react-router-dom
import { Routes, Route, Navigate } from 'react-router-dom';
// ? pages
import AdminSidebar from '../../components/AdminSidebar';

import ManageRawMaterials from './ManageRawMaterials';
// import ManageProducts from './ManageProducts';

import RawMaterialsRecord from './RawMaterialsRecord';
import AdminProducts from './AdminProducts';
import Dashboard from './Dashboard';

export default function AdminMenu() {
  return (
    <>
      {/* <div className='flex justify-end'> */}
      <AdminSidebar />
      <Routes>
        <Route path='/' element={<Navigate replace to='/admin/dashboard' />} />
        <Route path={'raw_materials'} element={<ManageRawMaterials />} />
        <Route path={'products'} element={<AdminProducts />} />
        <Route path={'raw_materials_record'} element={<RawMaterialsRecord />} />
        <Route path={'dashboard'} element={<Dashboard />} />
      </Routes>
      {/* </div> */}
    </>
  );
}
