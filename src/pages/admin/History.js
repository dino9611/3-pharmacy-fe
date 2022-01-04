import React from 'react';
// ? react-router-dom
import { Routes, Route, Navigate } from 'react-router-dom';

import RawMaterialsRecord from './RawMaterialsRecord';

export default function History() {
  return (
    <>
      <Routes>
        <Route
          path='/'
          element={<Navigate replace to='/admin/history/raw_materials' />}
        />
        <Route path={'raw_materials'} element={<RawMaterialsRecord />} />
      </Routes>
    </>
  );
}
