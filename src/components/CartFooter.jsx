import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { toRupiah } from '../helpers/toRupiah';

const CartFooter = () => {
  // global states
  const cartState = useSelector((state) => state.cart);

  const renderTotal = () => {
    let total = 0;
    cartState.forEach((val) => {
      total += val.productPriceRp * val.qty;
    });
    return total;
  };

  return (
    <div className='font-poppins bg-primary1 fixed left-0 bottom-0 w-full h-24 phone:h-14 flex justify-end items-center px-4 phone:px-2'>
      <p className='mr-4 text-white phone:text-xs text-lg'>
        Total = {toRupiah(renderTotal())}
      </p>
      <Link to='/checkout'>
        <button className='font-semibold bg-fourth2 hover:bg-secondary1 hover:text-white px-10 py-3 phone:px-3 phone:h-full rounded-md phone:text-xs'>
          Checkout
        </button>
      </Link>
    </div>
  );
};

export default CartFooter;
