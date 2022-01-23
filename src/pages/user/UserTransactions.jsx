import React from 'react';
// ? react-router-dom
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from 'react-router-dom';

// import RawMaterialsRecord from './RawMaterialsRecord';
// import PrescriptionHistory from './PrescriptionHistory';
// import OrderHistory from '../OrderHistory';
import ProductTransactionHistory from './ProductTransactionHistory';
import PrescriptionTransactions from './PrescriptionTransactions';
export default function History() {
  const location = useLocation();
  const navigate = useNavigate();
  const [links] = React.useState([
    { to: 'product_orders', label: 'Product Orders' },
    { to: 'prescription_orders', label: 'Prescription Orders' },
  ]);
  return (
    // <div className='bg-lightblue flex flex-col h-min-screen w-full absolute right-0 font-poppins items-center'>
    <div className='bg-lightblue font-poppins min-h-screen w-full'>
      <div className='bg-fourth2 flex w-full justify-evenly'>
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
          element={<Navigate replace to='/order-list/product_orders' />}
        />
        <Route
          path={'product_orders'}
          element={<ProductTransactionHistory />}
        />
        <Route
          path={'prescription_orders'}
          element={<PrescriptionTransactions />}
        />

        <Route path={'*'} element={<Navigate to={'/404'} />} />
      </Routes>
    </div>
  );
}
