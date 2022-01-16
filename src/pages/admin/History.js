import React from 'react';
// ? react-router-dom
import { Routes, Route, Navigate, Link } from 'react-router-dom';

import RawMaterialsRecord from './RawMaterialsRecord';
import PrescriptionHistory from './PrescriptionHistory';
import OrderHistory from './OrderHistory';

export default function History() {
  // const loc = useLocation();
  // const [baseURL, setbaseURL] = React.useState(
  //   loc.pathname.split('/').slice(0, -1).join('/')
  // );
  return (
    <div className='bg-secondary1 flex flex-col h-full lg:w-4/5 w-full absolute right-0 font-poppins items-center'>
      <div className='bg-fourth2 flex w-11/12 h-10 rounded-full mt-2 justify-evenly border-black border-2'>
        <button className='flex-1 rounded-l-full font-semibold cursor-default'>
          <Link to='raw_materials' className='hover:text-white cursor-pointer'>
            Raw Materials
          </Link>
        </button>
        <button className='hover:text-white flex-1 border-black border-r-2 border-l-2 font-semibold cursor-default'>
          <Link to='orders' className='hover:text-white cursor-pointer'>
            Orders
          </Link>
        </button>
        <button className='hover:text-white flex-1 rounded-r-full font-semibold cursor-default'>
          <Link to='prescriptions' className='hover:text-white cursor-pointer'>
            Prescriptions
          </Link>
        </button>
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
