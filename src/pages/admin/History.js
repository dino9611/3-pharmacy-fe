import React from 'react';
// ? react-router-dom
import {
  Routes,
  Route,
  Navigate,
  Link,
  useNavigate,
  useLocation,
} from 'react-router-dom';

import RawMaterialsRecord from './RawMaterialsRecord';
import PrescriptionHistory from './PrescriptionHistory';

export default function History() {
  const location = useLocation();
  // const [baseURL, setbaseURL] = React.useState(
  //   loc.pathname.split('/').slice(0, -1).join('/')
  // );
  const navigate = useNavigate();
  const [links] = React.useState([
    { to: 'raw_materials', label: 'Raw Materials' },
    { to: 'orders', label: 'Orders' },
    { to: 'prescriptions', label: 'Prescriptions' },
  ]);
  return (
    <div className='bg-lightblue flex flex-col h-full lg:w-4/5 w-full absolute right-0 font-poppins justify-between items-center'>
      {/* <div className='bg-secondary1 flex w-11/12 h-10 rounded-full mt-2 justify-evenly border-black border-2'> */}
      <div className='bg-fourth2 flex w-full h-12 justify-evenly shadow-lg'>
        {links.map((el) => {
          return (
            <button
              className={`flex-1 text-white btn-primary font-semibold ${
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
        <Route path={'orders'} element={<RawMaterialsRecord />} />
        <Route path={'prescriptions'} element={<PrescriptionHistory />} />

        <Route path={'*'} element={<Navigate to={'/404'} />} />
      </Routes>
    </div>
  );
}
