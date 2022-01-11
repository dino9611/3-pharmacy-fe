import React from 'react';
// ? react-router-dom
import { Routes, Route, Navigate } from 'react-router-dom';
// ? pages
import AdminSidebar from '../../components/AdminSidebar';

// * view
import Dashboard from './Dashboard';
import History from './History';
import RawMaterialsRecord from './RawMaterialsRecord';

// * manage
import ManageRawMaterials from './ManageRawMaterials';
import ManageProducts from './ManageProducts';
// import ManageProducts from './ManageProducts';
// import AdminProducts from './AdminProducts';
import AdminProdTransHistory from './AdminProdTransHistory';

export default function AdminMenu() {
  return (
    <>
      {/* <div className='flex justify-end'> */}
      <AdminSidebar />
      <Routes>
        <Route path='/' element={<Navigate replace to='/admin/dashboard' />} />

        <Route path={'dashboard'} element={<Dashboard />} />
        <Route path={'history/*'} element={<History />} />

        <Route path={'raw_materials'} element={<ManageRawMaterials />} />
        {/* <Route path={'products'} element={<AdminProducts />} /> */}
        <Route path={'products'} element={<ManageProducts />} />
        <Route path={'raw_materials_record'} element={<RawMaterialsRecord />} />
        <Route path={'order'} element={<AdminProdTransHistory />} />
      </Routes>
      {/* </div> */}
    </>
  );
}
