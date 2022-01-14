import React from 'react';
import './styles/landingPage.css';
import Logo1 from './Asset/Landingpage1.svg';
import Logo2 from './Asset/Landingpage2.svg';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Link, Routes, Route, Navigate } from 'react-router-dom';

// ? subpages
import Products from './Products';
import UserProfile from './user/UserProfile';
import Cart from './user/Cart';
import ProductTransactionHistory from './user/ProductTransactionHistory';
import UserPrescription from './user/UserPrescription';
import CheckOut from './user/CheckOut';
import UploadPayment from './user/UploadPayment';

const UserMenu = () => {
  return (
    <div>
      <Header />
      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route path='/products' element={<Products />} />
        <Route path='/prescriptions' element={<UserPrescription />} />

        <Route path='/user_profile' element={<UserProfile />} />

        <Route path='/cart' element={<Cart />} />

        <Route path={'/order-list'} element={<ProductTransactionHistory />} />

        <Route path={'/checkout'} element={<CheckOut />} />

        <Route path={'/uploadpayment/:order_id'} element={<UploadPayment />} />

        <Route path={'*'} element={<Navigate to={'/404'} />} />
      </Routes>
      <Footer />
    </div>
  );
};

const LandingPage = () => {
  return (
    <>
      <div className='font-poppins bg-primary1 flex phone:flex-col justify-evenly items-center py-6'>
        <div className='phone:order-2 phone:mx-10 my-4'>
          <p className='max-w-sm text-3xl phone:text-lg font-bold text-white mb-4 phone:mb-1'>
            Upload Prescriptions{' '}
          </p>
          <p className='max-w-sm text-base phone:text-sm text-white'>
            Upload your own custom medicines prescribed by your doctor
          </p>
          <Link to='/prescriptions'>
            <button className='btn btn-secondary mt-3'>
              Upload Prescriptions Now!
            </button>
          </Link>
        </div>
        <img
          src={Logo1}
          alt='Default'
          className='w-96 phone:w-3/6 phone:mx-auto'
        />
      </div>
      <div className='font-poppins bg-lightblue flex phone:flex-col justify-evenly items-center py-6'>
        <img src={Logo2} alt='Default' className='w-96 phone:w-3/6' />
        <div className='phone:mx-10 phone:mt-4'>
          <p className='max-w-md text-3xl font-bold phone:text-lg text-primary1 mb-4 phone:mb-1'>
            Medicine and Vitamins{' '}
          </p>
          <p className='max-w-sm text-base text-primary1 phone:text-sm'>
            Buy readily available medicine and vitamins for your needs
          </p>
          <Link to='/products'>
            {/* <button className='bg-primary1 hover:bg-secondary1 text-white rounded-md px-4 py-2 phone:w-full phone:text-sm mt-4'>
              Shop Now!
            </button> */}
            <button className='btn btn-primary mt-3'>Shop Now!</button>
          </Link>
        </div>
      </div>
      {/* <Footer /> */}
    </>
  );
};

export default UserMenu;
