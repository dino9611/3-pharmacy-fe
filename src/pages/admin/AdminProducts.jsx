import React, { useEffect, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {
  TablePagination,
  TextField,
  Button,
  Modal,
  Box,
  Typography,
} from '@mui/material';
import axios from 'axios';
import { API_URL } from '../../constants/api';
import EmptyProducts from './assets/empty-products.svg'
import { toRupiah } from '../../helpers/toRupiah';
import { useDebounce } from 'use-debounce';
import CreateModal from '../../components/CreateProductModal';

// Modal style
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 350,
  bgcolor: 'background.paper',
  borderRadius: '15px',
  boxShadow: 24,
  p: 4,
};

const AdminProducts = () => {
  // state product
  const [products, setProducts] = useState([]);

  // modal tambah produk
  const [addModalOpen, setAddModalOpen] = useState(false);
  const openAddModal = () => {
    setAddModalOpen(!addModalOpen);
  };

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

  // paginated product list
  const [paginatedProducts, setPaginatedProducts] = useState([]);

  // search
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebounce(search, 1000);
  const searchHandler = (e) => {
    setSearch(e.target.value);
  };

  // data deskripsi
  const [dataDeskripsi, setDataDeskripsi] = useState([])

  // modal detail produk
  const [indexProduk, setIndexProduk] = useState(-1);
  const [openModal, setOpenModal] = useState(false);
  const productDetailsHandler = (index) => {
    if (index >= 0) {
      setIndexProduk(index);
      setOpenModal(!openModal);
    } else {
      setIndexProduk(-1);
      setOpenModal(!openModal);
    }
  };
  const productDetails = () => {
    const cekIndex = indexProduk < 0;
    const descIndex = dataDeskripsi.findIndex(x => x.id == paginatedProducts[indexProduk]?.id)
    const produkIndex = dataDeskripsi[descIndex]
    return (
      <Modal
        open={openModal}
        onClose={productDetailsHandler}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'
      >
        <Box sx={style}>
          <div className="mb-4">
            <Typography variant="h5" color="text.secondary">
              {cekIndex ? "" : produkIndex.productName}
            </Typography>
          </div>
          {cekIndex ? "" : (
            <div className='h-56 overflow-hidden mb-4 bg-grey-light'>
              <img className='mx-auto max-h-full' src={API_URL + produkIndex.imagePath} alt={produkIndex.productName} />
            </div>
          )}
          <div className="mb-4">
            <Typography variant="body4" color="text.secondary" sx={{ fontWeight: 'bold' }}>
              Description :
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {cekIndex ? "" : produkIndex.description}
            </Typography>
          </div>
          <div className="mb-4">
            <Typography variant="body4" color="text.secondary" sx={{ fontWeight: 'bold' }}>
              Category :
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {cekIndex ? "" : produkIndex.categoryName}
            </Typography>
          </div>
          <div>
            <Typography variant="body4" color="text.secondary" sx={{ fontWeight: 'bold' }}>
              Composition :
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {cekIndex ? "" : produkIndex.composition}
            </Typography>
          </div>
        </Box>
      </Modal>
    )
  }

  useEffect(() => {
    // fetch data products
    const getProducts = async () => {
      try {
        let res = await axios.get(`${API_URL}/product/admingetproducts?search=${search}`)
        setProducts(res.data)
      } catch (error) {
        alert(error)
      }
    }
    getProducts()

    // fetch description
    const getDescription = async () => {
      try {
        let res = await axios.get(`${API_URL}/product/getdescription`)
        setDataDeskripsi(res.data)
      } catch (error) {
        alert(error);
      }
    }
    getDescription()

    // handle paginated list products
    setRowsPerPage(rowsPerPage);
    setPage(page);
    const offset = page * rowsPerPage;

    // search
    setSearch(debouncedSearch);

    // paginated product list
    const paginate = async () => {
      try {
        let res = await axios.get(
          `${API_URL}/product/getproductspagination/${rowsPerPage}/${offset}?search=${search}`
        );
        setPaginatedProducts(res.data);
      } catch (error) {
        alert(error);
      }
    };
    paginate();
  }, [rowsPerPage, page, debouncedSearch]);

  return (
    <div>
      <CreateModal
        title='Add Product'
        open={addModalOpen}
        handleClose={openAddModal}
        setOpen={openAddModal}
      />
      {productDetails()}
      <div className=' ml-60 py-6'>
        <div className='mb-6 text-center'>
          <Button
            variant='contained'
            style={{ marginRight: 10, backgroundColor: '#66806a' }}
            onClick={openAddModal}
          >
            Add Product
          </Button>
          <TextField
            size='small'
            id='outlined-basic'
            label='Search products'
            onChange={searchHandler}
            color='success'
          />
        </div>
        {paginatedProducts.length ? (
          <>
            <TableContainer
              component={Paper}
              sx={{ width: '65vw' }}
              className='mx-auto'
            >
              <Table aria-label='simple table'>
                <TableHead>
                  <TableRow sx={{ height: '13vh', backgroundColor: '#b4c6a6' }}>
                    <TableCell sx={{ width: '33vw' }} align='left'>
                      Product
                    </TableCell>
                    <TableCell sx={{ width: '33vw' }} align='left'>
                      Price
                    </TableCell>
                    <TableCell sx={{ width: '33vw' }} align='left'>
                      Stock
                    </TableCell>
                    <TableCell sx={{ width: '0vw' }} align='left'></TableCell>
                    <TableCell sx={{ width: '0vw' }} align='left'></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedProducts.map((row, index) => (
                    <TableRow
                      key={row.productName}
                      sx={{
                        '&:last-child td, &:last-child th': { border: 0 },
                        height: '13vh',
                      }}
                      hover={true}
                    >
                      <TableCell component='th' scope='row' align='left'>
                        {row.productName}
                      </TableCell>
                      <TableCell align='left'>
                        {toRupiah(row.productPriceRp)}
                      </TableCell>
                      <TableCell align='left'>{row.stock}</TableCell>
                      <TableCell align='left'>
                        <Button
                          sx={{ color: '#66806a' }}
                          onClick={() => productDetailsHandler(index)}
                          variant='text'
                        >
                          Details
                        </Button>
                      </TableCell>
                      <TableCell align='left'>
                        <Button sx={{ color: '#66806a' }} variant='text'>
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <TablePagination
                component='div'
                count={products.length}
                rowsPerPageOptions={[5, 10]}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                sx={{ backgroundColor: '#b4c6a6' }}
              />
            </TableContainer>
          </>
        ) : (
          <>
            <div className='text-center mt-24 text-green-dark'>
              <img
                src={EmptyProducts}
                alt='hai'
                className='w-1/3 mx-auto mb-6'
              />
              <p className='text-lg font-bold'>Product is not found</p>
            </div >
          </>
        )}
      </div >
    </div >
  );
}

export default AdminProducts
