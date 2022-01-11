import React, { useState, useEffect } from 'react'
import Header from '../components/Header'
import {
    Button, CircularProgress, Pagination,
    Box, Modal, Snackbar, IconButton
} from '@mui/material';
import axios from 'axios';
import { API_URL } from '../constants/api';
import './styles/Products.css'
import { styled } from '@mui/material/styles';
import { toRupiah } from '../helpers/toRupiah';
import Footer from '../components/Footer';
import EmptyProducts from './Asset/empty-products.svg'
import { useDebounce } from 'use-debounce';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import CloseIcon from '@mui/icons-material/Close';
import { capitalize } from '../helpers/capitalize';

// Modal style
const style = {
    position: 'absolute',
    top: {
        xs: '45%', md: '50%'
    },
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: {
        xs: 300, md: 500
    },
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    maxHeight: {
        xs: 400, md: 500
    },
    overflow: 'scroll',
    overflowX: 'hidden'
};

const Products = () => {
    // global state
    const authState = useSelector(state => state.auth)
    const dispatch = useDispatch()

    // Get semua produk
    const [products, setProducts] = useState(0)

    // Ganti page
    const [page, setPage] = useState(1);
    const handleChange = (event, value) => {
        setPage(value);
    };

    // get produk hasil paginasi
    const [paginatedProducts, setPaginatedProducts] = useState([])

    // render produk hasil paginasi
    const renderProducts = () => {
        return paginatedProducts.map((val, index) => {
            return (
                <div key={index + 1} className="m-2 bg-white rounded-md overflow-hidden p-4 shadow-md">
                    <img
                        src={API_URL + val.imagePath} alt=""
                        className='object-contain w-48 h-48 phone:w-full phone:h-24 mx-auto bg-gray-200 rounded-md mb-4'
                    />
                    <div>
                        <div className='flex justify-between items-center mb-4 phone:mb-1'>
                            <p
                                className='poppins text-primary1 font-bold text-lg phone:text-sm'
                            >
                                {capitalize(val.productName)}
                            </p>
                            <svg
                                className="w-6 h-6 phone:w-4 phone:h-4 text-primary1 hover:text-lightblue cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"
                                onClick={() => productDetailsHandler(val.id)}
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <p
                            className='poppins text-gray-600 font-bold text-sm mb-2 phone:mb-1 phone:text-xs'
                        >
                            {toRupiah(val.productPriceRp)}
                        </p>
                        <p
                            className='poppins text-gray-400 text-sm phone:text-xs'
                        >
                            Stock {val.stock}
                        </p>
                    </div>
                    <hr className='my-4 phone:my-2 border' />
                    <button
                        className='text-primary1 text-base font-bold hover:text-lightblue flex items-center phone:text-xs'
                        onClick={() => addToCart(index)}
                    >
                        <svg className="w-5 h-5 phone:w-4 phone:h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        Add to cart
                    </button>
                </div>
            )
        })
    }

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

    // add to cart
    const addToCart = async (index) => {
        if (!authState.isLogin) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'You need to login first!',
                timer: 1500,
                timerProgressBar: true
            })
            return
        }
        if (paginatedProducts[index].stock <= 0) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Out of stock!',
                timer: 1500,
                timerProgressBar: true
            })
            return
        }
        try {
            let res = await axios.post(`${API_URL}/transaction/addtocart/${authState.id}`, {
                price: paginatedProducts[index].productPriceRp,
                qty: 1,
                product_id: paginatedProducts[index].id
            })
            dispatch({ type: "setcart", payload: res.data })
            openSnackbar()
        } catch (error) {
            alert(error.response.data.message)
        }
    }

    // untuk cari produk
    const [search, setSearch] = useState('')
    const [debouncedSearch] = useDebounce(search, 1000)
    const searchHandler = (e) => {
        setSearch(e.target.value)
    }

    // untuk filter produk berdasarkan harga
    const [filter, setFilter] = useState('');
    const handleChangeFilter = (event) => {
        setFilter(event.target.value);
    };
    const Input = styled('input')({
        display: 'none',
    });

    // data kategoriii
    const [dataKategori, setDataKategori] = useState([])

    // data deskripsi
    const [dataDeskripsi, setDataDeskripsi] = useState([])

    // untuk filter produk berdasarkan kategori
    const [kategori, setKategori] = useState(0);
    const handleChangeKategori = (event) => {
        setKategori(event.target.value);
    };

    // status modal
    const [open, setOpen] = useState(false)

    // modal handler
    const productDetailsHandler = async (id) => {
        try {
            let res = await axios.get(`${API_URL}/product/getdescription/${id}`)
            setDataDeskripsi(res.data)
            setOpen(!open)
        } catch (error) {
            alert(error)
        }
    }

    // detail produk
    const productDetails = () => {
        const noExist = dataDeskripsi.length === 0
        return (
            <Modal
                open={open}
                onClose={productDetailsHandler}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <div className="mb-4">
                        <p className='font-poppins text-primary1 text-2xl phone:text-xl font-bold'>
                            {noExist ? "" : capitalize(dataDeskripsi[0]?.productName)}
                        </p>
                    </div>
                    <img
                        src={API_URL + dataDeskripsi[0]?.imagePath} alt=""
                        className='object-contain w-full h-80 phone:h-52 bg-gray-200 mb-4'
                    />
                    <div className="mb-4">
                        <p className='font-poppins font-bold phone:text-sm text-base text-gray-600'>
                            Description :
                        </p>
                        <p className='font-poppins text-sm phone:text-xs text-gray-500'>
                            {dataDeskripsi[0]?.description}
                        </p>
                    </div>
                    <div className="mb-4">
                        <p className='font-poppins font-bold phone:text-sm text-base text-gray-600'>
                            Category :
                        </p>
                        <p className='font-poppins text-sm phone:text-xs text-gray-500'>
                            {noExist ? "" : capitalize(dataDeskripsi[0]?.categoryName)}
                        </p>
                    </div>
                    <div>
                        <p className='font-poppins font-bold phone:text-sm text-base text-gray-600'>
                            Composition :
                        </p>
                        <p className='font-poppins text-sm phone:text-xs text-gray-500'>
                            {noExist ? "" : capitalize(dataDeskripsi[0]?.composition)}
                        </p>
                    </div>
                </Box>
            </Modal>
        )
    }

    // spinner
    const [spinner, setSpinner] = useState(true)
    // product list
    const [hideproductlist, setHideProductlist] = useState(false)

    useEffect(() => {
        // Fetch produk untuk jumlah nomor page aja
        const getProducts = async () => {
            try {
                let res = await axios.get(`${API_URL}/product/getproducts?search=${debouncedSearch}&kategori=${kategori}`)
                setProducts(res.data[0].product_length)
            } catch (error) {
                alert(error);
            }
        }
        getProducts()

        // fetch kategori
        const getCategories = async () => {
            try {
                let res = await axios.get(`${API_URL}/product/getcategories`)
                setDataKategori(res.data)
            } catch (error) {
                alert(error);
            }
        }
        getCategories()

        // untuk offset pagingnya
        setPage(page)
        const offset = ((page - 1)) * 8

        // filter
        setFilter(filter)
        setKategori(kategori)

        // fetch produk yg sudah dipaginasi
        const paginated = async () => {
            setSpinner(false)
            setHideProductlist(true)
            try {
                let res = await axios.get(`${API_URL}/product/gethomepagination/${offset}?search=${debouncedSearch}&filter=${filter}&kategori=${kategori}`)
                setPaginatedProducts(res.data)
            } catch (error) {
                alert(error);
            } finally {
                setSpinner(true)
                setHideProductlist(false)
            }
        }
        paginated()
    }, [page, debouncedSearch, filter, kategori])

    return (
        <div>
            <Header />
            {productDetails()}
            <Snackbar
                open={snackbar}
                autoHideDuration={3000}
                onClose={closeSnackbar}
                message="Added to cart!"
                action={action}
            />
            <div className="pt-6 phone:pt-2 font-poppins bg-lightblue">
                <div className="flex justify-center mb-4 phone:flex-col">
                    <input
                        className="h-14 shadow-md phone:h-10 phone:text-xs border-gray-300 border-solid focus:outline-none px-4 rounded-md mr-2 phone:w-11/12 phone:mx-auto phone:mb-2"
                        type="text"
                        placeholder="Search medicine"
                        onChange={searchHandler}
                    />
                    <select
                        value={filter}
                        onChange={handleChangeFilter}
                        className='h-14 shadow-md phone:h-10 phone:text-xs mr-2 bg-white px-4 rounded-md focus:outline-none appearance-none phone:w-11/12 phone:mx-auto phone:mb-2'
                    >
                        <option value="default">Sort by the latest</option>
                        <option value="lowest">Price: Lowest to Highest</option>
                        <option value="highest">Price: Highest to Lowest</option>
                    </select>
                    <select
                        value={kategori}
                        onChange={handleChangeKategori}
                        className='h-14 shadow-md phone:h-10 phone:text-xs mr-2 bg-white px-4 rounded-md focus:outline-none appearance-none phone:w-11/12 phone:mx-auto phone:mb-2'
                    >
                        <option value={0}>All Categories</option>
                        {dataKategori.map((val, index) => (
                            <option key={index + 1} value={val.id}>{val.categoryName}</option>
                        ))}
                    </select>
                </div>
                <div className="text-center mb-16 phone:mb-4">
                    <label htmlFor="contained-button-file">
                        <Input accept="image/*" id="contained-button-file" multiple type="file" />
                        <Button variant="contained" component="span" style={{ backgroundColor: "#22577A" }}>
                            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                            </svg>
                            Upload Prescription
                        </Button>
                    </label>
                    <label htmlFor="icon-button-file">
                        <Input accept="image/*" id="icon-button-file" type="file" />
                    </label>
                </div>
                <div hidden={spinner} className="text-center mb-10">
                    <CircularProgress sx={{ color: "white" }} />
                </div>
                {paginatedProducts.length ? (
                    <div hidden={hideproductlist}>
                        <div className="grid grid-cols-4 phone:grid-cols-2 grid-flow-row gap-2 phone:gap-0 w-3/4 phone:w-11/12 mx-auto mb-10">
                            {renderProducts()}
                        </div>
                    </div>
                ) : (
                    <div hidden={hideproductlist} className="text-center mt-24 mb-10">
                        <img src={EmptyProducts} alt="hai" className="w-1/3 phone:w-48 mx-auto mb-6" />
                        <p className="text-lg phone:text-sm font-bold text-primary1">Product is not found</p>
                    </div>
                )}
                <div className="mb-10 w-max mx-auto">
                    <Pagination count={Math.ceil(products / 8)} page={page} onChange={handleChange} />
                </div>
                <Footer />
            </div>
        </div>
    )
}

export default Products
