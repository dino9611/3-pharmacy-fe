import { Modal, Box, Pagination } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { API_URL } from '../../constants/api';
import { parseDate } from '../../helpers/parseDate';
import { toRupiah } from '../../helpers/toRupiah';
import EmptyData from './assets/empty-data.svg';
import { capitalize } from '../../helpers/capitalize';

const style = {
  position: 'absolute',
  top: {
    xs: '50%',
    md: '50%',
  },
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: {
    xs: 300,
    md: 500,
  },
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  overflow: 'scroll',
  overflowX: 'hidden',
  maxHeight: 450,
};

const ProductTransactionHistory = () => {
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);
  const userOrder = useSelector((state) => state.order.userOrder);

  const [orderLength, setOrderLength] = useState(0);
  const [page, setPage] = useState(1);
  const handleChange = (event, value) => {
    setPage(value);
  };

  const [filter, setFilter] = useState('');

  const filterList = [
    { status: 'All', value: '' },
    { status: 'Waiting For Payment', value: 'waitingpayment' },
    { status: 'Checked Out', value: 'checkout' },
    { status: 'Accepted', value: 'paymentAcc' },
    { status: 'On Process', value: 'processing' },
    { status: 'On Delivery', value: 'otw' },
    { status: 'Delivered', value: 'delivered' },
    { status: 'Rejected', value: 'paymentRej' },
  ];

  const pickFilter = (value) => {
    setFilter(value);
    setPage(1);
  };

  const renderFilterList = () => {
    return filterList.map((val, index) =>
      val.value === filter ? (
        <button
          key={index + 1}
          onClick={() => pickFilter(val.value)}
          className='px-5 py-2 phone:px-3 phone:py-1 phone:text-xs phone:whitespace-nowrap phone:max-w-full mr-2 bg-primary1 border-2 border-primary1 rounded-full text-sm font-bold text-white poppins'
        >
          {val.status}
        </button>
      ) : (
        <button
          key={index + 1}
          onClick={() => pickFilter(val.value)}
          className='bg-white px-5 py-2 phone:px-3 phone:py-1 phone:text-xs phone:whitespace-nowrap mr-2 border-solid border-2 border-primary1 rounded-full text-sm font-bold text-primary1 poppins'
        >
          {val.status}
        </button>
      )
    );
  };

  const onDelivered = async (orderId) => {
    try {
      let result = await Swal.fire({
        title: `Confirmation`,
        text: 'Confirm that your order is delivered',
        icon: 'question',
        showCancelButton: true,
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes!',
        confirmButtonColor: '#22577A',
      });
      if (result.isConfirmed) {
        let res = await axios.patch(
          `${API_URL}/transaction/transactionreq/${orderId}`,
          {
            type: 'delivered',
            user_id: authState.id,
            limit: 5
          }
        );
        dispatch({ type: 'setuserorder', payload: res.data });
        setFilter('');
        Swal.fire({
          icon: 'success',
          title: 'Confirmed!',
          timer: 1500,
          timerProgressBar: true,
          confirmButtonColor: '#22577A',
        });
      }
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  const [open, setOpen] = useState(false);
  const [historydetails, setHistorydetails] = useState([]);
  const [boughtProducts, setBoughtProducts] = useState([]);
  const modalHandler = async (id) => {
    try {
      let historyRes = await axios.get(
        `${API_URL}/transaction/historydetails/${id}`
      );
      setHistorydetails(historyRes.data);
      let boughtRes = await axios.get(
        `${API_URL}/transaction/boughtproducts/${id}`
      );
      setBoughtProducts(boughtRes.data);
      setOpen(!open);
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  const modalDetail = () => {
    const historyNoExist = historydetails.length === 0;
    const history = historydetails[0];
    const boughtNoExist = boughtProducts.length === 0;
    return (
      <Modal
        open={open}
        onClose={modalHandler}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'
      >
        <Box sx={style}>
          <p className='font-poppins font-bold text-xl text-center mb-5 phone:text-lg'>
            Transaction Details
          </p>
          <div className='font-poppins flex justify-between mb-2 text-sm phone:text-xs'>
            <p className='font-bold'>Status</p>
            <p>
              {history?.status === 'checkout' && !history?.paymentProof
                ? 'Waiting for payment'
                : ''}
              {history?.status === 'checkout' && history?.paymentProof
                ? 'Waiting for confirmation'
                : ''}
              {history?.status === 'paymentAcc' ? 'Accepted' : ''}
              {history?.status === 'processing' ? 'On process' : ''}
              {history?.status === 'otw' ? 'On Delivery' : ''}
              {history?.status === 'delivered' ? 'Delivered' : ''}
              {history?.status === 'paymentRej' ? 'Rejected' : ''}
            </p>
          </div>
          <div className='font-poppins flex justify-between mb-2 text-sm phone:text-xs'>
            <p className='font-bold'>Check Out Time</p>
            <p>{historyNoExist ? '' : parseDate(history?.checkedOutAt)}</p>
          </div>
          <div className='font-poppins flex justify-between text-sm phone:text-xs'>
            <p className='font-bold'>Payment Method</p>
            <p>{historyNoExist ? '' : history?.bank}</p>
          </div>
          <hr className='my-4' />
          <p className='font-poppins text-sm phone:text-xs font-bold mb-2'>
            Recipient :<span className='font-normal'> {history?.username}</span>
          </p>
          <p className='font-poppins text-sm phone:text-xs font-bold'>
            Address :<span className='font-normal'> {history?.address}</span>
          </p>
          <hr className='my-4' />
          {boughtProducts.map((val, index) => (
            <div
              key={index + 1}
              className='font-poppins mb-1 flex items-center shadow-md p-2 rounded'
            >
              <img
                src={API_URL + val.imagePath}
                alt={val.productName}
                className='w-16 h-16 phone:w-12 phone:h-12 mr-5'
              />
              <div>
                <p className='font-bold text-sm phone:text-xs'>
                  {boughtNoExist ? '' : capitalize(val.productName)}
                </p>
                <p className='text-sm phone:text-xs'>
                  {boughtNoExist ? '' : toRupiah(val.productPriceRp)}
                </p>
                <p className='text-sm phone:text-xs'>{val.qty} x</p>
              </div>
            </div>
          ))}
          <hr className='my-4' />
          <div className='font-poppins flex justify-between mb-2 text-sm phone:text-xs'>
            <p className='font-bold'>Total Price</p>
            <p>{historyNoExist ? '' : toRupiah(history?.totalPrice)}</p>
          </div>
          <div className='font-poppins flex justify-between mb-2 text-sm phone:text-xs'>
            <p className='font-bold'>Shipping Cost</p>
            <p>{historyNoExist ? '' : toRupiah(history?.shippingCost)}</p>
          </div>
          <div className='font-poppins flex justify-between mb-2 text-sm phone:text-xs'>
            <p className='font-bold'>Grand Total</p>
            <p className='font-bold'>
              {historyNoExist
                ? ''
                : toRupiah(history?.shippingCost + history?.totalPrice)}
            </p>
          </div>
        </Box>
      </Modal>
    );
  };

  const renderHistory = () => {
    return userOrder.map((val, index) => (
      <div
        key={index + 1}
        className='font-poppins bg-white shadow-md my-5 phone:my-2 p-4 rounded-lg'
      >
        <p className=' font-bold text-primary1 phone:text-sm'>{`Order #${val.id}`}</p>
        {val.status === 'checkout' && !val.paymentProof ? (
          <p className='text-red-500 text-xs '>
            You have not uploaded the payment proof for this order!
          </p>
        ) : (
          ''
        )}
        {val.status === 'paymentRej' ? (
          <p className='text-red-500 text-xs '>Your payment is rejected!</p>
        ) : (
          ''
        )}
        <div className='flex items-center justify-between mb-2'>
          <p className=' text-sm phone:text-xs'>
            {parseDate(val.checkedOutAt)}
          </p>
          <button
            className=' text-sm phone:text-xs text-primary1 font-bold hover:text-lightblue'
            onClick={() => modalHandler(val.id)}
          >
            Detail
          </button>
        </div>
        <hr className='mb-5' />
        {!val.product_list
          ? ''
          : val.product_list.map((val, index) => (
            <div
              key={index + 1}
              className=' mb-1 flex items-center shadow-md p-2 rounded'
            >
              <img
                src={API_URL + val.imagePath}
                alt={val.productName}
                className='w-16 h-16 mr-5'
              />
              <div>
                <p className='font-bold text-sm phone:text-xs'>
                  {capitalize(val.productName)}
                </p>
                <p className='text-sm phone:text-xs'>
                  {toRupiah(val.productPriceRp)}
                </p>
                <p className='text-sm phone:text-xs'>{val.qty} x</p>
              </div>
            </div>
          ))}
        <hr className='my-5' />
        <div className='text-right'>
          {val.status === 'checkout' && !val.paymentProof ? (
            <Link to={`/uploadpayment/${val.id}`}>
              <button className=' text-sm phone:text-xs text-white font-bold bg-primary1 hover:bg-lightblue px-3 py-2 rounded-lg'>
                Upload Payment
              </button>
            </Link>
          ) : (
            ''
          )}

          {val.status === 'checkout' && val.paymentProof ? (
            <p className=' text-sm phone:text-xs text-right text-primary1'>
              Waiting for confirmation
            </p>
          ) : (
            ''
          )}

          {val.status === 'paymentRej' ? (
            <Link to={`/uploadpayment/${val.id}`}>
              <button className=' text-sm phone:text-xs text-white font-bold bg-primary1 hover:bg-lightblue px-2 py-2 rounded-lg'>
                Resent Payment Proof
              </button>
            </Link>
          ) : (
            ''
          )}

          {val.status === 'paymentAcc' ? (
            <p className=' text-sm phone:text-xs text-right text-primary1'>
              Waiting for your order to be processed
            </p>
          ) : (
            ''
          )}

          {val.status === 'processing' ? (
            <p className=' text-sm phone:text-xs text-right text-primary1'>
              Your order is being processed
            </p>
          ) : (
            ''
          )}

          {val.status === 'delivered' ? (
            <p className=' text-sm phone:text-xs text-right text-primary1'>
              Delivered
            </p>
          ) : (
            ''
          )}

          {val.status === 'otw' ? (
            <button
              className=' text-sm phone:text-xs text-white font-bold bg-primary1 hover:bg-lightblue px-3 py-2 rounded-lg'
              onClick={() => onDelivered(val.id)}
            >
              Confirm Delivery
            </button>
          ) : (
            ''
          )}

          {val.status === 'delivered' && !val.paymentProof ? (
            <p className=' text-sm phone:text-xs text-right text-primary1'>
              Delivered
            </p>
          ) : (
            ''
          )}
        </div>
      </div>
    ));
  };

  const [timeRange, setTimeRange] = useState('');
  const onRangeChange = (e) => {
    setTimeRange(e.target.value);
  };

  useEffect(() => {
    const getOrderLength = async () => {
      try {
        let res = await axios.get(
          `${API_URL}/transaction/orderlength/${authState.id}?filter=${filter}&range=${timeRange}`
        );
        setOrderLength(res.data[0].order_length);
      } catch (error) {
        alert(error.response.data.message);
      }
    };
    getOrderLength();

    // untuk offset pagingnya
    setPage(page);
    const offset = (page - 1) * 5;
    setTimeRange(timeRange);

    const getOrder = async () => {
      try {
        let res = await axios.get(
          `${API_URL}/transaction/getorder/${authState.id}/${offset}?filter=${filter}&range=${timeRange}`
        );
        dispatch({ type: 'setuserorder', payload: res.data });
      } catch (error) {
        alert(error.response.data.message);
      }
    };
    getOrder();
    setFilter(filter);
  }, [timeRange, filter, page]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div>
      <div className='bg-lightblue font-poppins px-20 phone:px-2 min-h-screen'>
        {modalDetail()}
        <div class='pt-5 phone:pt-2'>
          <select
            onChange={onRangeChange}
            class='w-1/4 mt-1 py-2 px-3 phone:text-xs bg-white rounded-md shadow-md focus:outline-none focus:border-primary1 phone:w-full'
          >
            <option value=''>All time</option>
            <option value='week'>Last 7 days</option>
            <option value='month'>Last 30 days</option>
          </select>
        </div>
        <div className='pt-5 phone:pt-2 flex phone:overflow-x-scroll'>
          {renderFilterList()}
        </div>
        {userOrder.length ? (
          <>
            {renderHistory()}
            <div className='w-max mx-auto pb-10'>
              <Pagination
                count={Math.ceil(orderLength / 5)}
                page={page}
                onChange={handleChange}
              />
            </div>
          </>
        ) : (
          <div className='mt-20'>
            <img
              className='w-72 phone:w-36 mx-auto mb-4'
              src={EmptyData}
              alt='empty-data'
            />
            <p className='text-primary1 text-center text-xl phone:text-sm font-bold'>
              No data
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductTransactionHistory;
