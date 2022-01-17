import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Modal,
  Box,
  TablePagination,
} from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Swal from 'sweetalert2';
import { API_URL } from '../../constants/api';
import { capitalize } from '../../helpers/capitalize';
import { parseDate } from '../../helpers/parseDate';
import { toRupiah } from '../../helpers/toRupiah';
import EmptyData from './assets/empty-data.svg';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 'auto',
  bgcolor: 'background.paper',
  borderRadius: '15px',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  height: 550,
};

const AdminProdTransHistory = () => {
  const dispatch = useDispatch();
  const adminOrder = useSelector((state) => state.order.adminOrder);

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
    setPage(0);
  };

  const renderFilterList = () => {
    return filterList.map((val, index) =>
      val.value === filter ? (
        <button
          key={index + 1}
          onClick={() => pickFilter(val.value)}
          className='px-5 py-2 mr-2 bg-primary1 border-2 border-primary1 rounded-full text-xs font-bold text-white poppins'
        >
          {val.status}
        </button>
      ) : (
        <button
          key={index + 1}
          onClick={() => pickFilter(val.value)}
          className='px-5 py-2 mr-2 border-solid border-2 border-primary1 bg-white rounded-full text-xs font-bold text-primary1 poppins'
        >
          {val.status}
        </button>
      )
    );
  };

  const actionClick = async (value, orderId) => {
    let action = value;
    try {
      let result = await Swal.fire({
        title: `${capitalize(action)}`,
        text: `${capitalize(action)} order ${orderId}?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#34D399',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes!',
      });
      if (result.isConfirmed) {
        let res = await axios.patch(
          `${API_URL}/transaction/transactionreq/${orderId}`,
          {
            type: action,
            limit: rowsPerPage,
          }
        );
        dispatch({ type: 'setadminorder', payload: res.data });
        setFilter('');
        setPage(0);
        Swal.fire({
          icon: 'success',
          title: 'Confirmed!',
          timer: 1500,
          timerProgressBar: true,
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
    const noExist = historydetails.length === 0;
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
          <div className='flex'>
            <div className='w-96 h-full overflow-scroll overflow-x-hidden pr-3 ml-2'>
              <p className='poppins font-bold text-xl text-center mb-5'>
                Transaction Details
              </p>
              <div className='flex justify-between mb-2'>
                <p className='poppins text-sm font-bold'>Status</p>
                <p className='poppins text-sm'>
                  {history?.status === 'checkout' && !history?.paymentProof
                    ? 'Waiting for payment'
                    : ''}
                  {history?.status === 'checkout' && history?.paymentProof
                    ? 'Waiting for confirmation'
                    : ''}
                  {history?.status === 'processing' ? 'On process' : ''}
                  {history?.status === 'otw' ? 'On Delivery' : ''}
                  {history?.status === 'delivered' ? 'Delivered' : ''}
                  {history?.status === 'paymentAcc' ? 'Accepted' : ''}
                  {history?.status === 'paymentRej' ? 'Rejected' : ''}
                </p>
              </div>
              <div className='flex justify-between mb-2'>
                <p className='poppins text-sm font-bold'>Check Out Time</p>
                <p className='poppins text-sm'>
                  {noExist ? '' : parseDate(history?.checkedOutAt)}
                </p>
              </div>
              <div className='flex justify-between'>
                <p className='poppins text-sm font-bold'>Payment Method</p>
                <p className='poppins text-sm'>
                  {noExist ? '' : history?.bank}
                </p>
              </div>
              <hr className='my-4' />
              <p className='poppins text-sm font-bold mb-2'>
                Recipient :
                <span className='font-thin'> {history?.username}</span>
              </p>
              <p className='poppins text-sm font-bold'>
                Address :<span className='font-thin'> {history?.address}</span>
              </p>
              <hr className='my-4' />
              {boughtProducts.map((val, index) => (
                <div
                  key={index + 1}
                  className='mb-1 flex items-center shadow-md p-2 rounded'
                >
                  <img
                    src={API_URL + val.imagePath}
                    alt={val.productName}
                    className='w-16 h-16 mr-5'
                  />
                  <div>
                    <p className='text-sm'>
                      {boughtNoExist ? '' : capitalize(val.productName)}
                    </p>
                    <p className='text-sm'>
                      {boughtNoExist ? '' : toRupiah(val.productPriceRp)}
                    </p>
                    <p className='text-sm'>{val.qty} x</p>
                  </div>
                </div>
              ))}
              <hr className='my-4' />
              <div className='flex justify-between mb-2'>
                <p className='poppins text-sm font-bold'>Total Price</p>
                <p className='poppins text-sm'>
                  {noExist ? '' : toRupiah(history?.totalPrice)}
                </p>
              </div>
              <div className='flex justify-between mb-2'>
                <p className='poppins text-sm font-bold'>Shipping Cost</p>
                <p className='poppins text-sm'>
                  {noExist ? '' : toRupiah(history?.shippingCost)}
                </p>
              </div>
              <div className='flex justify-between mb-2'>
                <p className='poppins text-sm font-bold'>Grand Total</p>
                <p className='poppins text-sm font-bold'>
                  {noExist
                    ? ''
                    : toRupiah(history?.shippingCost + history?.totalPrice)}
                </p>
              </div>
            </div>
            <div className='w-96'>
              <p className='poppins font-bold text-xl text-center mb-5'>
                Payment Proof
              </p>
              {history?.paymentProof ? (
                <a href={API_URL + history?.paymentProof}>
                  <img
                    src={API_URL + history?.paymentProof}
                    alt=''
                    className='object-contain h-5/6 w-11/12 cursor-pointer bg-gray-200 rounded-lg mx-auto my-5'
                  />
                </a>
              ) : (
                <div className=' h-5/6 w-11/12 bg-gray-200 cursor-pointer rounded-lg mx-auto my-5 flex items-center justify-center'>
                  <p className='text-green-dark font-medium text-lg'>
                    No Payment Proof
                  </p>
                </div>
              )}
            </div>
          </div>
        </Box>
      </Modal>
    );
  };

  const renderOrderList = () => {
    return adminOrder.map((val, index) => (
      <TableRow
        key={index + 1}
        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
      >
        <TableCell align='left'>{val.id}</TableCell>
        <TableCell align='left'>{parseDate(val.checkedOutAt)}</TableCell>
        <TableCell align='left'>{val.username}</TableCell>
        <TableCell align='left'>{val.address}</TableCell>

        {val.status === 'otw' ? (
          <>
            <TableCell align='left'>Delivering</TableCell>
            <TableCell align='center'>No Action</TableCell>
          </>
        ) : (
          ''
        )}

        {val.status === 'paymentRej' ? (
          <>
            <TableCell align='left'>Rejected</TableCell>
            <TableCell align='center'>No Action</TableCell>
          </>
        ) : (
          ''
        )}

        {val.status === 'delivered' ? (
          <>
            <TableCell align='left'>Delivered</TableCell>
            <TableCell align='center'>No Action</TableCell>
          </>
        ) : (
          ''
        )}

        {val.status === 'processing' ? (
          <>
            <TableCell align='left'>Processing</TableCell>
            <TableCell align='center'>
              <button
                className='poppins text-primary1 font-bold hover:bg-primary1 hover:bg-opacity-30 px-2 py-1 rounded-sm'
                onClick={() => actionClick('deliver', val.id)}
              >
                Deliver
              </button>
            </TableCell>
          </>
        ) : (
          ''
        )}

        {val.status === 'paymentAcc' ? (
          <>
            <TableCell align='left'>Payment Accepted</TableCell>
            <TableCell align='center'>
              <button
                className='poppins text-primary1 font-bold hover:bg-primary1 hover:bg-opacity-30 px-2 py-1 rounded-sm'
                onClick={() => actionClick('process', val.id)}
              >
                Process
              </button>
            </TableCell>
          </>
        ) : (
          ''
        )}

        {val.status === 'checkout' && !val.paymentProof ? (
          <>
            <TableCell align='left'>
              User has not send the payment proof
            </TableCell>
            <TableCell align='center'>No Action</TableCell>
          </>
        ) : (
          ''
        )}

        {val.status === 'checkout' && val.paymentProof ? (
          <>
            <TableCell align='left'>Checked Out</TableCell>
            <TableCell align='center'>
              <button
                className='poppins text-primary1 font-bold hover:bg-primary1 hover:bg-opacity-30 px-2 py-1 rounded-sm mr-2'
                onClick={() => actionClick('accept', val.id)}
              >
                Accept
              </button>
              <button
                className='poppins text-red-500 font-bold hover:bg-red-100 px-2 py-1 rounded-sm'
                onClick={() => actionClick('reject', val.id)}
              >
                Reject
              </button>
            </TableCell>
          </>
        ) : (
          ''
        )}

        <TableCell align='center'>
          <button
            className='poppins text-primary1 font-bold hover:bg-primary1 hover:bg-opacity-30 px-2 py-1 rounded-sm'
            onClick={() => modalHandler(val.id)}
          >
            Detail
          </button>
        </TableCell>
      </TableRow>
    ));
  };

  const [timeRange, setTimeRange] = useState('');
  const onRangeChange = (e) => {
    setTimeRange(e.target.value);
  };

  const [orderLength, setOrderLength] = useState(0);

  // state rows per page
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(e.target.value);
  };

  // state page
  const [page, setPage] = useState(0);
  const handleChangePage = (e, newPage) => {
    setPage(newPage);
  };

  useEffect(() => {
    const getOrderLength = async () => {
      try {
        let res = await axios.get(
          `${API_URL}/transaction/adminorderlength?filter=${filter}&range=${timeRange}`
        );
        setOrderLength(res.data[0].order_length);
      } catch (error) {
        alert(error.response.data.message);
      }
    };
    getOrderLength();

    // handle paginated list products
    setRowsPerPage(rowsPerPage);
    setPage(page);
    const offset = page * rowsPerPage;

    setTimeRange(timeRange);

    // get order data
    const getOrder = async () => {
      try {
        let res = await axios.get(
          `${API_URL}/transaction/admingetorder?filter=${filter}&limit=${rowsPerPage}&offset=${offset}&range=${timeRange}`
        );
        dispatch({ type: 'setadminorder', payload: res.data });
      } catch (error) {
        alert(error.response.data.message);
      }
    };
    getOrder();

    setFilter(filter);
  }, [filter, rowsPerPage, page, timeRange]);

  return (
    <div className='ml-64 px-8 min-h-screen'>
      {modalDetail()}
      <div class='poppins pt-5'>
        <select
          onChange={onRangeChange}
          class='w-1/4 mt-1 py-2 px-3 text-sm border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:border-green-dark'
        >
          <option value=''>All time</option>
          <option value='week'>Last 7 days</option>
          <option value='month'>Last 30 days</option>
        </select>
      </div>
      <div className='pt-5'>{renderFilterList()}</div>
      {adminOrder.length ? (
        <TableContainer
          component={Paper}
          sx={{ width: '100%' }}
          className=' my-5'
        >
          <Table aria-label='simple table'>
            <TableHead sx={{ backgroundColor: '#22577A' }}>
              <TableRow>
                <TableCell sx={{ color: 'white' }} align='left'>
                  ID Order
                </TableCell>
                <TableCell sx={{ color: 'white' }} align='left'>
                  Check Out Time
                </TableCell>
                <TableCell sx={{ color: 'white' }} align='left'>
                  Username
                </TableCell>
                <TableCell sx={{ color: 'white' }} align='left'>
                  Address
                </TableCell>
                <TableCell sx={{ color: 'white', width: '12vw' }} align='left'>
                  Status
                </TableCell>
                <TableCell
                  sx={{ color: 'white', width: '13vw' }}
                  align='center'
                >
                  Action
                </TableCell>
                <TableCell
                  sx={{ color: 'white', width: '5vw' }}
                  align='center'
                ></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>{renderOrderList()}</TableBody>
          </Table>
          <TablePagination
            component='div'
            count={orderLength}
            rowsPerPageOptions={[5, 10, 15]}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            sx={{ color: 'white', backgroundColor: '#22577A' }}
          />
        </TableContainer>
      ) : (
        <div className='mt-40'>
          <img className='w-72 mx-auto mb-4' src={EmptyData} alt='empty-data' />
          <p className='text-primary1 text-center text-xl font-medium'>
            No data
          </p>
        </div>
      )}
    </div>
  );
};

export default AdminProdTransHistory;
