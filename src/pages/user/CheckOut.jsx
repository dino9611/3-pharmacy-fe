import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import Swal from 'sweetalert2'
import Header from '../../components/Header'
import { API_URL } from '../../constants/api'
import { capitalize } from '../../helpers/capitalize'
import { toRupiah } from '../../helpers/toRupiah'

const CheckOut = () => {
    const cartState = useSelector(state => state.cart)
    const authState = useSelector(state => state.auth)
    const dispatch = useDispatch()

    const [form, setForm] = useState({
        address: authState.address,
        bank_id: 0
    })

    const renderCart = () => {
        return cartState.map((val, index) => (
            <div key={index + 1} className='bg-white my-5 flex items-center rounded-lg overflow-hidden'>
                <img src={API_URL + val.imagePath} alt="" className='w-32 h-32 bg-gray-300 object-contain m-2 rounded-lg' />
                <div className='ml-5 flex flex-col'>
                    <p className='font-bold text-sm mb-2'>{capitalize(val.productName)}</p>
                    <p className='text-sm'>{`${toRupiah(val.productPriceRp)} x ${val.qty}`}</p>
                    <p className='text-sm'>= {toRupiah(val.productPriceRp * val.qty)}</p>
                </div>
            </div>
        ))
    }

    const renderBanks = () => {
        let bank = [{ id: 1, bank: 'BCA' }, { id: 2, bank: 'BRI' }, { id: 3, bank: 'TokobatPay' }]
        return bank.map((val, index) => (
            <div key={index + 1}>
                <input className='mr-2' type="radio" id={val.bank} name='bank_id' value={val.id} onChange={inputHandler} />
                <label htmlFor={val.bank}>{val.bank}</label>
            </div>
        ))
    }

    const renderTotal = () => {
        let total = 0
        cartState.forEach(val => {
            total += val.productPriceRp * val.qty
        })
        return total
    }

    const inputHandler = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const onCheckout = async () => {
        var tzoffset = (new Date()).getTimezoneOffset() * 60000;
        var localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, 19).replace('T', ' ');
        const { address, bank_id } = form
        if (!address || !bank_id) {
            Swal.fire({
                icon: 'warning',
                title: 'Oops...',
                text: 'Fill all fields',
                timer: 1500,
                timerProgressBar: true
            })
            return
        }
        try {
            let res = await axios.patch(`${API_URL}/transaction/checkout/${authState.id}`, {
                checkedOutAt: localISOTime,
                address: form.address,
                bank_id: parseInt(form.bank_id),
                shippingCost: 9000
            })
            dispatch({ type: "setcart", payload: res.data })
        } catch (error) {
            alert(error.response.data.message)
        }
    }

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
        setForm(form)
    }, [form])

    return (
        <div>
            <Header />
            <div className='poppins flex px-20 py-5 h-screen'>
                <div className='bg-green-light w-1/2 mr-5 p-5 rounded-lg overflow-x-hidden overflow-y-scroll'>
                    <p className='font-bold text-center text-2xl mb-2'>Products</p>
                    <hr />
                    {renderCart()}
                </div>
                <div className='w-1/2 ml-5 h-auto rounded-lg overflow-hidden'>
                    <div className='bg-green-light p-5'>
                        <p className='mb-2 font-bold text-xl'>Order Summary</p>
                        <hr className='mb-2' />
                        <p className='mb-2'>Recipient : {`${authState.firstName} ${authState.lastName}`}</p>
                        <textarea
                            className='resize-none focus:outline-none p-2 w-full h-32 mb-2'
                            placeholder='Address'
                            name='address'
                            value={form.address}
                            onChange={inputHandler}
                        />
                        <p>Payment Via :</p>
                        <div className='flex justify-between px-28 mb-10'>
                            {renderBanks()}
                        </div>
                        <p>Items = {toRupiah(renderTotal())}</p>
                        <p className='mb-2'>Shipping Cost = {toRupiah(9000)}</p>
                        <hr className='mb-2' />
                        <p className='font-bold'>Grand Total = {toRupiah(renderTotal() + 9000)}</p>
                    </div>
                    {!form.address || !form.bank_id ? (
                        <button
                            className='bg-green-light cursor-not-allowed w-full h-14 rounded-b-lg text-white'
                        >
                            Next
                        </button>
                    ) : (
                        <Link to={`/uploadpayment/${cartState[0].order_id}`}>
                            <button
                                className='bg-green-dark hover:bg-peach-dark w-full h-14 rounded-b-lg text-white hover:text-black'
                                onClick={onCheckout}
                            >
                                Next
                            </button>
                        </Link>
                    )}
                </div>
            </div>
        </div >
    )
}

export default CheckOut
