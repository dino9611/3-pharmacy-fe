import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import CartFooter from '../../components/CartFooter';
import { API_URL } from '../../constants/api';
import { toRupiah } from '../../helpers/toRupiah';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import EmptyCart from './assets/empty-cart.svg';
import { capitalize } from '../../helpers/capitalize';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  // global states
  const authState = useSelector((state) => state.auth);
  const cartState = useSelector((state) => state.cart);

  // dispatch
  const dispatch = useDispatch();

  const navigate = useNavigate()

  // snackbar for added to cart
  const [snackbar, setSnackbar] = useState(false);
  const openSnackbar = () => setSnackbar(true);
  const closeSnackbar = () => setSnackbar(false);
  const action = (
    <React.Fragment>
      <IconButton
        size='small'
        aria-label='close'
        color='inherit'
        onClick={closeSnackbar}
      >
        <CloseIcon fontSize='small' />
      </IconButton>
    </React.Fragment>
  );

  useEffect(() => {
    const getCart = async () => {
      try {
        let res = await axios.get(
          `${API_URL}/transaction/getcart/${authState.id}`,
          {
            headers: {
              Authorization: 'Bearer ' + localStorage.getItem('token'),
            },
          }
        );
        dispatch({ type: 'setcart', payload: res.data });
      } catch (error) {
        alert(error.response.data.message);
      }
    };
    getCart();
  }, [dispatch, authState]);

  const deleteFromCart = async (index) => {
    try {
      let dialog = await Swal.fire({
        title: 'Remove Item',
        text: `Remove ${cartState[index].productName} from your cart?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#22577A',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
      });
      if (dialog.isConfirmed) {
        let res = await axios.delete(
          `${API_URL}/transaction/deletefromcart/${authState.id}/${cartState[index].product_id}`,
          {
            headers: {
              Authorization: 'Bearer ' + localStorage.getItem('token'),
            },
          }
        );
        dispatch({ type: 'setcart', payload: res.data });
        openSnackbar();
      }
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  const editQuantity = async (index, value) => {
    let qty = 0;
    if (value === 'tambah') {
      qty = 1;
    } else if (value === 'kurang') {
      qty = -1;
    }
    try {
      let res = await axios.patch(
        `${API_URL}/transaction/editqty/${authState.id}`,
        {
          qty,
          product_id: cartState[index].product_id,
        },
        {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token'),
          },
        }
      );
      dispatch({ type: 'setcart', payload: res.data });
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  const renderCart = () => {
    return cartState.map((val, index) => (
      <div
        key={index + 1}
        className='flex w-full bg-white shadow-md my-5 phone:my-2 rounded-md p-5 phone:p-2'
      >
        <img
          src={API_URL + val.imagePath}
          alt=""
          className='w-1/5 h-1/5 mr-4 border-2 rounded-md'
        />
        <div className='flex flex-col justify-between w-4/5'>
          <div className='phone:mb-2'>
            <div className='flex items-center justify-between'>
              <p
                className='mb-2 phone:mb-0 phone:text-sm'
              >
                {val.productName}
              </p>
              <svg
                className="w-6 h-6 phone:w-5 phone:h-5 text-primary1 hover:opacity-50 cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"
                onClick={() => deleteFromCart(index)}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <p
              className='font-bold phone:text-sm'
            >
              {toRupiah(val.productPriceRp)}
            </p>
          </div>
          <div className='flex phone:flex-col phone:items-start justify-between items-center'>
            <p
              className='text-primary1 font-bold phone:text-sm phone:mb-1'
            >
              Total = {toRupiah(val.productPriceRp * val.qty)}
            </p>
            <div className='flex items-center'>
              <button
                onClick={() => editQuantity(index, 'kurang')}
                disabled={(val.qty <= 1 ? true : false)}
              >
                <svg
                  className={"w-6 h-6 rounded-full" +
                    (val.qty <= 1
                      ? ' text-gray-300'
                      : ' text-primary1')
                  }
                  fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
              <p className='mx-3 '>{val.qty}</p>
              <button
                onClick={() => editQuantity(index, 'tambah')}
                disabled={(val.qty >= val.stock ? true : false)}
              >
                <svg
                  className={"w-6 h-6 rounded-full" +
                    (val.qty >= val.stock
                      ? ' text-gray-300'
                      : ' text-primary1')
                  }
                  fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
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

  return (
    <div className='bg-lightblue min-h-screen'>
      <Snackbar
        open={snackbar}
        autoHideDuration={3000}
        onClose={closeSnackbar}
        message='Removed from cart!'
        action={action}
      />
      {cartState.length ? (
        <>
          <div className='px-20 phone:px-2 pb-28 flex phone:flex-col items-start font-poppins'>
            <div className='w-4/6 phone:w-full mr-4'>
              {renderCart()}
            </div>
            <div
              className='w-2/6 phone:w-full block phone:hidden bg-white mt-5 rounded-md p-5 shadow-md'
            >
              <p
                className='text-xl font-bold text-primary1'
              >
                Total spending
              </p>
              <hr className='border-2 my-2' />
              <p
                className='mb-2'
              >
                {toRupiah(renderTotal())}
              </p>
              <button
                className='bg-primary1 w-full py-2 text-white rounded-md hover:opacity-70'
                onClick={() => navigate('/checkout')}
              >
                Check out
              </button>
            </div>
          </div>
          <div className='hidden phone:block'>
            <CartFooter />
          </div>
        </>
      ) : (
        <div className='text-center pt-28 phone:pt-14'>
          <img
            src={EmptyCart}
            alt='empty-cart'
            className='w-72 phone:w-36 mb-4 mx-auto'
          />
          <p className='text-primary1 text-lg phone:text-sm font-bold'>
            No product in the cart
          </p>
        </div>
      )}
    </div>
  );
};

export default Cart;
