import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { API_URL } from '../../constants/api';
import axios from 'axios';
import { toast } from 'react-toastify';
import Header from '../../components/Header';

import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import { styled } from '@mui/material/styles';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import UserCustomModal from '../../components/UserCustomModal';

const dataStatus = [
  //! disini adalah URUTAN STATUS
  { id: 0, status: 'initial', display: 'Initial Data' },
  { id: 1, status: 'waitingPayment', display: 'Waiting Payment' },
  { id: 2, status: 'waitpaymentApproval', display: 'Waiting Payment Approval' },
  { id: 3, status: 'paymentAcc', display: 'Payment Accepted' },
  { id: 4, status: 'processing', display: 'On Process' },
  { id: 5, status: 'otw', display: 'On Delivery' },
  { id: 6, status: 'delivered', display: 'Delivered' },

  //! disini adalah kumpulan ERROR
  // {id: 7, status: "imgRej", display: "Image Rejected"},
  // {id: 8, status: "expired", display: "Payment Expired"},
  // {id: 9, status: "paymentRej", display: "Payment Rejected"},
  // {id: 10, status: "rejected", display: "Rejected"},
];

const Input = styled('input')({
  display: 'none',
});

const UserPrescription = () => {
  const authState = useSelector((state) => state.auth);
  const id = authState.id;
  const [dataCust, setdataCust] = useState([]);

  const getPrescription = async () => {
    try {
      let results = await axios.get(`${API_URL}/custom/usercustom`, {
        params: { id },
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
      });
      console.log(results.data);
      setdataCust(results.data);
    } catch (error) {
      alert(error);
    }
  };
  useEffect(() => {
    getPrescription();
  }, []);

  const dummyButt = (index) => {
    // console.log(authState)
    // console.log(id)
    console.log(dataCust);
    console.log(dataCust[index].id);
  };

  // Modal Custom ORDER
  const [openCustom, setopenCustom] = useState(false);
  const handleopenCustom = () => {
    if (authState.id && authState.username) {
      setopenCustom(!openCustom);
    } else {
      alert('Please Login to use this Feature');
    }
  };
  const handlecloseCustom = () => setopenCustom(false);

  //!Upload Handler
  const [idPrescription, setidPrescription] = useState(0);
  const uploadClick = (index) => {
    setidPrescription(dataCust[index].id);
  };
  const UploadHandler = async (e) => {
    if (e.target.files[0]) {
      console.log(e.target.files[0]);
      try {
        const formData = new FormData();
        formData.append('proof', e.target.files[0]);
        console.log(formData);
        let config = {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token'),
            'Content-Type': 'multipart/form-data',
          },
        };
        await axios.patch(
          `${API_URL}/custom/update/payment/${idPrescription}`,
          formData,
          config
        );
        let updateStatus = {
          id: idPrescription,
          nextStatus: 'waitpaymentApproval',
        };
        await axios.patch(`${API_URL}/custom/nextstatus`, updateStatus, {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token'),
          },
        });
        toast.success('Upload Success', {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 5000,
        });
        getPrescription();
      } catch (error) {
        console.log(error.response.data.message, 'dari sini');
        toast.error(error.response.data.message || 'Server Error', {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 5000,
        });
      }
    } else {
      alert('masuk else 99');
    }
  };

  //! Dialog Details & Handler
  const [totalPrice, settotalPrice] = useState(0);
  const [indexProduct, setindexProduct] = useState(-1);
  const [openDialog, setopenDialog] = useState(false);
  const [detailData, setdetailData] = useState([]);
  //! fungsi total untuk menjumlahkan harga obat, belum termasuk profit
  const totalFunc = (results) => {
    console.log('masuk loop func');
    let total = 0;
    for (let i = 0; i < results.data.length; i++) {
      total += results.data[i].priceRp * results.data[i].qty;
    }
    return settotalPrice(total);
  };
  const handleopenDialog = async (index) => {
    setindexProduct(index);
    try {
      let results = await axios.get(
        `${API_URL}/custom/details/${dataCust[index]?.id}`,
        {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token'),
          },
        }
      );
      console.log(results.data);
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
  const dialogDetails = () => {
    let dataProduct = dataCust[indexProduct];
    return (
      <Dialog maxWidth={'md'} open={openDialog} onClose={handlecloseDialog}>
        <DialogTitle>Detail Prescription</DialogTitle>
        <DialogContent>
          <div className='flex justify-evenly'>
            {dataProduct?.paymentProof ? (
              <img
                className='object-contain h-64 w-96 bg-gray-200 rounded-lg'
                src={API_URL + dataProduct?.paymentProof}
                alt={dataProduct?.paymentProof}
              ></img>
            ) : (
              <img
                className='object-contain h-64 w-96 bg-gray-200 rounded-lg'
                src={API_URL + dataProduct?.image}
                alt={dataProduct?.image}
              ></img>
            )}

            <DialogContentText sx={{ ml: 6 }}>
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
                <div>Total Product</div>
                <div className='mr-7'>Rp {dataProduct?.totalPriceRp}</div>
              </div>
              <div className='flex justify-between mt-4'>
                <div>Custom PrescriptionFee</div>
                <div className='mr-7'>Rp {dataProduct?.profitRp}</div>
              </div>
              <div className=' mt-12 text-yellow-500'>
                Please contact the admin if you see anything suspicious
              </div>
            </DialogContentText>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handlecloseDialog} sx={{ color: '#66806A' }}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  //! Render Card & Handler
  const renderCard = () => {
    return (
      <>
        {dataCust.map((val, index) => {
          const isStepFailed = (step) => {
            if (val.status === 'imgRej') {
              return step === 0;
            } else if (
              val.status === 'paymentRej' ||
              val.status === 'rejected'
            ) {
              return step === 2;
            } else {
              // console.log(index, "ini dari data status mapping")
              return step === -1;
            }
          };
          return (
            <Card sx={{ minWidth: 275, mb: 2.5 }}>
              <CardContent>
                <Typography variant='h5' component='div' sx={{ mb: 2 }}>
                  {val.prescriptionName
                    ? val.prescriptionName
                    : 'Data is still being processed'}
                </Typography>
                <Box sx={{ width: '100%' }}>
                  <Stepper
                    // activeStep={dataStatus.findIndex(val => val.status === "delivered")}
                    activeStep={
                      val.status === 'delivered'
                        ? dataStatus.findIndex((x) => x.status === val.status) +
                          1
                        : dataStatus.findIndex((x) => x.status === val.status)
                    }
                    alternativeLabel
                  >
                    {dataStatus.map((value, index) => {
                      const labelProps = {};
                      if (isStepFailed(index)) {
                        labelProps.optional = (
                          <Typography variant='caption' color='error'>
                            Transaction Rejected
                          </Typography>
                        );
                        labelProps.error = true;
                      }
                      return (
                        <Step key={value.id} sx={{ textAlign: 'center' }}>
                          <StepLabel {...labelProps}>{value.display}</StepLabel>
                        </Step>
                      );
                    })}
                  </Stepper>
                </Box>
              </CardContent>
              <CardActions sx={{ justifyContent: 'space-between' }}>
                <Button onClick={() => handleopenDialog(index)} size='small'>
                  Details
                </Button>
                {/* <Button onClick={() => dummyButt(index)} size="small">dummy</Button> */}
                {val.status == 'waitingPayment' ? (
                  <label htmlFor='contained-button-file'>
                    <Input
                      accept='image/*'
                      id='contained-button-file'
                      multiple
                      type='file'
                      onChange={UploadHandler}
                    />
                    <Button
                      startIcon={<FileUploadOutlinedIcon />}
                      size='small'
                      onClick={() => uploadClick(index)}
                      variant='outlined'
                      component='span'
                    >
                      Upload Payment
                    </Button>
                  </label>
                ) : null}
              </CardActions>
            </Card>
          );
        })}
      </>
    );
  };

  return (
    <div>
      {dialogDetails()}
      <UserCustomModal
        getPrescription={getPrescription}
        openCustom={openCustom}
        handleClose={handlecloseCustom}
      />
      <Divider sx={{ pt: 2 }} variant='middle'>
        <Button
          startIcon={<FileUploadOutlinedIcon />}
          size='medium'
          variant='outlined'
          component='span'
          onClick={handleopenCustom}
        >
          Upload Prescription
        </Button>
      </Divider>
      <div className='p-3 mt-2'>{renderCard()}</div>
    </div>
  );
};

export default UserPrescription;
