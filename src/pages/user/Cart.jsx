import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import CartFooter from '../../components/CartFooter';
import Header from '../../components/Header';
import { API_URL } from '../../constants/api';
import { toRupiah } from '../../helpers/toRupiah';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import EmptyCart from './assets/empty-cart.svg';
import { capitalize } from '../../helpers/capitalize';

const Cart = () => {
    // global states
    const authState = useSelector((state) => state.auth);
    const cartState = useSelector((state) => state.cart);

    // dispatch
    const dispatch = useDispatch();

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
                    `${API_URL}/transaction/getcart/${authState.id}`
                );
                dispatch({ type: 'setcart', payload: res.data });
            } catch (error) {
                alert(error);
            }
        };
        getCart();
    }, [authState]);

    const deleteFromCart = async (index) => {
        try {
            let res = await axios.delete(
                `${API_URL}/transaction/deletefromcart/${authState.id}/${cartState[index].product_id}`
            );
            dispatch({ type: 'setcart', payload: res.data });
            openSnackbar();
        } catch (error) {
            alert(error);
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
                }
            );
            dispatch({ type: 'setcart', payload: res.data });
        } catch (error) {
            alert(error);
        }
    };

    const renderCart = () => {
        return cartState.map((val, index) => (
            <div className='font-poppins bg-white shadow-md h-44 phone:h-36 my-5 phone:my-2 rounded-lg flex overflow-hidden' key={index + 1}>
                <div className='w-11/12 p-4 phone:p-4 flex items-center'>
                    <img src={API_URL + val.imagePath} alt={val.productName} className='bg-gray-200 w-40 phone:w-20 h-full object-contain rounded-lg mr-8 phone:mr-2' />
                    <div className='flex items-center phone:flex-col'>
                        <p className='mr-8 phone:mr-0 phone:mb-1 phone:order-1 phone:text-xs font-bold'>{capitalize(val.productName)}</p>
                        <p className='mr-8 phone:mr-0 phone:hidden'>{toRupiah(val.productPriceRp)}</p>
                        <div className='mr-8 phone:mr-0 phone:flex phone:items-center phone:order-3'>
                            {val.qty >= val.stock ? (
                                <button disabled className='border-2 border-r-0 bg-white h-10 w-10 phone:h-5 phone:w-5 phone:text-xs cursor-not-allowed'>+</button>
                            ) : (
                                <button className='border-2 border-r-0 bg-white hover:bg-peach-dark h-10 w-10 phone:h-5 phone:w-5 phone:text-xs' onClick={() => editQuantity(index, "tambah")}>+</button>
                            )}
                            <input type="text" className='h-10 w-14 phone:h-5 phone:w-7 focus:outline-none text-center phone:text-xs border-2' value={val.qty} />
                            {val.qty <= 1 ? (
                                <button disabled className='border-2 border-l-0 bg-white h-10 w-10 phone:h-5 phone:w-5 phone:text-xs cursor-not-allowed'>-</button>
                            ) : (
                                <button className='border-2 border-l-0 bg-white hover:bg-peach-dark h-10 w-10 phone:h-5 phone:text-xs phone:w-5' onClick={() => editQuantity(index, "kurang")}>-</button>
                            )}
                        </div>
                        <p className='phone:text-xs phone:order-2 phone:mb-1 font-bold text-primary1'>{toRupiah(val.productPriceRp * val.qty)}</p>
                    </div>
                </div>
                <button
                    className='bg-primary1 hover:bg-peach-light hover:text-black w-1/12 phone:w-3/12 text-white phone:text-xs'
                    onClick={() => deleteFromCart(index)}
                >
                    Delete
                </button>
            </div>
        ))
    }

    return (
        <div className='bg-lightblue min-h-screen'>
            <Header />
            <Snackbar
                open={snackbar}
                autoHideDuration={3000}
                onClose={closeSnackbar}
                message='Deleted from cart!'
                action={action}
            />
            {cartState.length ? (
                <>
                    <div className='px-20 phone:px-2 pb-28'>{renderCart()}</div>
                    <CartFooter />
                </>
            ) : (
                <div className='text-center pt-28 phone:pt-14'>
                    <img src={EmptyCart} alt='empty-cart' className='w-72 phone:w-36 mb-4 mx-auto' />
                    <p className='text-primary1 text-lg phone:text-sm font-bold'>
                        No product in the cart
                    </p>
                </div>
            )}
        </div>
    );
};

export default Cart;
