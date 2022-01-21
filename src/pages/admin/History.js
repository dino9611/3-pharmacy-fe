import React from 'react';
// ? react-router-dom
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from 'react-router-dom';

import RawMaterialsRecord from './RawMaterialsRecord';
import PrescriptionHistory from './PrescriptionHistory';
import OrderHistory from './OrderHistory';

export default function History() {
  const location = useLocation();
  const navigate = useNavigate();
  const [links] = React.useState([
    { to: 'raw_materials', label: 'Raw Materials' },
    { to: 'orders', label: 'Orders' },
    { to: 'prescriptions', label: 'Prescriptions' },
  ]);
  return (
    <div className='bg-lightblue flex flex-col h-full lg:w-4/5 w-full absolute right-0 font-poppins items-center'>
      <div className='bg-fourth2 flex w-full justify-evenly shadow-lg'>
        {links.map((el) => {
          return (
            <button
              key={el.to}
              className={`flex-1 h-12 text-white btn-primary font-semibold ${
                location.pathname.includes(el.to) && 'bg-secondary1'
              }`}
              onClick={() => navigate(el.to)}
            >
              {el.label}
            </button>
          );
        })}
      </div>

      <Routes>
        <Route
          path='/'
          element={<Navigate replace to='/admin/history/raw_materials' />}
        />
        <Route path={'raw_materials'} element={<RawMaterialsRecord />} />
        <Route path={'orders'} element={<OrderHistory />} />
        <Route path={'prescriptions'} element={<PrescriptionHistory />} />

        <Route path={'*'} element={<Navigate to={'/404'} />} />
      </Routes>
    </div>
  );
}
