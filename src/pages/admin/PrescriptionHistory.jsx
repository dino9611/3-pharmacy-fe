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

import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Divider from '@mui/material/Divider';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Swal from 'sweetalert2';
import { styled } from '@mui/material/styles';


const StyledTabs = styled((props) => (
    <Tabs
      {...props}
      TabIndicatorProps={{ children: <span className="MuiTabs-indicatorSpan" /> }}
    />
  ))({
    '& .MuiTabs-indicator': {
        display: 'flex',
        justifyContent: 'center',
        backgroundColor: '#69dadb',
    },
    '& .MuiTabs-indicatorSpan': {
      backgroundColor: '#69dadb',
    },
    
});
const StyledTab = styled((props) => <Tab disableRipple {...props} />)(
    ({ theme }) => ({
      color: '#fff',
      '&.Mui-selected': {
        color: '#fff',
      },
      '&.Mui-focusVisible': {
        backgroundColor: 'rgba(100, 95, 228, 0.32)',
      },
    }),
);
const dataStatus = [
    { id: 0, status: 'imgRej', display: 'Image Rejected' },
    { id: 1, status: 'rejected', display: 'Rejected' },
    { id: 2, status: 'paymentRej', display: 'Payment Rejected' },
    { id: 3, status: 'delivered', display: 'Delivered' },
];
const PrescriptionHistory = () => {
    const [customData, setcustomData] = useState([]);
    const [indexProduct, setindexProduct] = useState(-1);
    const [status, setStatus] = useState("imgRej")
    const [indexTab, setindexTab] = useState(0)


    //! Untuk menghandle table
    const handleChange = (e, newValue) => {
        // console.log(dataStatus[newValue].id)
        setindexTab(newValue)
        setStatus(dataStatus[newValue].status);
    };
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
    }, [status]);

    //! PaymentProof Handler
    const imagePayment = (index) => {
        Swal.fire({
        title: 'Sweet!',
        text: `This is your payment proof ${index}`,
        imageUrl: `${API_URL + customData[index].paymentProof}`,
        imageWidth: 400,
        imageHeight: 300,
        imageAlt: 'Payment Proof Errors',
        });
    };
    const [openDialog, setopenDialog] = useState(false);
    const [detailData, setdetailData] = useState([]);
    //* customname dan editHandler untuk store prescriptionName
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
        } catch (error) {
        console.log(error);
        alert(error);
        }
    };
    const handlecloseDialog = () => {
        setopenDialog(!openDialog);
        setindexProduct(-1);
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
                            <div className='mr-7'>Rp {dataProduct?.totalPriceRp}</div>
                        </div>
                        <div className='flex justify-between mt-4'>
                            <div>Custom Prescription Fee</div>
                            <div className='mr-7'>Rp {dataProduct?.profitRp}</div>
                        </div>
                        <Divider sx={{ mt: 2 }} />
                        <div className='flex justify-between mt-4'>
                            <div>Grand Total</div>
                            <div className='mr-7'>Rp {dataProduct?.totalPriceRp + dataProduct?.profitRp}</div>
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
            </DialogActions>
        </Dialog>
        );
    };

    //! Render Body/Row
    const renderBody = () => {
        return (
            <TableBody sx={{ backgroundColor: '#69dadb' }}>
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
                        <Button onClick={() => handleopenDialog(index)}>Details</Button>
                    </TableCell>
                </TableRow>
                ))}
            </TableBody>
        );
    };

    return (
        <div className='relative flex flex-col min-w-0 break-words w-full shadow-lg rounded bg-white my-1'>
            {dialogUpdate()}
            <Box sx={{ width: '100%', bgcolor: 'background.paper' }} >
                <StyledTabs
                value={indexTab}
                onChange={handleChange}
                variant='fullWidth'
                scrollButtons='auto'
                sx={{backgroundColor: '#38a3a5'}}
                >
                    <StyledTab value={0} label='Image Rejected' />
                    <StyledTab value={1} label='Rejected' />
                    <StyledTab value={2} label='Payment Rejected'/>
                    <StyledTab value={3} label='Delivered'/>
                </StyledTabs>
            </Box>
            <TableContainer component={Paper} sx={{ mt: 3 }}>
                <Table sx={{ minWidth: 650 }} size='medium' aria-label='a dense table'>
                <TableHead>
                    <TableRow sx={{ backgroundColor: '#22577a' }}>
                        <TableCell sx={{ width: '10vw', color: 'white'  }}>Username</TableCell>
                        <TableCell align='right' sx={{ width: '15vw', color: 'white' }}>
                            Prescription Name
                        </TableCell>
                        <TableCell align='right' sx={{ width: '15vw', color: 'white'  }}>
                            Payment Proof
                        </TableCell>
                        <TableCell align='right' sx={{ width: '15vw', color: 'white'  }}>
                            Status
                        </TableCell>
                        <TableCell align='right' sx={{ width: '15vw' }}></TableCell>
                    </TableRow>
                </TableHead>
                {renderBody()}
                </Table>
            </TableContainer>
        </div>
    )
}

export default PrescriptionHistory