import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { API_URL } from '../../constants/api';
import { capitalize } from '../../helpers/capitalize';
import { toRupiah } from '../../helpers/toRupiah';

const CheckOut = () => {
  const cartState = useSelector((state) => state.cart);
  const authState = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [form, setForm] = useState({
    address: authState.address,
    bank_id: 0,
  });

  const renderCart = () => {
    return cartState.map((val, index) => (
      <div
        key={index + 1}
        className='shadow-md my-5 phone:my-2 flex items-center rounded-lg overflow-hidden'
      >
        <img
          src={API_URL + val.imagePath}
          alt=''
          className='w-32 h-32 phone:w-16 phone:h-16 bg-gray-300 object-contain m-2 rounded-lg'
        />
        <div className='ml-5 flex flex-col'>
          <p className='font-bold text-sm phone:text-xs mb-2 phone:mb-0'>
            {capitalize(val.productName)}
          </p>
          <p className='text-sm phone:text-xs'>{`${toRupiah(
            val.productPriceRp
          )} x ${val.qty}`}</p>
          <p className='text-sm phone:text-xs'>
            = {toRupiah(val.productPriceRp * val.qty)}
          </p>
        </div>
      </div>
    ));
  };

  const renderBanks = () => {
    let bank = [
      { id: 1, bank: 'BCA' },
      { id: 2, bank: 'BRI' },
      { id: 3, bank: 'TokobatPay' },
    ];
    return bank.map((val, index) => (
      <div key={index + 1}>
        <input
          className='mr-2'
          type='radio'
          id={val.bank}
          name='bank_id'
          value={val.id}
          onChange={inputHandler}
        />
        <label htmlFor={val.bank} className='phone:text-sm'>
          {val.bank}
        </label>
      </div>
    ));
  };

  const renderTotal = () => {
    let total = 0;
    cartState.forEach((val) => {
      total += val.productPriceRp * val.qty;
    });
    return total;
  };

  const inputHandler = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const onCheckout = async () => {
    var tzoffset = new Date().getTimezoneOffset() * 60000;
    var localISOTime = new Date(Date.now() - tzoffset)
      .toISOString()
      .slice(0, 19)
      .replace('T', ' ');
    const { address, bank_id } = form;
    if (!address || !bank_id) {
      Swal.fire({
        icon: 'warning',
        title: 'Oops...',
        text: 'Fill all fields',
        timer: 1500,
        timerProgressBar: true,
      });
      return;
    }
    try {
      let res = await axios.patch(
        `${API_URL}/transaction/checkout/${authState.id}`,
        {
          checkedOutAt: localISOTime,
          address: form.address,
          bank_id: parseInt(form.bank_id),
          shippingCost: 9000,
        }
      );
      dispatch({ type: 'setcart', payload: res.data });
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  useEffect(() => {
    const getCart = async () => {
      try {
        let res = await axios.get(
          `${API_URL}/transaction/getcart/${authState.id}`
        );
        dispatch({ type: 'setcart', payload: res.data });
      } catch (error) {
        alert(error);
      }
    };
    getCart();
    setForm(form);
  }, [form]);

  return (
    <div>
      <div className='font-poppins bg-lightblue flex phone:flex-col px-20 phone:px-2 py-5 phone:py-2 h-screen'>
        <div className='bg-white shadow-md w-1/2 mr-5 phone:mr-0 phone:w-full phone:h-5/6 p-5 phone:mb-2 rounded-lg overflow-x-hidden overflow-y-auto'>
          <p className='font-bold text-center text-2xl phone:text-base mb-2'>
            Products
          </p>
          <hr className='border' />
          {renderCart()}
        </div>
        <div className='w-1/2 ml-5 phone:ml-0 phone:w-full h-auto rounded-lg overflow-hidden phone:overflow-y-auto'>
          <div className='bg-white shadow-md p-5 phone:w-full phone:h-auto'>
            <p className='mb-2 font-bold text-xl phone:text-base'>
              Order Summary
            </p>
            <hr className='mb-2 border' />
            <p className='mb-2 phone:text-sm'>
              Recipient : {`${authState.firstName} ${authState.lastName}`}
            </p>
            <textarea
              className='resize-none phone:text-sm focus:outline-none border-2 border-dashed border-gray-400 rounded-md p-2 w-full h-32 phone:h-20 mb-2'
              placeholder='Address'
              name='address'
              value={form.address}
              onChange={inputHandler}
            />
            <p className='phone:text-sm'>Payment Via :</p>
            <div className='flex-col phone:flex-col'>{renderBanks()}</div>
            <hr className='my-2 border' />
            <p className='phone:text-sm'>Items = {toRupiah(renderTotal())}</p>
            <p className='mb-2 phone:text-sm'>
              Shipping Cost = {toRupiah(9000)}
            </p>
            <hr className='my-2 border' />
            <p className='font-bold phone:text-sm'>
              Grand Total = {toRupiah(renderTotal() + 9000)}
            </p>
          </div>
          {!form.address || !form.bank_id ? (
            <button className='bg-gray-200 cursor-not-allowed w-full h-14 rounded-b-lg text-black phone:text-sm'>
              Next
            </button>
          ) : (
            <Link to={`/uploadpayment/${cartState[0].order_id}`}>
              <button
                className='bg-primary1 hover:bg-peach-dark w-full h-14 rounded-b-lg text-white hover:text-black phone:text-sm'
                onClick={onCheckout}
              >
                Next
              </button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckOut;
