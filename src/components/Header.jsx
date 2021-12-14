import React, { useState } from 'react'
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import { useSelector } from 'react-redux';
import './styles/Header.css'
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router";
import { useDispatch } from 'react-redux';
import Login from './Login';
import Register from './Register';
import ForgetPass from './ForgetPassword';
import { styled } from '@mui/material/styles';

const Header = () => {
    const authState = useSelector(state => state.auth)
    const dispatch = useDispatch()

    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const onLogout = () => {
        dispatch({ type: "logout" })
        localStorage.removeItem("token")
    }
    // Button Signup
    const ColorButton = styled(Button)(({ theme }) => ({
        borderRadius: 16,
        color: 'black',
        backgroundColor: '#FFC286',
        '&:hover': {
            backgroundColor: '#66806A',
            color: 'white'
        },
    }));
    // Modal login
    const [openLogin, setOpenLogin] = useState(false)
    const handleOpenLogin = () => setOpenLogin(true);
    const handleCloseLogin = () => setOpenLogin(false)

    //Ini Modal Dialog Forget Password
    const [openDialog, setopenDialog] = useState(false)
    const handleopenDialog = () => {
        setOpen(false)
        setopenDialog(true)
    }
    const handlecloseDialog = () => setopenDialog(false)

    // Modal Register
    const [open, setOpen] = useState(false)
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false)


    // Navigate
    const navigate = useNavigate()
    const toProfile = () => {
        navigate("/profile")
    }
    return (
        <div className="flex items-center bg-green-dark h-24 px-6">
            <Login open={openLogin} handleClose={handleCloseLogin} />
            <Register open={open} handleClose={handleClose} setOpen={setOpen} handleopenDialog={handleopenDialog} />
            <ForgetPass setopenDialog={setopenDialog} openDialog={openDialog} handlecloseDialog={handlecloseDialog} handleopenDialog={handleopenDialog} />
            <Link to="/" style={{ marginRight: "2%" }}>
                <h1 className="header-font-style">Tokobat</h1>
            </Link>
            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                <IconButton
                    size="large"
                    aria-label="account of current user"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    onClick={handleOpenNavMenu}
                    color="inherit"
                >
                    <MenuIcon />
                </IconButton>
                <Menu
                    id="menu-appbar"
                    anchorEl={anchorElNav}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    keepMounted
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                    }}
                    open={Boolean(anchorElNav)}
                    onClose={handleCloseNavMenu}
                    sx={{
                        display: { xs: 'block', md: 'none' },
                    }}
                >
                    <Link to="/products">
                        <Typography textAlign="center">Products</Typography>
                    </Link>
                </Menu>
            </Box>
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                <Link to="/products">
                    <Button
                        onClick={handleCloseNavMenu}
                        sx={{ my: 2, color: 'white', display: 'block' }}
                    >
                        Products
                    </Button>
                </Link>
            </Box>
            {authState.isLogin ? (
                <>
                    <Typography sx={{ mr: 2, display: { xs: 'none', md: 'flex' } }} className="text-light-light" >
                        {authState.username}
                    </Typography>
                    <Box sx={{ flexGrow: 0 }}>
                        <Tooltip title="Open settings">
                            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
                            </IconButton>
                        </Tooltip>
                        <Menu
                            sx={{ mt: '45px' }}
                            id="menu-appbar"
                            anchorEl={anchorElUser}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorElUser)}
                            onClose={handleCloseUserMenu}
                        >
                            <MenuItem onClick={toProfile}>
                                <Typography textAlign="center">My profile</Typography>
                            </MenuItem>
                            <MenuItem onClick={onLogout}>
                                <Typography textAlign="center">Log out</Typography>
                            </MenuItem>
                        </Menu>
                    </Box>
                </>
            ) : (
                <>
                    <Button variant="text" style={{ color: "white" }} onClick={handleOpenLogin}>Log in</Button>
                    <ColorButton variant="contained" className='' onClick={handleOpen}>Sign up</ColorButton>
                </>
            )}
        </div>
    );
}

export default Header
