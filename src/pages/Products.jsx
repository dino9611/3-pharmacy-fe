import React, { useState, useEffect } from 'react'
import Header from '../components/Header'
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import { API_URL } from '../constants/api';
import { Pagination } from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import './styles/Products.css'
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { toRupiah } from '../helpers/toRupiah';
import Footer from '../components/Footer';

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
                <Card className="m-2">
                    <CardMedia
                        component="img"
                        height="140"
                        image={`https://image.shutterstock.com/z/stock-photo-colorful-pills-and-medicines-in-the-hand-672632047.jpg`}
                        alt={val.productName}
                    />
                    <CardContent>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: "#66806a", marginBottom: 2 }}>
                            {val.productName}
                        </Typography>
                        <Typography variant="body3" color="text.secondary" sx={{ fontWeight: 'bold' }}>
                            {toRupiah(val.productPriceRp)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Stock {val.stock}
                        </Typography>
                    </CardContent>
                    <CardActions>
                        <Button size="small" color="success">Add to cart</Button>
                        <Button size="small" color="success" onClick={() => { productDetailsHandler(index) }}>Details</Button>
                    </CardActions>
                </Card >
            )
        })
    }

    // untuk cari produk
    const [search, setSearch] = useState('')
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

    // kategoriii
    const [dataKategori, setDataKategori] = useState([])

    // untuk filter produk berdasarkan kategori
    const [kategori, setKategori] = useState(0);
    const handleChangeKategori = (event) => {
        setKategori(event.target.value);
    };

    // Modal detail produk
    const [indexProduk, setIndexProduk] = useState(-1)
    const [open, setOpen] = useState(false)

    const productDetailsHandler = (index) => {
        if (index >= 0) {
            setIndexProduk(index)
            setOpen(!open)
        } else {
            setIndexProduk(-1)
            setOpen(!open)
        }
    }

    const productDetails = () => {
        const cekIndex = indexProduk < 0
        const produkIndex = paginatedProducts[indexProduk]
        return (
            <Modal
                open={open}
                onClose={productDetailsHandler}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"

            >
                <Box sx={style}>
                    <div className="mb-4">
                        <Typography variant="h5" color="text.secondary">
                            {cekIndex ? "" : produkIndex.productName}
                        </Typography>
                    </div>
                    <div className="mb-4">
                        <Typography variant="body4" color="text.secondary" sx={{ fontWeight: 'bold' }}>
                            Description :
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {cekIndex ? "" : produkIndex.description}
                        </Typography>
                    </div>
                    <div>
                        <Typography variant="body4" color="text.secondary" sx={{ fontWeight: 'bold' }}>
                            Category :
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {cekIndex ? "" : produkIndex.categoryName}
                        </Typography>
                    </div>
                </Box>
            </Modal>
        )
    }

    useEffect(() => {
        // Fetch produk untuk jumlah nomor page aja
        const getProducts = async () => {
            let res = await axios.get(`${API_URL}/product/getproducts?kategori=${kategori}`)
            setProducts(res.data)
        }
        getProducts()

        // fetch kategori
        const getCategories = async () => {
            let res = await axios.get(`${API_URL}/product/getcategories`)
            setDataKategori(res.data)
        }
        getCategories()

        // untuk offset pagingnya
        setPage(page)
        const offset = ((page - 1)) * 8

        // filter
        setSearch(search)
        console.log(search);
        setFilter(filter)
        setKategori(kategori)

        // fetch produk yg sudah dipaginasi
        const paginated = async () => {
            let res = await axios.get(`${API_URL}/product/gethomepagination/${offset}?filter=${filter}&kategori=${kategori}`)
            setPaginatedProducts(res.data)
        }
        paginated()
    }, [page, search, filter, kategori])

    return (
        <div>
            <Header />
            {productDetails()}
            <div className="mt-6">
                <div className=" flex justify-center mb-4">
                    <input
                        className="focus:outline-none bg-grey-light p-2 rounded-xl mr-2"
                        type="text"
                        placeholder="Search medicine"
                        onChange={searchHandler}
                    />
                    <FormControl sx={{ minWidth: 120, marginRight: 1 }}>
                        <InputLabel id="demo-simple-select-label" color="success">Filter</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={filter}
                            label="Filter"
                            onChange={handleChangeFilter}
                            color="success"
                        >
                            <MenuItem value="default">Default</MenuItem>
                            <MenuItem value="lowest">Lowest</MenuItem>
                            <MenuItem value="highest">Highest</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl sx={{ minWidth: 120 }}>
                        <InputLabel id="demo-simple-select-label" color="success">Category</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={kategori}
                            label="Category"
                            onChange={handleChangeKategori}
                            color="success"
                        >
                            <MenuItem value={0}>Default</MenuItem>
                            {dataKategori.map((val, index) => (
                                <MenuItem value={val.id}>{val.categoryName}</MenuItem>
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
                <div className="grid grid-cols-4 grid-flow-row gap-2 w-3/4 mx-auto mb-10">
                    {renderProducts()}
                </div>
                <div className="mb-10 w-max mx-auto">
                    <Pagination count={Math.ceil(products.length / 8)} page={page} onChange={handleChange} />
                </div>
                <Footer />
            </div>
        </div>
    )
}

export default Products
