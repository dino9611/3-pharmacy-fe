import React, { useEffect, useState } from 'react'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { TablePagination, TextField, Button } from '@mui/material';
import axios from 'axios';
import { API_URL } from '../../constants/api';
import EmptyProducts from './assets/empty-products.svg'
import AdminNavbar from '../../components/AdminNavbar';
import { toRupiah } from '../../helpers/toRupiah';
import { useDebounce } from 'use-debounce';

const AdminProducts = () => {
    // state product
    const [products, setProducts] = useState([])

    // state rows per page
    const [rowsPerPage, setRowsPerPage] = useState(5)
    const handleChangeRowsPerPage = (e) => {
        setRowsPerPage(e.target.value)

    }

    // state page
    const [page, setPage] = useState(0)
    const handleChangePage = (e, newPage) => {
        setPage(newPage)
    }

    // paginated product list
    const [paginatedProducts, setPaginatedProducts] = useState([])

    // search
    const [search, setSearch] = useState('')
    const [debouncedSearch] = useDebounce(search, 1000)
    const searchHandler = (e) => {
        setSearch(e.target.value)
    }

    useEffect(() => {
        // fetch data products
        const getProducts = async () => {
            let res = await axios.get(`${API_URL}/product/admingetproducts?search=${search}`)
            setProducts(res.data)
        }
        getProducts()

        // handle paginated list products
        setRowsPerPage(rowsPerPage)
        setPage(page)
        const offset = page * rowsPerPage

        // search
        setSearch(debouncedSearch)

        // paginated product list
        const paginate = async () => {
            let res = await axios.get(`${API_URL}/product/getproductspagination/${rowsPerPage}/${offset}?search=${search}`)
            setPaginatedProducts(res.data)
        }
        paginate()

    }, [rowsPerPage, page, debouncedSearch])

    return (
        <div>
            <AdminNavbar />
            <div className="ml-80 py-6">
                <div className="mb-6 text-center">
                    <Button variant="contained" style={{ marginRight: 10, backgroundColor: "#66806a" }}>Add Product</Button>
                    <TextField
                        size="small"
                        id="outlined-basic" label="Search products"
                        onChange={searchHandler} color="success"
                    />
                </div>
                {paginatedProducts.length ? (
                    <>
                        <TableContainer component={Paper} sx={{ width: "65vw" }} className="mx-auto">
                            <Table aria-label="simple table">
                                <TableHead>
                                    <TableRow sx={{ height: "13vh", backgroundColor: "#b4c6a6" }}>
                                        <TableCell sx={{ width: "20vw" }}>Nama</TableCell>
                                        <TableCell sx={{ width: "15vw" }} align="right">Harga</TableCell>
                                        <TableCell sx={{ width: "10vw" }} align="right">Stok</TableCell>
                                        <TableCell sx={{ width: "5vw" }} align="right">Image</TableCell>
                                        <TableCell sx={{ width: "15vw" }} align="right">Deskripsi</TableCell>
                                        <TableCell sx={{ width: "15vw" }} align="right">Kategori</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {paginatedProducts.map((row) => (
                                        <TableRow
                                            key={row.productName}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 }, height: "13vh" }}
                                        >
                                            <TableCell component="th" scope="row">
                                                {row.productName}
                                            </TableCell>
                                            <TableCell align="right">{toRupiah(row.productPriceRp)}</TableCell>
                                            <TableCell align="right">{row.stock}</TableCell>
                                            <TableCell align="right">{row.imagePath}</TableCell>
                                            <TableCell align="right">{row.description}</TableCell>
                                            <TableCell align="right">{row.categoryName}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            <TablePagination
                                component="div"
                                count={products.length}
                                rowsPerPageOptions={[5, 10]}
                                page={page}
                                onPageChange={handleChangePage}
                                rowsPerPage={rowsPerPage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                                sx={{ backgroundColor: "#b4c6a6" }}
                            />
                        </TableContainer>
                    </>

                ) : (
                    <>
                        <div className="text-center mt-24 text-green-dark">
                            <img src={EmptyProducts} alt="hai" className="w-1/3 mx-auto mb-6" />
                            <p className="text-lg font-bold">Tidak ada produk</p>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default AdminProducts
