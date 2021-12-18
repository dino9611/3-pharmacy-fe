import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import CartFooter from '../../components/CartFooter'
import Header from '../../components/Header'
import { API_URL } from '../../constants/api'
import { toRupiah } from '../../helpers/toRupiah'
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import EmptyCart from './assets/empty-cart.svg'

const Cart = () => {
    // global states
    const authState = useSelector(state => state.auth)
    const cartState = useSelector(state => state.cart)

    // dispatch
    const dispatch = useDispatch()

    // snackbar for added to cart
    const [snackbar, setSnackbar] = useState(false)
    const openSnackbar = () => setSnackbar(true)
    const closeSnackbar = () => setSnackbar(false)
    const action = (
        <React.Fragment>
            <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={closeSnackbar}
            >
                <CloseIcon fontSize="small" />
            </IconButton>
        </React.Fragment>
    )

    useEffect(() => {
        const getCart = async () => {
            try {
                let res = await axios.get(`${API_URL}/transaction/getcart/${authState.id}`)
                dispatch({ type: "setcart", payload: res.data })
            } catch (error) {
                alert(error)
            }
        }
        getCart()
    }, [])

    const deleteFromCart = async (index) => {
        try {
            let res = await axios.delete(`${API_URL}/transaction/deletefromcart/${authState.id}/${cartState[index].product_id}`)
            dispatch({ type: "setcart", payload: res.data })
            openSnackbar()
        } catch (error) {
            alert(error)
        }
    }

    const renderCart = () => {
        return cartState.map((val, index) => (
            <div className='bg-green-light h-44 my-5 rounded-lg flex overflow-hidden' key={index + 1}>
                <div className='w-11/12 p-4 phone:p-4 flex items-center'>
                    <img src={API_URL + val.imagePath} alt={val.productName} className='h-full w-40 rounded-lg mr-8' />
                    <p className='mr-8'>{val.productName}</p>
                    <p className='mr-8'>{toRupiah(val.productPriceRp)}</p>
                    <div className='mr-8'>
                        <button className='bg-white hover:bg-peach-dark h-10 w-10'>+</button>
                        <input type="text" className='h-10 w-14 focus:outline-none text-center' value={val.qty} />
                        <button className='bg-white hover:bg-peach-dark h-10 w-10'>-</button>
                    </div>
                    <p>Total = {toRupiah(val.productPriceRp * val.qty)}</p>
                </div>
                <button
                    className='bg-green-dark hover:bg-peach-light hover:text-black w-1/12 text-white'
                    onClick={() => deleteFromCart(index)}
                >
                    Delete
                </button>
            </div>
        ))
    }

    return (
        <div>
            <Header />
            <Snackbar
                open={snackbar}
                autoHideDuration={3000}
                onClose={closeSnackbar}
                message="Deleted from cart!"
                action={action}
            />
            {cartState.length ? (
                <>
                    <div className='px-20 phone:px-4 mb-28'>
                        {renderCart()}
                    </div>
                    <CartFooter />
                </>
            ) : (
                <div className='text-center mt-28'>
                    <img src={EmptyCart} alt="empty-cart" className='w-72 mb-4 mx-auto' />
                    <p className='text-green-dark text-lg font-bold'>No product in the cart</p>
                </div>
            )}

        </div>
    )
}

export default Cart
