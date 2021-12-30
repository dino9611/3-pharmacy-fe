import { Modal, Box } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import Header from '../../components/Header'
import { API_URL } from '../../constants/api';
import { parseDate } from '../../helpers/parseDate';
import { toRupiah } from '../../helpers/toRupiah';
import EmptyData from './assets/empty-data.svg'

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    borderRadius: '15px',
    boxShadow: 24,
    p: 4,
};

const ProductTransactionHistory = () => {
    const dispatch = useDispatch()
    const authState = useSelector(state => state.auth)
    const userOrder = useSelector(state => state.order.userOrder)

    const [filter, setFilter] = useState('');

    const filterList = [
        { status: 'All', value: '' },
        { status: 'Waiting For Payment', value: 'waitingpayment' },
        { status: 'Checked Out', value: 'checkout' },
        { status: 'On Process', value: 'processing' },
        { status: 'On Delivery', value: 'otw' },
        { status: 'Delivered', value: 'delivered' },
        { status: 'Rejected', value: 'paymentRej' },
    ]

    const pickFilter = (value) => {
        setFilter(value)
    }

    const renderFilterList = () => {
        return filterList.map((val, index) =>
            val.value === filter ?
                (
                    <button
                        key={index + 1}
                        onClick={() => pickFilter(val.value)}
                        className='px-5 py-2 mr-2 bg-green-dark border-2 border-green-dark rounded-full text-sm font-bold text-white poppins'
                    >
                        {val.status}
                    </button>
                )
                :
                (
                    <button
                        key={index + 1}
                        onClick={() => pickFilter(val.value)}
                        className='bg-white px-5 py-2 mr-2 border-solid border-2 border-green-dark rounded-full text-sm font-bold text-green-dark poppins'
                    >
                        {val.status}
                    </button>
                ))
    }

    const onDelivered = async (orderId) => {
        try {
            let result = await Swal.fire({
                title: `Confirmation`,
                text: "Confirm  if your order is delivered",
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: '#687',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes!'
            })
            if (result.isConfirmed) {
                let res = await axios.patch(`${API_URL}/transaction/transactionreq/${orderId}`, {
                    type: 'delivered'
                })
                dispatch({ type: 'setuserorder', payload: res.data })
                setFilter('')
                Swal.fire({
                    icon: 'success',
                    title: 'Confirmed!',
                    timer: 1500,
                    timerProgressBar: true
                })
            }
        } catch (error) {
            alert(error.response.data.message)
        }
    }

    const [open, setOpen] = useState(false)
    const [historydetails, setHistorydetails] = useState([])
    const modalHandler = async (id) => {
        try {
            let res = await axios.get(`${API_URL}/transaction/historydetails/${id}`)
            setHistorydetails(res.data)
            setOpen(!open)
        } catch (error) {
            alert(error.response.data.message)
        }
    }

    const modalDetail = () => {
        const noExist = historydetails.length === 0
        const history = historydetails[0]
        return (
            <Modal
                open={open}
                onClose={modalHandler}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <p className='poppins font-bold text-xl text-center mb-5'>
                        Transaction Details
                    </p>
                    <div className='flex justify-between mb-2'>
                        <p className='poppins text-sm font-bold'>
                            Status
                        </p>
                        <p className='poppins text-sm' >
                            {history?.status === 'checkout' && !history?.paymentProof ? 'Waiting for payment' : ''}
                            {history?.status === 'checkout' && history?.paymentProof ? 'Waiting for confirmation' : ''}
                            {history?.status === 'processing' ? 'On process' : ''}
                            {history?.status === 'otw' ? 'On Delivery' : ''}
                            {history?.status === 'delivered' ? 'Delivered' : ''}
                            {history?.status === 'paymentRej' ? 'Rejected' : ''}
                        </p>
                    </div>
                    <div className='flex justify-between mb-2'>
                        <p className='poppins text-sm font-bold'>
                            Check Out Time
                        </p>
                        <p className='poppins text-sm'>
                            {noExist ? '' : parseDate(history?.checkedOutAt)}
                        </p>
                    </div>
                    <div className='flex justify-between'>
                        <p className='poppins text-sm font-bold'>
                            Payment Method
                        </p>
                        <p className='poppins text-sm'>
                            {noExist ? '' : history?.bank}
                        </p>
                    </div>
                    <hr className='my-4' />
                    <p className='poppins text-sm font-bold mb-2'>Recipient :
                        <span className='font-thin'> {history?.username}</span>
                    </p>
                    <p className='poppins text-sm font-bold'>
                        Address :
                        <span className='font-thin'> {history?.address}</span>
                    </p>
                    <hr className='my-4' />
                    <div className='flex justify-between mb-2'>
                        <p className='poppins text-sm font-bold'>Total Price</p>
                        <p className='poppins text-sm'>{noExist ? '' : toRupiah(history?.totalPrice)}</p>
                    </div>
                    <div className='flex justify-between mb-2'>
                        <p className='poppins text-sm font-bold'>Shipping Cost</p>
                        <p className='poppins text-sm'>{noExist ? '' : toRupiah(history?.shippingCost)}</p>
                    </div>
                    <div className='flex justify-between mb-2'>
                        <p className='poppins text-sm font-bold'>Grand Total</p>
                        <p className='poppins text-sm font-bold'>{noExist ? '' : toRupiah(history?.shippingCost + history?.totalPrice)}</p>
                    </div>
                </Box>
            </Modal>
        )
    }

    const renderHistory = () => {
        return userOrder.map((val, index) => (
            <div key={index + 1} className='bg-white shadow-md my-5 p-4 rounded-lg' >
                <p className='poppins font-bold text-green-dark'>{`Order #${val.id}`}</p>
                {val.status === 'checkout' && !val.paymentProof ? (
                    <p className='text-red-500 text-xs poppins'>You have not uploaded the payment proof for this order!</p>
                ) : ''}
                {val.status === 'paymentRej' ? (
                    <p className='text-red-500 text-xs poppins'>Your payment is rejected!</p>
                ) : ''}
                <div className='flex items-center justify-between mb-2'>
                    <p className='poppins text-sm'>{parseDate(val.checkedOutAt)}</p>
                    <button
                        className='poppins text-sm text-green-dark font-bold hover:text-green-light'
                        onClick={() => modalHandler(val.id)}
                    >
                        Detail
                    </button>
                </div>
                <hr className='mb-5' />
                <div className='text-right'>
                    {val.status === 'checkout' && !val.paymentProof ? (
                        <Link to={`/uploadpayment/${val.id}`}>
                            <button
                                className='poppins text-sm text-white font-bold bg-green-dark hover:bg-green-light px-3 py-2 rounded-lg'
                            >
                                Upload Payment
                            </button>
                        </Link>
                    ) : ''}

                    {val.status === 'checkout' && val.paymentProof ? (
                        <p className='poppins text-sm text-right text-green-dark'>
                            Waiting for confirmation
                        </p>
                    ) : ''}

                    {val.status === 'paymentRej' ? (
                        <Link to={`/uploadpayment/${val.id}`}>
                            <button
                                className='poppins text-sm text-white font-bold bg-green-dark hover:bg-green-light px-2 py-2 rounded-lg'
                            >
                                Resent Payment Proof
                            </button>
                        </Link>
                    ) : ''}

                    {val.status === 'processing' ? (
                        <p className='poppins text-sm text-right text-green-dark'>
                            Your order is being processed
                        </p>
                    ) : ''}

                    {val.status === 'delivered' ? (
                        <p className='poppins text-sm text-right text-green-dark'>
                            Delivered
                        </p>
                    ) : ''}

                    {val.status === 'otw' ? (
                        <button
                            className='poppins text-sm bg-peach-light hover:bg-peach-dark px-2 py-2 rounded-lg'
                            onClick={() => onDelivered(val.id)}
                        >
                            Confirm Delivery
                        </button>
                    ) : ''}

                    {val.status === 'delivered' && !val.paymentProof ? (
                        <p className='poppins text-sm text-right text-green-dark'>
                            Delivered
                        </p>
                    ) : ''}
                </div>
            </div >
        ))
    }

    useEffect(() => {
        const getOrder = async () => {
            try {
                let res = await axios.get(`${API_URL}/transaction/getorder/${authState.id}?filter=${filter}`)
                dispatch({ type: 'setuserorder', payload: res.data })
            } catch (error) {
                alert(error.response.data.message)
            }
        }
        getOrder()
        setFilter(filter);
    }, [filter])

    return (
        <div>
            <Header />
            <div className='px-20'>
                {modalDetail()}
                <div className='pt-5'>
                    {renderFilterList()}
                </div>
                {userOrder.length ?
                    (
                        renderHistory()
                    )
                    : (
                        <div className='mt-20'>
                            <img className='w-72 mx-auto mb-4' src={EmptyData} alt="empty-data" />
                            <p className='text-green-dark text-center text-xl font-medium'>No data</p>
                        </div>
                    )
                }
            </div>
        </div>
    )
}

export default ProductTransactionHistory
