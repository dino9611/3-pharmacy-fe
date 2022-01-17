import {
    Paper, Table, TableBody,
    TableCell, TableContainer,
    TableHead, TableRow,
    Modal, Box, Avatar,
    TablePagination
} from '@mui/material'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { API_URL } from '../../constants/api'
import { capitalize } from '../../helpers/capitalize'
import { parseBirthdate, parseDate } from '../../helpers/parseDate'
import { useDebounce } from 'use-debounce'
import EmptyStreet from './assets/empty-street.svg'

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
};

const UserList = () => {

    const [userLength, setUserLength] = useState(0)
    const [userList, setUserList] = useState([])
    const [userDetail, setUserDetail] = useState([])

    const [open, setOpen] = useState(false)
    const modalHandler = async (id) => {
        try {
            let res = await axios.get(`${API_URL}/auth/userdetail/${id}`)
            setUserDetail(res.data)
            setOpen(!open)
        } catch (error) {
            alert(error.response.data.message)
        }
    }

    const detailModal = () => {
        const user = userDetail[0]
        return (
            <Modal
                open={open}
                onClose={modalHandler}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Avatar
                        alt={user?.username}
                        src={API_URL + user?.avatar}
                        sx={{ width: 150, height: 150 }}
                        className='mx-auto mb-10'
                    />
                    <div className='font-poppins'>
                        <div className='flex items-center mb-3 text-sm'>
                            <svg className="w-5 h-5 mr-3 text-primary1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>
                            <p>
                                {user?.username}
                            </p>
                        </div>
                        <div className='flex items-center mb-3 text-sm'>
                            <svg className="w-5 h-5 mr-3 text-primary1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M14.243 5.757a6 6 0 10-.986 9.284 1 1 0 111.087 1.678A8 8 0 1118 10a3 3 0 01-4.8 2.401A4 4 0 1114 10a1 1 0 102 0c0-1.537-.586-3.07-1.757-4.243zM12 10a2 2 0 10-4 0 2 2 0 004 0z" clipRule="evenodd" /></svg>
                            <p>
                                {user?.email}
                            </p>
                        </div>
                        <div className='flex items-center mb-3 text-sm'>
                            <svg className="w-5 h-5 mr-3 text-primary1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 2a1 1 0 00-1 1v1a1 1 0 002 0V3a1 1 0 00-1-1zM4 4h3a3 3 0 006 0h3a2 2 0 012 2v9a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2zm2.5 7a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm2.45 4a2.5 2.5 0 10-4.9 0h4.9zM12 9a1 1 0 100 2h3a1 1 0 100-2h-3zm-1 4a1 1 0 011-1h2a1 1 0 110 2h-2a1 1 0 01-1-1z" clipRule="evenodd" /></svg>
                            <p>
                                {capitalize(user?.firstName ? user?.firstName : '' + ' ' + user?.lastName ? user?.lastName : '')}
                            </p>
                        </div>
                        <div className='flex items-center mb-3 text-sm'>
                            <svg className="w-5 h-5 mr-3 text-primary1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M6 3a1 1 0 011-1h.01a1 1 0 010 2H7a1 1 0 01-1-1zm2 3a1 1 0 00-2 0v1a2 2 0 00-2 2v1a2 2 0 00-2 2v.683a3.7 3.7 0 011.055.485 1.704 1.704 0 001.89 0 3.704 3.704 0 014.11 0 1.704 1.704 0 001.89 0 3.704 3.704 0 014.11 0 1.704 1.704 0 001.89 0A3.7 3.7 0 0118 12.683V12a2 2 0 00-2-2V9a2 2 0 00-2-2V6a1 1 0 10-2 0v1h-1V6a1 1 0 10-2 0v1H8V6zm10 8.868a3.704 3.704 0 01-4.055-.036 1.704 1.704 0 00-1.89 0 3.704 3.704 0 01-4.11 0 1.704 1.704 0 00-1.89 0A3.704 3.704 0 012 14.868V17a1 1 0 001 1h14a1 1 0 001-1v-2.132zM9 3a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1zm3 0a1 1 0 011-1h.01a1 1 0 110 2H13a1 1 0 01-1-1z" clipRule="evenodd" /></svg>
                            <p>
                                {user?.birthdate ? parseBirthdate(user?.birthdate) : 'Birthdate is not available'}
                            </p>
                        </div>
                        <div className='flex items-center mb-3 text-sm'>
                            <svg className="w-5 h-5 mr-3 text-primary1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M11 17a1 1 0 001.447.894l4-2A1 1 0 0017 15V9.236a1 1 0 00-1.447-.894l-4 2a1 1 0 00-.553.894V17zM15.211 6.276a1 1 0 000-1.788l-4.764-2.382a1 1 0 00-.894 0L4.789 4.488a1 1 0 000 1.788l4.764 2.382a1 1 0 00.894 0l4.764-2.382zM4.447 8.342A1 1 0 003 9.236V15a1 1 0 00.553.894l4 2A1 1 0 009 17v-5.764a1 1 0 00-.553-.894l-4-2z" /></svg>
                            <p>
                                {user?.gender ? capitalize(user?.gender) : 'Gender is not available'}
                            </p>
                        </div>
                        <div className='flex items-center mb-10 text-sm'>
                            <svg className="w-5 h-5 mr-3 text-primary1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" /></svg>
                            <p>
                                {user?.address ? user?.address : 'Address is not available'}
                            </p>
                        </div>
                        <div className='text-right'>
                            <p className='text-xs text-gray-500'>Account created at</p>
                            <p className='text-xs text-gray-500'>{parseDate(user?.createdAt)}</p>
                        </div>
                    </div>
                </Box>
            </Modal>
        )
    }


    const renderUserList = () => {
        return userList.map((val, index) => (
            <TableRow
                key={index + 1}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
                <TableCell component="th" scope="row">
                    {val.id}
                </TableCell>
                <TableCell>{val.username}</TableCell>
                <TableCell>{capitalize(val.firstName)}</TableCell>
                <TableCell>{capitalize(val.lastName)}</TableCell>
                <TableCell>
                    <button
                        className='poppins text-primary1 font-bold hover:bg-primary1 hover:bg-opacity-30 px-2 py-1 rounded-sm'
                        onClick={() => modalHandler(val.id)}
                    >
                        Detail
                    </button>
                </TableCell>
            </TableRow>
        ))
    }

    const [search, setSearch] = useState('')
    const [dSearch] = useDebounce(search, 1000)
    const searchHandler = (e) => {
        setSearch(e.target.value)
    }

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
        // dapatkan jumlah row tabel user
        const getUserLength = async () => {
            try {
                let res = await axios.get(`${API_URL}/auth/userlength?username=${search}`)
                setUserLength(res.data[0].user_length);
            } catch (error) {
                alert(error.response.data.message)
            }
        }
        getUserLength()

        setSearch(dSearch)
        // handle paginated list products
        setRowsPerPage(rowsPerPage);
        setPage(page);
        const offset = page * rowsPerPage;

        // dapatkan daftar user
        const getUserList = async () => {
            try {
                let res = await axios.get(`${API_URL}/auth/userlist?username=${search}&limit=${rowsPerPage}&offset=${offset}`)
                setUserList(res.data)
            } catch (error) {
                alert(error.response.data.message)
            }
        }
        getUserList()
    }, [dSearch, rowsPerPage, page])

    return (
        <div className='ml-64 px-8 py-6 font-poppins min-h-screen'>
            {detailModal()}
            <input
                type="text"
                className='py-2 px-3 text-sm mb-4 rounded-md focus:shadow-md focus:outline-none'
                placeholder='Search by username'
                onChange={searchHandler}
            />
            {userList.length ? (

                <TableContainer
                    component={Paper}
                    sx={{ width: '100%' }}
                >
                    <Table aria-label="simple table">
                        <TableHead sx={{ backgroundColor: '#22577a' }}>
                            <TableRow>
                                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>User ID</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Username</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>First Name</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Last Name</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {renderUserList()}
                        </TableBody>
                    </Table>
                    <TablePagination
                        component='div'
                        count={userLength}
                        rowsPerPageOptions={[5, 10, 15]}
                        page={page}
                        onPageChange={handleChangePage}
                        rowsPerPage={rowsPerPage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        sx={{ color: 'white', backgroundColor: '#22577A' }}
                    />
                </TableContainer>
            ) : (
                <div className='mt-24'>
                    <img
                        className='w-1/3 mx-auto mb-6'
                        src={EmptyStreet}
                        alt="empty"
                    />
                    <p className='text-center text-lg font-bold text-primary1'>No data</p>
                </div>
            )}
        </div >
    )
}

export default UserList
