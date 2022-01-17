import React, { useEffect, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import axios from 'axios';
import { API_URL } from '../../constants/api';
import { Button } from '@mui/material';
import CreatePrescription from '../../components/CreatePrescriptionModal';

import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import { styled } from '@mui/material/styles';
import Swal from 'sweetalert2';

const CssTextField = styled(TextField)({
  '& label.Mui-focused': {
    color: '#B4C6A6',
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: '#66806A',
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: '#66806A',
    },
    '&:hover fieldset': {
      borderColor: '#FFC286',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#B4C6A6',
    },
  },
});
const dataStatus = [
  // {id: 1, status: "imgAcc", display: "Image Accepted"},
  //! disini adalah URUTAN STATUS
  { id: 0, status: 'initial', display: 'Initial Data' },
  { id: 1, status: 'waitingPayment', display: 'Waiting Payment' },
  { id: 2, status: 'waitpaymentApproval', display: 'Waiting Payment Approval' },
  { id: 3, status: 'paymentAcc', display: 'Payment Accepted' },
  { id: 4, status: 'processing', display: 'On Process' },
  { id: 5, status: 'otw', display: 'On Delivery' },
  { id: 6, status: 'delivered', display: 'Delivered' },

  //! disini adalah kumpulan ERROR
  { id: 7, status: 'imgRej', display: 'Image Rejected' },
  { id: 8, status: 'expired', display: 'Payment Expired' },
  { id: 9, status: 'paymentRej', display: 'Payment Rejected' },
  { id: 10, status: 'rejected', display: 'Rejected' },
];
const rejected = ['initial', 'waitpaymentApproval'];

const AdminPrescriptions = () => {
  //* untuk menapung data dari fetch dan mencari index suatu product
  const [customData, setcustomData] = useState([]);
  const [indexProduct, setindexProduct] = useState(-1);

  //* Modal Custom ORDER
  const [openCreate, setopenCreate] = useState(false);
  const handleopenCreate = (index) => {
    setindexProduct(index);
    setopenCreate(!openCreate);
  };
  //! handleCloseCreate dipake karena di createprescrip modal setelah obat ditambahkan terjadi error empty array
  const handleCloseCreate = () => {
    setopenCreate(!openCreate);
    setindexProduct(-1);
  };
  // const [value, setValue] = useState(1);
  //! tabs Setting
  //* status adalah tempat untuk menampung value dari tabs
  const [status, setStatus] = useState('initial');
  //* indextab adalah untuk menampung number agar bisa ditambahkan dan menyimpat string untuk next statusnya
  const [indexTab, setindexTab] = useState(0);
  //* next status adalah tempat untuk menyimpan status berikutnya dari status yang sekarang
  const [nextStatus, setnextStatus] = useState(dataStatus[1].status);
  const handleChange = (e, newValue) => {
    console.log(dataStatus[newValue].id);
    setindexTab(newValue);
    setStatus(dataStatus[newValue].status);
    setnextStatus(dataStatus[newValue + 1].status);
  };

  //? Fetch prescription data
  const getCustom = async () => {
    try {
      let results = await axios.get(`${API_URL}/custom`, {
        params: { status },
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
      });
      setcustomData(results.data);
    } catch (error) {
      alert(error);
    }
  };
  useEffect(() => {
    getCustom();
  }, [status]); // eslint-disable-line react-hooks/exhaustive-deps

  //! untuk menghitung grand total
  const [totalPrice, settotalPrice] = useState(0);
  const totalFunc = (results) => {
    console.log('masuk loop func');
    let total = 0;
    for (let i = 0; i < results.data.length; i++) {
      total += results.data[i].priceRp * results.data[i].qty;
    }
    return settotalPrice(total);
  };

  //! PaymentProof Handler
  const imagePayment = (index) => {
    Swal.fire({
      title: 'Sweet!',
      text: 'This is your payment proof',
      imageUrl: `${API_URL + customData[index].paymentProof}`,
      imageWidth: 400,
      imageHeight: 300,
      imageAlt: 'Payment Proof Errors',
    });
  };
  //! Reject Handler
  const rejectHandler = (index) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        let statusReject;
        if (status == 'initial') {
          statusReject = 'imgRej';
        } else {
          statusReject = 'paymentRej';
        }
        let updateStatus = {
          id: customData[index].id,
          nextStatus: statusReject,
        };
        axios
          .patch(`${API_URL}/custom/nextstatus`, updateStatus, {
            headers: {
              Authorization: 'Bearer ' + localStorage.getItem('token'),
            },
          })
          .then(() => {
            getCustom();
            Swal.fire('Deleted!', 'Your file has been deleted.', 'success');
          })
          .catch(() => {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Something went wrong!',
            });
          });
      }
    });
  };

  //! Dialog Accept
  const [acceptData, setacceptData] = useState([]);
  const [openAcceptDialog, setopenAcceptDialog] = useState(false);
  const [commitProtect, setcommitProtect] = useState(true);
  const dummyButt = () => {
    console.log(totalPrice);
    console.log(totalPrice * (20 / 100));
  };
  const acceptHandler = async (index) => {
    try {
      if (!customData[index].prescriptionName) {
        alert('check prescriptionName');
        return;
      }
      console.log(customData[index]);
      setindexProduct(index);
      //! axios yang pertama untuk mengecek apakah prescription tersebut sudah
      //! ada medicine/obatnya atau belum, kalo belum ada maka di throw dibackend
      let results = await axios.get(
        `${API_URL}/custom/medicine/${customData[index].id}`,
        {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token'),
          },
        }
      );
      results = await axios.get(
        `${API_URL}/custom/details/${customData[index]?.id}`,
        {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token'),
          },
        }
      );
      if (results.data.length) {
        totalFunc(results);
      }
      setacceptData(results.data);
      setopenAcceptDialog(!openAcceptDialog);
      // console.log(results)
      // console.log(nextStatus)
    } catch (error) {
      console.log(error);
      alert(error.response.data.message);
    }
  };
  const closeAcceptDialog = () => {
    setopenAcceptDialog(!openAcceptDialog);
    setindexProduct(-1);
    settotalPrice(0);
    setcommitProtect(true);
  };
  const protectHandler = () => {
    setcommitProtect(!commitProtect);
  };
  const commitHandler = async () => {
    try {
      if (status === 'initial') {
        let cost = totalPrice;
        let profit = totalPrice * (20 / 100);
        let updateCostProfit = {
          id: customData[indexProduct].id,
          cost,
          profit,
        };
        await axios.patch(`${API_URL}/custom/costprofit`, updateCostProfit, {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token'),
          },
        });
      }
      let updateStatus = {
        id: customData[indexProduct].id,
        nextStatus: nextStatus,
      };
      await axios.patch(`${API_URL}/custom/nextstatus`, updateStatus, {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
      });
      getCustom();
      alert('berhasil');
      setcommitProtect(!commitProtect);
      closeAcceptDialog();
    } catch (error) {
      console.log(error);
      alert(error);
    }
  };
  const dialogAccept = () => {
    let dataProduct = customData[indexProduct];
    return (
      <Dialog
        maxWidth={'md'}
        open={openAcceptDialog}
        onClose={closeAcceptDialog}
      >
        <DialogTitle>Detail & Update Prescription</DialogTitle>
        <DialogContent>
          <div className='flex justify-evenly'>
            <img
              className='object-contain h-64 w-96 bg-gray-200 rounded-lg'
              src={API_URL + dataProduct?.image}
              alt={dataProduct?.image}
            ></img>
            <DialogContentText sx={{ ml: 6 }}>
              <div className=' flex text-center mb-4'>
                <div className='flex-1'>Medicine</div>
                <div className='flex-1'>Quantity</div>
                <div className='flex-1'>Price/Qty</div>
              </div>
              {acceptData.map((val, index) => {
                return (
                  <div key={index} className=' flex text-center mt-1'>
                    <div className='flex-1'>{val.medicineName}</div>
                    <div className='flex-1'>{val.qty}</div>
                    <div className='flex-1'>{val.priceRp}</div>
                  </div>
                );
              })}
              <Divider sx={{ mt: 2 }} />
              <div className='flex justify-between mt-4'>
                <div>Total Product Price</div>
                <div className='mr-7'>Rp {totalPrice}</div>
              </div>
              <div className='flex justify-between mt-4'>
                <div>Custom Prescription Fee</div>
                <div className='mr-7'>Rp {totalPrice * (20 / 100)}</div>
              </div>
              <Divider sx={{ mt: 2 }} />
              <div className='flex justify-between mt-4'>
                <div>Grand Total</div>
                <div className='mr-7'>
                  Rp {totalPrice + totalPrice * (20 / 100)}
                </div>
              </div>
              <FormControlLabel
                sx={{ mt: 10, color: '#66806A', fontSize: 7 }}
                onChange={protectHandler}
                labelPlacement='end'
                control={<Checkbox />}
                label='Please double check details product before you update status Data Product'
              />
            </DialogContentText>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeAcceptDialog} sx={{ color: '#66806A' }}>
            Cancel
          </Button>
          <Button
            sx={{ color: '#66806A' }}
            disabled={commitProtect ? true : false}
            onClick={commitHandler}
          >
            Commit
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  //! Dialog Details
  const [openDialog, setopenDialog] = useState(false);
  const [detailData, setdetailData] = useState([]);
  //* customname dan editHandler untuk store prescriptionName
  const [customName, setcustomName] = useState('');
  const editHandler = (e) => {
    setcustomName(([e.target.name] = e.target.value));
  };
  const saveHandler = async () => {
    try {
      let updateData = {
        id: customData[indexProduct].id,
        prescriptionName: customName,
      };
      await axios.patch(`${API_URL}/custom/custname`, updateData, {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
      });
      // console.log(updateData.customName)
      getCustom();
      alert('berhasil');
      handlecloseDialog();
    } catch (error) {
      console.log(error);
      alert(error);
    }
  };
  const handleopenDialog = async (index) => {
    setindexProduct(index);
    try {
      let results = await axios.get(
        `${API_URL}/custom/details/${customData[index]?.id}`,
        {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token'),
          },
        }
      );
      setdetailData(results.data);
      setopenDialog(!openDialog);
      //? looping grandtotal
      if (results.data.length) {
        totalFunc(results);
      }
      // alert("Create Medicine First")
    } catch (error) {
      console.log(error);
      alert(error);
    }
  };
  const handlecloseDialog = () => {
    setopenDialog(!openDialog);
    setindexProduct(-1);
    settotalPrice(0);
  };
  const dialogUpdate = () => {
    let dataProduct = customData[indexProduct];
    return (
      <Dialog maxWidth={'md'} open={openDialog} onClose={handlecloseDialog}>
        <DialogTitle>Detail & Update Prescription</DialogTitle>
        <DialogContent>
          <div className='flex justify-evenly'>
            <img
              className='object-contain h-64 w-96 bg-gray-200 rounded-lg'
              src={API_URL + dataProduct?.image}
              alt={dataProduct?.image}
            ></img>
            <DialogContentText sx={{ ml: 6 }}>
              {dataProduct?.prescriptionName ? null : (
                <>
                  <CssTextField
                    fullWidth
                    label='Prescription Name'
                    margin='dense'
                    variant='standard'
                    value={customName}
                    name='prescriptionName'
                    onChange={editHandler}
                  />
                  <div className='text-red-700 mb-5'>
                    Please fill the Prescription Name before continuing
                  </div>
                </>
              )}
              <div className=' flex text-center mb-4'>
                <div className='flex-1'>Medicine</div>
                <div className='flex-1'>Quantity</div>
                <div className='flex-1'>Price</div>
              </div>
              {detailData.map((val, index) => {
                return (
                  <div key={index} className=' flex text-center mt-1'>
                    <div className='flex-1'>{val.medicineName}</div>
                    <div className='flex-1'>{val.qty}</div>
                    <div className='flex-1'>{val.priceRp}</div>
                  </div>
                );
              })}
              <Divider sx={{ mt: 2 }} />
              <div className='flex justify-between mt-4'>
                <div>Total Product Price</div>
                <div className='mr-7'>Rp {totalPrice}</div>
              </div>
              <div className='flex justify-between mt-4'>
                <div>Custom Prescription Fee</div>
                <div className='mr-7'>Rp {totalPrice * (20 / 100)}</div>
              </div>
              <Divider sx={{ mt: 2 }} />
              <div className='flex justify-between mt-4'>
                <div>Grand Total</div>
                <div className='mr-7'>
                  Rp {totalPrice + totalPrice * (20 / 100)}
                </div>
              </div>
              <div className='text-right mt-12 text-yellow-500'>
                Please double check details product before you update status
                Data Product
              </div>
            </DialogContentText>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handlecloseDialog} sx={{ color: '#66806A' }}>
            Cancel
          </Button>
          {dataProduct?.prescriptionName ? (
            <DialogContentText display={'none'}></DialogContentText>
          ) : (
            <Button onClick={saveHandler} sx={{ color: '#66806A' }}>
              Save
            </Button>
          )}
        </DialogActions>
      </Dialog>
    );
  };

  //! Render Body/Row
  const renderBody = () => {
    return (
      // <TableBody sx={{ backgroundColor: '#ceeaeb' }}>
      <TableBody sx={{ backgroundColor: '#fff' }}>
        {customData.map((row, index) => (
          <TableRow
            key={index}
            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
          >
            <TableCell component='th' scope='row'>
              {row.username}
            </TableCell>
            <TableCell align='right'>
              {row.prescriptionName ? row.prescriptionName : 'No Name'}
            </TableCell>
            <TableCell align='right'>
              {row.paymentProof ? (
                <Button onClick={() => imagePayment(index)}>Click Here</Button>
              ) : (
                'Belum Bayar'
              )}
            </TableCell>
            <TableCell align='right'>
              {
                dataStatus[dataStatus.findIndex((x) => x.status === row.status)]
                  .display
              }
            </TableCell>
            <TableCell align='right'>
              <Button
                onClick={() => handleopenCreate(index)}
                sx={{ display: status == 'initial' ? 'block' : 'none' }}
              >
                Create Medicine
              </Button>
            </TableCell>
            <TableCell align='right'>
              <Button onClick={() => handleopenDialog(index)}>Details</Button>
            </TableCell>
            <TableCell align='right'>
              {row.status == 'waitingPayment' ? (
                <Button disabled>Accept</Button>
              ) : (
                <Button
                  sx={{ display: status == 'delivered' ? 'none' : 'block' }}
                  onClick={() => acceptHandler(index)}
                >
                  Accept
                </Button>
              )}
              {/* <Button onClick={() => dummyButt(index)}>Accept</Button> */}
            </TableCell>
            {rejected.includes(status) ? (
              <TableCell align='right'>
                <Button onClick={() => rejectHandler(index)}>Reject</Button>
              </TableCell>
            ) : null}
          </TableRow>
        ))}
      </TableBody>
    );
  };

  return (
    <div className='w-4/5 absolute right-0 p-2 bg-lightblue min-h-full'>
      {dialogUpdate()}
      {dialogAccept()}
      <CreatePrescription
        open={openCreate}
        handleClose={handleopenCreate}
        dataCustom={customData[indexProduct]}
        handleClosetest={handleCloseCreate}
      />
      <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
        <Tabs
          value={indexTab}
          onChange={handleChange}
          variant='fullWidth'
          scrollButtons='auto'
          // sx={{ backgroundColor: '#69dadb' }}
          sx={{ backgroundColor: '#ceeaeb' }}
        >
          <Tab value={0} label='Waiting Confirmation' />
          <Tab value={1} label='Waiting Payment' />
          <Tab value={2} label='Waiting Approval' />
          <Tab value={3} label='Payment Accepted' />
          <Tab value={4} label='Processing' />
          <Tab value={5} label='Delivery' />
          <Tab value={6} label='Delivered' />
        </Tabs>
      </Box>
      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table sx={{ minWidth: 650 }} size='medium' aria-label='a dense table'>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#22577a' }}>
              <TableCell sx={{ width: '10vw', color: 'white' }}>
                Username
              </TableCell>
              <TableCell align='right' sx={{ width: '15vw', color: 'white' }}>
                Prescription Name
              </TableCell>
              <TableCell align='right' sx={{ width: '15vw', color: 'white' }}>
                Payment Proof
              </TableCell>
              <TableCell align='right' sx={{ width: '15vw', color: 'white' }}>
                Status
              </TableCell>
              <TableCell align='right' sx={{ width: '15vw' }}></TableCell>
              <TableCell align='right' sx={{ width: '5vw' }}></TableCell>
              <TableCell align='right' sx={{ width: '5vw' }}></TableCell>
              {rejected.includes(status) ? (
                <TableCell align='right' sx={{ width: '5vw' }}></TableCell>
              ) : null}
            </TableRow>
          </TableHead>
          {renderBody()}
        </Table>
      </TableContainer>
    </div>
  );
};

export default AdminPrescriptions;
