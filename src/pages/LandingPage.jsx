import React, { useEffect, useState } from "react";
import "./styles/landingPage.css"
import { styled } from '@mui/material/styles';
import Logo1 from "./Asset/Landingpage1.svg"
import Logo2 from "./Asset/Landingpage2.svg"
import Button from '@mui/material/Button';
import Register from "../components/Register";
import Login from "../components/Login";
import { useSelector } from "react-redux";
import Header from "../components/Header";

const LandingPage = () => {

    const authState = useSelector((state) => state.auth)

    // Modal register
    const [open, setOpen] = useState(false)
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false)

    // Modal login
    const [openLogin, setOpenLogin] = useState(false)
    const handleOpenLogin = () => setOpenLogin(true);
    const handleCloseLogin = () => setOpenLogin(false)

    const ColorButton = styled(Button)(({ theme }) => ({
        borderRadius: 16,
        color: 'black',
        backgroundColor: '#FFC286',
        '&:hover': {
            backgroundColor: '#66806A',
            color: 'white'
        },
    }));
    const ColorButton2 = styled(Button)(({ theme }) => ({
        borderRadius: 16,
        color: 'black',
        // backgroundColor: '#B4C6A6',
        '&:hover': {
            backgroundColor: '#FFC286',
            color: 'black'
        },
    }));

    return (
        <div>
            <Header />
            <Register open={open} handleClose={handleClose} />
            <Login open={openLogin} handleClose={handleCloseLogin} />
            <div className="top-cont container px-10 ">
                <div className=" flex justify-evenly items-center">
                    <div >
                        <div className="max-w-md text-3xl font-bold">Lorem ipsum dolor </div>
                        <div className="max-w-sm text-lg">sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Tincidunt nunc pulvinar sapien et ligula ullamcorper malesuada proin</div>
                    </div>
                    <div className=" img-cont">
                        <img src={Logo1} alt="Default" className="image-1" />
                    </div>
                </div>
            </div>
            <div className=" flex justify-evenly items-center pt-8 container">
                <div className="img-cont">
                    <img src={Logo2} alt="Default" className="image-2" />
                </div>
                <div>
                    <div className="max-w-md text-3xl font-bold">Lorem ipsum dolor </div>
                    <div className="max-w-sm text-lg">sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Tincidunt nunc pulvinar sapien et ligula ullamcorper malesuada proin</div>
                </div>
            </div>
        </div>
    )
}

export default LandingPage