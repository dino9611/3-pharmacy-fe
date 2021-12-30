import React, { useState, useEffect } from 'react'
import Header from '../components/Header'
import {
    Card, CardActions, CardContent, Button, Typography,
    CircularProgress, Pagination, InputLabel, MenuItem, FormControl,
    Select, Box, Modal, Snackbar, IconButton
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
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    bgcolor: 'background.paper',
    borderRadius: '15px',
    boxShadow: 24,
    p: 4,
};

const Products = () => {
    // global state
    const authState = useSelector(state => state.auth)
    const dispatch = useDispatch()

    // Get semua produk
    const [products, setProducts] = useState([])

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
                <Card key={index + 1} className="m-2">
                    <div className='h-60 overflow-hidden'>
                        <img src={API_URL + val.imagePath} alt="" className='min-h-full' />
                    </div>
                    <CardContent>
                        <p
                            className='poppins text-green-dark font-bold text-lg mb-4'
                        >
                            {capitalize(val.productName)}
                        </p>
                        <p
                            className='poppins text-gray-600 font-bold text-sm mb-2'
                        >
                            {toRupiah(val.productPriceRp)}
                        </p>
                        <p
                            className='poppins text-gray-400 text-sm'
                        >
                            Stock {val.stock}
                        </p>
                    </CardContent>
                    <CardActions>
                        <button
                            className='poppins text-green-dark text-sm font-bold hover:bg-green-light py-1 px-2 rounded'
                            onClick={() => addToCart(index)}
                        >
                            Add to Cart
                        </button>
                        <button
                            className='poppins text-green-dark text-sm font-bold hover:bg-green-light py-1 px-2 rounded'
                            onClick={() => productDetailsHandler(val.id)}
                        >
                            Details
                        </button>
                    </CardActions>
                </Card >
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
                        <Typography variant="h5" color="text.secondary" sx={{ fontWeight: 'bold' }}>
                            {noExist ? "" : capitalize(dataDeskripsi[0]?.productName)}
                        </Typography>
                    </div>
                    <div className="mb-4">
                        <Typography variant="body4" color="text.secondary" sx={{ fontWeight: 'bold' }}>
                            Description :
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {dataDeskripsi[0]?.description}
                        </Typography>
                    </div>
                    <div className="mb-4">
                        <Typography variant="body4" color="text.secondary" sx={{ fontWeight: 'bold' }}>
                            Category :
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {noExist ? "" : capitalize(dataDeskripsi[0]?.categoryName)}
                        </Typography>
                    </div>
                    <div>
                        <Typography variant="body4" color="text.secondary" sx={{ fontWeight: 'bold' }}>
                            Composition :
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {noExist ? "" : capitalize(dataDeskripsi[0]?.composition)}
                        </Typography>
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
                let res = await axios.get(`${API_URL}/product/getproducts?search=${search}&kategori=${kategori}`)
                setProducts(res.data)
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
        setSearch(debouncedSearch)
        setFilter(filter)
        setKategori(kategori)

        // fetch produk yg sudah dipaginasi
        const paginated = async () => {
            setSpinner(false)
            setHideProductlist(true)
            try {
                let res = await axios.get(`${API_URL}/product/gethomepagination/${offset}?search=${search}&filter=${filter}&kategori=${kategori}`)
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
            <div className="pt-6">
                <div className=" flex justify-center mb-4">
                    <input
                        className="poppins text-sm border border-gray-300 border-solid focus:outline-none focus:border-green-700  px-4 rounded-md mr-2"
                        type="text"
                        placeholder="Search medicine"
                        onChange={searchHandler}
                    />
                    <FormControl sx={{ minWidth: 250, marginRight: 1 }}>
                        <InputLabel id="demo-simple-select-label" color="success">Sort</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={filter}
                            label="Sort"
                            onChange={handleChangeFilter}
                            color="success"
                        >
                            <MenuItem value="default">Sort by the latest</MenuItem>
                            <MenuItem value="lowest">Price: Lowest to Highest</MenuItem>
                            <MenuItem value="highest">Price: Highest to Lowest</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl sx={{ minWidth: 150 }}>
                        <InputLabel id="demo-simple-select-label" color="success">Category</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={kategori}
                            label="Category"
                            onChange={handleChangeKategori}
                            color="success"
                        >
                            <MenuItem value={0}>All Categories</MenuItem>
                            {dataKategori.map((val, index) => (
                                <MenuItem key={index + 1} value={val.id}>{val.categoryName}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </div>
                <div className="text-center mb-16">
                    <label htmlFor="contained-button-file">
                        <Input accept="image/*" id="contained-button-file" multiple type="file" />
                        <Button variant="contained" component="span" style={{ backgroundColor: "#66806a" }}>
                            Upload Prescription
                        </Button>
                    </label>
                    <label htmlFor="icon-button-file">
                        <Input accept="image/*" id="icon-button-file" type="file" />
                    </label>
                </div>
                <div hidden={spinner} className="text-center mb-10">
                    <CircularProgress sx={{ color: "#66806a" }} />
                </div>
                {paginatedProducts.length ? (
                    <div hidden={hideproductlist}>
                        <div className="grid grid-cols-4 grid-flow-row gap-2 w-3/4 mx-auto mb-10">
                            {renderProducts()}
                        </div>
                    </div>
                ) : (
                    <div hidden={hideproductlist} className="text-center mt-24 mb-10">
                        <img src={EmptyProducts} alt="hai" className="w-1/3 mx-auto mb-6" />
                        <p className="text-lg font-bold text-green-dark">Tidak ada produk</p>
                    </div>
                )}
                <div className="mb-10 w-max mx-auto">
                    <Pagination count={Math.ceil(products.length / 8)} page={page} onChange={handleChange} />
                </div>
                <Footer />
            </div>
        </div>
    )
}

export default Products
